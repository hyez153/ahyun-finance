-- ============================================================
-- 패치 2026-04-12: 기존 DB에 적용 (schema + migration 이미 실행된 상태)
-- ※ 여러 번 실행해도 안전 (멱등성 보장)
-- ============================================================

-- ============================================================
-- 1. 카테고리 이름 수정
-- ============================================================
UPDATE public.budget_categories SET category_name = '로뎀 기도회'   WHERE category_name = '로밍 기도회';
UPDATE public.budget_categories SET category_name = '중보기도팀'    WHERE category_name = '홍보 기도팀';
UPDATE public.budget_categories SET category_name = '신입생 환영캠프' WHERE category_name = '신인생 환영캠프';

-- ============================================================
-- 1-1. 소그룹 운영비 카테고리 복구
--      migration의 LIKE '소그룹_%' 가 와일드카드로 소그룹 운영비까지
--      삭제했을 수 있으므로, 없으면 다시 넣는다
-- ============================================================
INSERT INTO public.budget_categories (group_name, category_name, annual_budget)
SELECT '양육', '소그룹 운영비', 8100000
WHERE NOT EXISTS (
  SELECT 1 FROM public.budget_categories WHERE category_name = '소그룹 운영비'
);

-- 소그룹 운영비의 budget_transactions도 복구 (삭제됐을 수 있음)
-- 복구 전 기존 migration 데이터 중 소그룹 운영비 건이 있는지 확인 후 없으면 재삽입
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT bc.id, 'prior_claim', -251250, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories bc
WHERE bc.category_name = '소그룹 운영비'
  AND NOT EXISTS (
    SELECT 1 FROM public.budget_transactions bt
    WHERE bt.budget_category_id = bc.id AND bt.source_type = 'migration' AND bt.transaction_date = '2026-02-01' AND bt.amount = -251250
  );

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT bc.id, 'prior_claim', -11500, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories bc
WHERE bc.category_name = '소그룹 운영비'
  AND NOT EXISTS (
    SELECT 1 FROM public.budget_transactions bt
    WHERE bt.budget_category_id = bc.id AND bt.source_type = 'migration' AND bt.transaction_date = '2026-02-08' AND bt.amount = -11500
  );

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT bc.id, 'prior_claim', -212300, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories bc
WHERE bc.category_name = '소그룹 운영비'
  AND NOT EXISTS (
    SELECT 1 FROM public.budget_transactions bt
    WHERE bt.budget_category_id = bc.id AND bt.source_type = 'migration' AND bt.transaction_date = '2026-03-08' AND bt.amount = -212300
  );

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT bc.id, 'prior_claim', -416830, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories bc
WHERE bc.category_name = '소그룹 운영비'
  AND NOT EXISTS (
    SELECT 1 FROM public.budget_transactions bt
    WHERE bt.budget_category_id = bc.id AND bt.source_type = 'migration' AND bt.transaction_date = '2026-03-29' AND bt.amount = -416830
  );

-- ============================================================
-- 2. claim_batches에 half 컬럼 추가 (월 2회 청구 대응)
--    이미 있으면 무시됨
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'claim_batches'
      AND column_name = 'half'
  ) THEN
    ALTER TABLE public.claim_batches ADD COLUMN half int NOT NULL DEFAULT 1 CHECK (half IN (1, 2));
    -- 기존 unique 제약 제거 후 재생성
    ALTER TABLE public.claim_batches DROP CONSTRAINT IF EXISTS claim_batches_year_month_key;
    ALTER TABLE public.claim_batches ADD CONSTRAINT claim_batches_year_month_half_key UNIQUE (year, month, half);
  END IF;
END $$;

-- ============================================================
-- 3. 마이그레이션 데이터를 영수증(receipts)에도 등록
--    file_path = 'migration'으로 구분, 실물영수증제출 표시
--    status = 'approved', is_claimed = true → 잔액 계산에 영향 없음
-- ============================================================

-- 기존 마이그레이션 영수증 삭제 (멱등성)
DELETE FROM public.receipts WHERE file_path = 'migration';

-- 목회
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 64300, '2026-02-01', '행정물품비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 69000, '2026-03-08', '행정물품비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 248290, '2026-03-29', '행정물품비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 306200, '2026-02-01', '심방비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 229780, '2026-03-08', '심방비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 149800, '2026-03-29', '심방비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 107500, '2026-02-01', '목회지원비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 76800, '2026-03-08', '목회지원비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 106000, '2026-03-29', '목회지원비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 455190, '2026-02-01', '예배준비비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 141540, '2026-03-08', '예배준비비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 249590, '2026-03-29', '예배준비비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

