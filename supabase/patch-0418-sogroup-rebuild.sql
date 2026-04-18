-- ============================================================
-- 패치: 소그룹 운영비 마이그레이션 데이터 재구축 (2026-04-18)
--
-- 기존 migration 소그룹 영수증 전부 삭제 후
-- 올바른 claim_batch_id와 함께 개별 건 재삽입
--
-- 기대 결과:
--   02/01: 251,250원  |  02/08: 11,500원
--   03/08: 212,300원  |  03/29: 416,830원
--   합계:  891,880원
-- ============================================================

-- 1. 기존 소그룹 migration 영수증 전부 삭제
DELETE FROM public.receipts
WHERE file_path = 'migration'
  AND budget_category_id IN (
    SELECT id FROM public.budget_categories WHERE category_name LIKE '소그룹%'
  );

-- 2. 개별 건 재삽입 (claim_batch_id 포함)

-- ──────────────────────────────────────────────
-- 02/01 청구 (소계: 251,250원)
-- ──────────────────────────────────────────────

-- 이수민 26,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', bc.id, cb.id, 26000, '2026-01-11', '소그룹 모임', '소그룹모임(간식) / 이수민 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-02-01';

-- 이수민 39,600
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', bc.id, cb.id, 39600, '2026-01-18', '소그룹 모임', '소그룹모임(간식) / 이수민 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-02-01';

-- 박영규 39,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', bc.id, cb.id, 39000, '2026-01-11', '소그룹 모임', '카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-02-01';

-- 박영규 49,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', bc.id, cb.id, 49000, '2026-01-18', '소그룹 모임', '카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-02-01';

-- 김요웅 21,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', bc.id, cb.id, 21000, '2026-01-18', '소그룹 모임', '카페_김요웅 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_07 김요웅' AND cb.claim_date = '2026-02-01';

-- 김지원 16,150
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 16150, '2026-01-04', '소그룹 모임', '간식 / 김지원, 홍지은 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_13 김지원' AND cb.claim_date = '2026-02-01';

-- 김지원 14,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 14500, '2026-01-18', '소그룹 모임', '카페 / 김지원, 홍지은 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_13 김지원' AND cb.claim_date = '2026-02-01';

-- 김수연 12,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 12500, '2026-01-18', '소그룹 모임', '카페 / 김수연, 장준호 외 2인', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_09 김수연' AND cb.claim_date = '2026-02-01';

-- 김은지 14,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 14500, '2026-01-18', '소그룹 모임', '카페 / 김은지, 김현지 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_10 김은지' AND cb.claim_date = '2026-02-01';

-- 편라원 19,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '편라원', bc.id, cb.id, 19000, '2026-01-25', '소그룹 모임', '1/25 편라원소그룹모임_편라원 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_02 편라원' AND cb.claim_date = '2026-02-01';

-- ──────────────────────────────────────────────
-- 02/08 청구 (소계: 11,500원)
-- ──────────────────────────────────────────────

-- 김경아 11,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 11500, '2026-01-18', '소그룹 모임', '카페 / 김경아, 김지환, 김준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_11 김경아' AND cb.claim_date = '2026-02-08';

-- ──────────────────────────────────────────────
-- 03/08 청구 (소계: 212,300원)
-- ──────────────────────────────────────────────

-- 김영균 12,600
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 12600, '2026-03-01', '소그룹 모임', '소그룹 생일 케이크', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_06 김영균' AND cb.claim_date = '2026-03-08';

-- 김지원 17,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 17500, '2026-03-01', '소그룹 모임', '카페 / 김지원, 김요섭 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_13 김지원' AND cb.claim_date = '2026-03-08';

-- 박영규 26,200
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', bc.id, cb.id, 26200, '2026-02-12', '심방', '식사 / 박영규, 김희주', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-08';

-- 박영규 18,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', bc.id, cb.id, 18500, '2026-02-22', '소그룹 모임', '카페 / 박영규, 송인준 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-08';

-- 박영규 19,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', bc.id, cb.id, 19500, '2026-02-26', '심방', '식사 / 박영규, 조준서', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-08';

