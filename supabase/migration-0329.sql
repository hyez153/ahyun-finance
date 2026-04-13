-- ============================================================
-- 마이그레이션: 03.29까지 청구완료 데이터 입력
-- ※ 안전장치: 기존 마이그레이션 데이터를 먼저 삭제 후 재삽입
--   → 여러 번 실행해도 중복 없이 동일한 결과
-- ============================================================

-- 1) 기존 마이그레이션 영수증 삭제
DELETE FROM public.receipts WHERE file_path = 'migration';

-- 2) 기존 마이그레이션 트랜잭션 삭제
DELETE FROM public.budget_transactions WHERE source_type = 'migration';

-- 3) 기존 소그룹 리더 카테고리 삭제 (재삽입 전)
DELETE FROM public.budget_categories WHERE category_name LIKE '소그룹\_%' ESCAPE '\';

-- 목회
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -64300, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -69000, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -248290, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -306200, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -229780, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -149800, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -107500, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -76800, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -106000, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -455190, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -141540, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -249590, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '예배준비비';

-- 양육
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -20000, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -113000, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -32300, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -154100, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -29000, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -251250, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -11500, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -212300, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -416830, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -15700, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -54100, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -23500, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -71800, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -122000, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -74000, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -122900, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -10000000, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -75000, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -100000, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '새가족팀';

-- 사역
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -54700, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -30600, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -202870, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -71400, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -81800, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -68500, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -88400, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -105000, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -236210, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -60000, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -38000, '2026-03-08', 'migration', '2026-03-08 청구완료'
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -1000000, '2026-02-08', 'migration', '2026-02-08 청구완료'
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -500000, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -106880, '2026-03-29', 'migration', '2026-03-29 청구완료'
FROM public.budget_categories WHERE category_name = '금요예배 지원';

-- 행사
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -830140, '2026-02-01', 'migration', '2026-02-01 청구완료'
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

-- ============================================================
-- 소그룹 운영비 하위 카테고리 (15명 리더)
-- ============================================================
INSERT INTO public.budget_categories (group_name, category_name, annual_budget) VALUES
  ('양육', '소그룹_01 정연우', 540000),
  ('양육', '소그룹_02 편라원', 540000),
  ('양육', '소그룹_03 한유선', 540000),
  ('양육', '소그룹_04 이수민', 540000),
  ('양육', '소그룹_05 박영규', 540000),
  ('양육', '소그룹_06 김영균', 540000),
  ('양육', '소그룹_07 김요웅', 540000),
  ('양육', '소그룹_08 최예람', 540000),
  ('양육', '소그룹_09 김수연', 540000),
  ('양육', '소그룹_10 김은지', 540000),
  ('양육', '소그룹_11 김경아', 540000),
  ('양육', '소그룹_12 이효민', 540000),
  ('양육', '소그룹_13 김지원', 540000),
  ('양육', '소그룹_14 원수현', 540000),
  ('양육', '소그룹_15 이다은', 540000);

-- 소그룹 리더별 03.29까지 청구완료 지출
INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -62200, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_01 정연우';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -27500, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_02 편라원';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -139900, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_03 한유선';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -220300, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_04 이수민';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -249630, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_05 박영규';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -29100, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_06 김영균';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -21000, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_07 김요웅';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -11500, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_08 최예람';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -12500, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_09 김수연';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -34000, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_10 김은지';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -32500, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_11 김경아';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -48150, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_13 김지원';

INSERT INTO public.budget_transactions (budget_category_id, transaction_type, amount, transaction_date, source_type, memo)
SELECT id, 'prior_claim', -36000, '2026-03-29', 'migration', '03.29까지 청구완료 합산'
FROM public.budget_categories WHERE category_name = '소그룹_14 원수현';

-- ============================================================
-- 영수증 탭용: 기존 청구 데이터를 receipts에도 등록
-- file_url = '실물영수증제출', status = 'approved', is_claimed = true
-- ============================================================

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

-- 행사
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