-- 양육
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 20000, '2026-02-01', '리더장 지원비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 113000, '2026-03-08', '리더장 지원비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 32300, '2026-02-01', '리더 모임', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 154100, '2026-03-08', '리더 모임', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 29000, '2026-03-29', '리더 모임', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 251250, '2026-02-01', '소그룹 운영비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 11500, '2026-02-08', '소그룹 운영비', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 212300, '2026-03-08', '소그룹 운영비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 416830, '2026-03-29', '소그룹 운영비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 15700, '2026-02-01', '임원단 활동비', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 54100, '2026-03-08', '임원단 활동비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 23500, '2026-03-29', '임원단 활동비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 71800, '2026-02-01', '생일/등반', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 122000, '2026-02-08', '생일/등반', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 74000, '2026-03-08', '생일/등반', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 122900, '2026-03-29', '생일/등반', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 10000000, '2026-02-01', '겨울 수련회', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 75000, '2026-02-01', '새가족팀', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 100000, '2026-03-29', '새가족팀', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

-- 사역
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 54700, '2026-03-08', '사역국장지원비', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 30600, '2026-03-08', '카이노스 찬양팀', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 202870, '2026-03-29', '카이노스 찬양팀', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 71400, '2026-02-01', '방송팀', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 81800, '2026-02-08', '방송팀', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 68500, '2026-03-08', '스포츠선교팀', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 88400, '2026-03-29', '스포츠선교팀', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 105000, '2026-02-08', '전도팀', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 236210, '2026-03-29', '전도팀', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

-- ※ 로뎀 기도회 (이미 위에서 이름 변경됨)
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 60000, '2026-02-08', '로뎀 기도회', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 38000, '2026-03-08', '로뎀 기도회', '2026-03-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 1000000, '2026-02-08', '평신도사역자 지원비', '2026-02-08 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 500000, '2026-03-29', '평신도사역자 지원비', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 106880, '2026-03-29', '금요예배 지원', '2026-03-29 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배 지원';

-- 행사 (※ 신입생 환영캠프 - 이미 위에서 이름 변경됨)
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 830140, '2026-02-01', '신입생 환영캠프', '2026-02-01 청구완료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

-- 소그룹 리더별 영수증
INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 62200, '2026-03-29', '소그룹_01 정연우', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_01 정연우';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 27500, '2026-03-29', '소그룹_02 편라원', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_02 편라원';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 139900, '2026-03-29', '소그룹_03 한유선', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_03 한유선';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 220300, '2026-03-29', '소그룹_04 이수민', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_04 이수민';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 249630, '2026-03-29', '소그룹_05 박영규', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_05 박영규';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 29100, '2026-03-29', '소그룹_06 김영균', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_06 김영균';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 21000, '2026-03-29', '소그룹_07 김요웅', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_07 김요웅';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 11500, '2026-03-29', '소그룹_08 최예람', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_08 최예람';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 12500, '2026-03-29', '소그룹_09 김수연', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_09 김수연';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 34000, '2026-03-29', '소그룹_10 김은지', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_10 김은지';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 32500, '2026-03-29', '소그룹_11 김경아', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_11 김경아';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 48150, '2026-03-29', '소그룹_13 김지원', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_13 김지원';

INSERT INTO public.receipts (submitter_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', id, 36000, '2026-03-29', '소그룹_14 원수현', '03.29까지 청구완료 합산', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹_14 원수현';

-- ============================================================
-- 4. receipts에 payer_name(결제자) 컬럼 추가
--    제출자와 결제자가 다를 수 있음 (청구 시 결제자 기준 정산)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'receipts'
      AND column_name = 'payer_name'
  ) THEN
    ALTER TABLE public.receipts ADD COLUMN payer_name text;
  END IF;
END $$;

-- ============================================================
-- 5. 생일/동반 → 생일/등반 이름 변경
-- ============================================================
UPDATE public.budget_categories SET category_name = '생일/등반' WHERE category_name = '생일/동반';

-- ============================================================
-- 완료! budget_transactions의 카테고리명도 자동 반영됨
-- (budget_transactions는 budget_category_id로 연결되므로 이름 변경 시 자동 적용)
-- ============================================================