-- 원수현 18,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 18500, '2026-02-22', '소그룹 모임', '카페 / 원수현, 이재경 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_14 원수현' AND cb.claim_date = '2026-03-08';

-- 이수민 41,700
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', bc.id, cb.id, 41700, '2026-02-26', '심방', '심방(식사) / 이수민 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-03-08';

-- 정연우 18,800
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 18800, '2026-02-20', '심방', '식사 / 정연우, 김영광', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_01 정연우' AND cb.claim_date = '2026-03-08';

-- 최예람 11,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 11500, '2026-02-22', '소그룹 모임', '카페 / 최예람, 김재혁 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_08 최예람' AND cb.claim_date = '2026-03-08';

-- 편라원 27,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 27500, '2026-03-01', '심방', '심방_(카페) 편라원 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_02 편라원' AND cb.claim_date = '2026-03-08';

-- ──────────────────────────────────────────────
-- 03/29 청구 (소계: 416,830원)
-- ──────────────────────────────────────────────

-- 김경아 18,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 18000, '2026-02-22', '소그룹 모임', '카페 / 김경아, 김지환, 조형찬, 남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_11 김경아' AND cb.claim_date = '2026-03-29';

-- 김경아 3,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 3000, '2026-02-22', '소그룹 모임', '카페 / 김보람', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_11 김경아' AND cb.claim_date = '2026-03-29';

-- 김영균 16,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 16500, '2026-03-15', '소그룹 모임', '카페 / 김영균, 김준영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_06 김영균' AND cb.claim_date = '2026-03-29';

-- 김은지 19,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 19500, '2026-03-15', '소그룹 모임', '카페 / 김은지, 김현지 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_10 김은지' AND cb.claim_date = '2026-03-29';

-- 박영규 30,300
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 30300, '2026-03-01', '심방', '식사 / 박영규, 김예원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-29';

-- 박영규 11,130
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 11130, '2026-03-01', '소그룹 모임', '카페 / 박영규, 김희주 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-29';

-- 박영규 25,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 25500, '2026-03-01', '소그룹 모임', '카페 / 박영규, 김희주 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-29';

-- 박영규 30,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 30500, '2026-03-08', '소그룹 모임', '카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_05 박영규' AND cb.claim_date = '2026-03-29';

-- 원수현 17,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 17500, '2026-03-08', '소그룹 모임', '카페 / 원수현, 이재경 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_14 원수현' AND cb.claim_date = '2026-03-29';

-- 이수민 27,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 27500, '2026-03-15', '소그룹 모임', '소그룹모임(카페) / 이수민 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-03-29';

-- 이수민 28,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 28000, '2026-03-19', '심방', '심방(식사) / 이수민 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-03-29';

-- 이수민 27,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 27500, '2026-03-22', '심방', '심방(식사) / 이수민 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-03-29';

-- 이수민 30,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 30000, '2026-03-26', '심방', '심방(식사) / 이수민 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_04 이수민' AND cb.claim_date = '2026-03-29';

-- 정연우 18,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 18500, '2026-03-22', '소그룹 모임', '카페 / 정연우, 윤지훈 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_01 정연우' AND cb.claim_date = '2026-03-29';

-- 정연우 24,900
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 24900, '2026-03-26', '심방', '식사 / 정연우, 윤지훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_01 정연우' AND cb.claim_date = '2026-03-29';

-- 한유선 15,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 15500, '2026-02-22', '소그룹 모임', '카페 / 한유선, 고성민 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_03 한유선' AND cb.claim_date = '2026-03-29';

-- 한유선 3,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 3500, '2026-02-22', '소그룹 모임', '카페 / 한유선, 고성민 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_03 한유선' AND cb.claim_date = '2026-03-29';

-- 한유선 40,000
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 40000, '2026-03-21', '소그룹 모임', '식사 / 한유선, 박서윤 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_03 한유선' AND cb.claim_date = '2026-03-29';

-- 한유선 29,500
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, claim_batch_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, bc.id, cb.id, 29500, '2026-03-21', '소그룹 모임', '카페 / 한유선, 박서윤 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories bc, public.claim_batches cb
WHERE bc.category_name = '소그룹_03 한유선' AND cb.claim_date = '2026-03-29';
