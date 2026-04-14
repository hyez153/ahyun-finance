-- ============================================================
-- 패치: 소그룹 운영비 수정 (2026-04-14)
-- 1. 한유선 소그룹 잘못된 마이그레이션 2건 삭제 (-51,400원)
-- 2. 편라원 소그룹 누락 1건 추가 (+19,000원)
-- 순 변동: -32,400원
-- ============================================================

-- 1. 한유선 소그룹 잘못 들어간 항목 삭제 (청구완료 마커 없는 항목)
-- 21,700원: [2026-01-08] 식사 / 한유선, 편라훤 외 1명
DELETE FROM public.receipts
WHERE file_url = '실물영수증제출'
  AND amount = 21700
  AND memo = '[2026-01-08] 식사 / 한유선, 편라훤 외 1명';

-- 29,700원: [2026-01-08] 카페 / 한유선, 편라훤 외 1명
DELETE FROM public.receipts
WHERE file_url = '실물영수증제출'
  AND amount = 29700
  AND memo = '[2026-01-08] 카페 / 한유선, 편라훤 외 1명';

-- 2. 편라원 소그룹 누락 항목 추가
-- 19,000원: [2026-01-25] 편라원소그룹모임_편라원 외 6명 → 2/1 청구
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '편라원', id, 19000, '2026-02-01', '소그룹 운영비', '[2026-01-25] 편라원소그룹모임_편라원 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';
