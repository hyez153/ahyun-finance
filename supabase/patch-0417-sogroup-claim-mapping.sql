-- ============================================================
-- 패치: 소그룹 운영비 청구기간 매핑 수정 (2026-04-17)
--
-- 문제: 개별 마이그레이션(patch-0412)에서 소그룹 영수증에
--       claim_batch_id를 부여하지 않아 청구기간별 집계가 틀림
--
-- 수정 내용:
--   1. 편라원 패치 영수증 수정 (카테고리, 날짜, 적요)
--   2. 모든 소그룹 마이그레이션 영수증에 올바른 claim_batch_id 부여
--   3. 최예람 3/29 이후 항목은 claim_batch_id 미부여 (4/19 청구 대상)
--
-- 기대 결과:
--   02/01: 251,250원
--   02/08:  11,500원
--   03/08: 212,300원
--   03/29: 416,830원
--   합계:  891,880원
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. 편라원 패치 영수증 수정
--    - 카테고리: 소그룹 운영비 → 소그룹_02 편라원
--    - receipt_date: 2026-02-01 → 2026-01-25
--    - memo: 적요 수정
-- ──────────────────────────────────────────────
UPDATE public.receipts
SET budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_02 편라원'),
    receipt_date = '2026-01-25',
    memo = '1/25 편라원소그룹모임_편라원 외 6명'
WHERE file_path = 'migration'
  AND amount = 19000
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹 운영비');

-- ──────────────────────────────────────────────
-- 2. 02/01 청구 (소계: 251,250원)
-- ──────────────────────────────────────────────

-- 이수민: 26,000 (1/11) + 39,600 (1/18) = 65,600
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_04 이수민')
  AND receipt_date IN ('2026-01-11', '2026-01-18');

-- 박영규: 39,000 (1/11) + 49,000 (1/18) = 88,000
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_05 박영규')
  AND receipt_date IN ('2026-01-11', '2026-01-18');

-- 김요웅: 21,000 (1/18)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_07 김요웅')
  AND receipt_date = '2026-01-18';

-- 김지원: 16,150 (1/4) + 14,500 (1/18) = 30,650
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_13 김지원')
  AND receipt_date IN ('2026-01-04', '2026-01-18');

-- 김수연: 12,500 (1/18)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_09 김수연')
  AND receipt_date = '2026-01-18';

-- 김은지: 14,500 (1/18)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_10 김은지')
  AND receipt_date = '2026-01-18';

-- 편라원: 19,000 (1/25) — 패치 추가분
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-01')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_02 편라원')
  AND receipt_date = '2026-01-25';

-- ──────────────────────────────────────────────
-- 3. 02/08 청구 (소계: 11,500원)
-- ──────────────────────────────────────────────

-- 김경아: 11,500 (1/18)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-02-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_11 김경아')
  AND receipt_date = '2026-01-18';

-- ──────────────────────────────────────────────
-- 4. 03/08 청구 (소계: 212,300원)
-- ──────────────────────────────────────────────

-- 김영균: 12,600 (3/1)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_06 김영균')
  AND receipt_date = '2026-03-01';

-- 김지원: 17,500 (3/1)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_13 김지원')
  AND receipt_date = '2026-03-01';

-- 박영규: 26,200 (2/12) + 18,500 (2/22) + 19,500 (2/26) = 64,200
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_05 박영규')
  AND receipt_date IN ('2026-02-12', '2026-02-22', '2026-02-26');

-- 원수현: 18,500 (2/22)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_14 원수현')
  AND receipt_date = '2026-02-22';

-- 이수민: 41,700 (2/26)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_04 이수민')
  AND receipt_date = '2026-02-26';

-- 정연우: 18,800 (2/20)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_01 정연우')
  AND receipt_date = '2026-02-20';

-- 최예람: 11,500 (2/22)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_08 최예람')
  AND receipt_date = '2026-02-22';

-- 편라원: 27,500 (3/1)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-08')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_02 편라원')
  AND receipt_date = '2026-03-01';

-- ──────────────────────────────────────────────
-- 5. 03/29 청구 (소계: 416,830원)
-- ──────────────────────────────────────────────

-- 김경아: 18,000 + 3,000 = 21,000 (2/22)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_11 김경아')
  AND receipt_date = '2026-02-22';

-- 김영균: 16,500 (3/15)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_06 김영균')
  AND receipt_date = '2026-03-15';

-- 김은지: 19,500 (3/15)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_10 김은지')
  AND receipt_date = '2026-03-15';

-- 박영규: 30,300 + 11,130 + 25,500 (3/1) + 30,500 (3/8) = 97,430
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_05 박영규')
  AND receipt_date IN ('2026-03-01', '2026-03-08');

-- 원수현: 17,500 (3/8)
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_14 원수현')
  AND receipt_date = '2026-03-08';

-- 이수민: 27,500 (3/15) + 28,000 (3/19) + 27,500 (3/22) + 30,000 (3/26) = 113,000
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_04 이수민')
  AND receipt_date IN ('2026-03-15', '2026-03-19', '2026-03-22', '2026-03-26');

-- 정연우: 18,500 (3/22) + 24,900 (3/26) = 43,400
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_01 정연우')
  AND receipt_date IN ('2026-03-22', '2026-03-26');

-- 한유선: 15,500 + 3,500 (2/22) + 40,000 + 29,500 (3/21) = 88,500
UPDATE public.receipts
SET claim_batch_id = (SELECT id FROM public.claim_batches WHERE claim_date = '2026-03-29')
WHERE file_path = 'migration'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '소그룹_03 한유선')
  AND receipt_date IN ('2026-02-22', '2026-03-21');

-- ──────────────────────────────────────────────
-- 6. 최예람 3/20, 3/29 항목은 claim_batch_id 미부여
--    (4/19 청구 대상이므로 NULL 유지)
--    → 별도 작업 불필요 (현재 NULL 상태)
-- ──────────────────────────────────────────────

-- ──────────────────────────────────────────────
-- 7. 검증 쿼리 (실행 후 확인용)
-- ──────────────────────────────────────────────
-- 아래 쿼리로 청구기간별 소그룹 합계 확인:
--
-- SELECT cb.claim_date, SUM(r.amount) as total
-- FROM receipts r
-- JOIN budget_categories bc ON r.budget_category_id = bc.id
-- JOIN claim_batches cb ON r.claim_batch_id = cb.id
-- WHERE bc.category_name LIKE '소그룹%'
--   AND r.is_claimed = true
--   AND r.file_path = 'migration'
-- GROUP BY cb.claim_date
-- ORDER BY cb.claim_date;
--
-- 기대 결과:
-- 2026-02-01 | 251250
-- 2026-02-08 |  11500
-- 2026-03-08 | 212300
-- 2026-03-29 | 416830
