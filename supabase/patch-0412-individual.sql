-- ============================================================
-- 패치: 개별 영수증 마이그레이션 (patch-0412.sql 금액 기준)
-- 총 172건, 합계 17,577,770원
-- ============================================================

-- 기존 마이그레이션 영수증 삭제
DELETE FROM public.receipts WHERE file_url = '실물영수증제출';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 50760, '2026-02-01', '행정물품비', '[2026-01-13] 행정물품_사무실간식', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9560, '2026-02-01', '행정물품비', '[2026-01-14] 행정물품_수준위 물품', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 3980, '2026-02-01', '행정물품비', '[2026-01-20] 행정물품_USB젠더', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 69000, '2026-03-08', '행정물품비', '[2026-02-01] 행정물품_마우스', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 64800, '2026-03-29', '행정물품비', '[2026-03-19] 행정물품_사무실간식', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 10000, '2026-03-29', '행정물품비', '[2026-02-22] 카카오 푸시 메시지 발송', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 114000, '2026-03-29', '행정물품비', '[2026-03-06] 행정물품_렉선반 당근거래', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 50000, '2026-03-29', '행정물품비', '[2026-03-08] 카카오 푸시 메시지 발송', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9490, '2026-03-29', '행정물품비', '[2026-03-20] 행정물품_종이컵', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 3000, '2026-02-01', '심방비', '[2026-01-14] 심방_김서연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13000, '2026-02-01', '심방비', '[2026-01-14] 심방_김은지, 전미현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20000, '2026-02-01', '심방비', '[2026-01-15] 심방_손은혜, 이혜원, 김시내', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 23200, '2026-02-01', '심방비', '[2026-01-15] 심방_손은혜, 김시내, 이혜원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 26000, '2026-02-01', '심방비', '[2026-01-16] 심방_장준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 179000, '2026-02-01', '심방비', '[2026-01-17] 수준위 답사 식사_황루안, 최예지 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 20000, '2026-02-01', '심방비', '[2026-01-18] 심방_ 장대성, 손은혜', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13000, '2026-02-01', '심방비', '[2026-01-22] 심방_양정우, 김서연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9000, '2026-02-01', '심방비', '[2026-01-28] 심방_손은혜, 김하정', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 26700, '2026-03-08', '심방비', '[2026-02-06] 심방_임형재, 최예지, 황루안, 박수지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 36000, '2026-03-08', '심방비', '[2026-02-12] 심방_임형재, 황루안, 한유선', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 23400, '2026-03-08', '심방비', '[2026-02-12] 심방_임형재, 황루안, 한유선', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 30000, '2026-03-08', '심방비', '[2026-02-12] 심방_임형재, 장준호, 이상준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 8500, '2026-03-08', '심방비', '[2026-02-15] 심방_임형재, 김민태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 8500, '2026-03-08', '심방비', '[2026-02-18] 심방_임형재, 남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 61680, '2026-03-08', '심방비', '[2026-02-20] 심방_임형재, 김예진, 김영광 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 15000, '2026-03-08', '심방비', '[2026-02-21] 심방_임형재, 김강영, 손은혜', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20000, '2026-03-08', '심방비', '[2026-02-27] 심방_임형재, 양진성', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20800, '2026-03-29', '심방비', '[2026-03-08] 심방_편라훤, 조우태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 31800, '2026-03-29', '심방비', '[2026-03-11] 심방_이규인', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 34600, '2026-03-29', '심방비', '[2026-03-13] 심방_주재형,김민태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 27400, '2026-03-29', '심방비', '[2026-03-20] 심방_김강영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 17000, '2026-03-29', '심방비', '[2026-03-20] 심방_김강영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 5400, '2026-03-29', '심방비', '[2026-03-27] 심방_황루안', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12800, '2026-03-29', '심방비', '[2026-03-25] 심방_김수연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예지', id, 107500, '2026-02-01', '목회지원비', '[2026-01-03] 키르기스스탄 후속 모임_임형재, 장주영, 장세창 외 10명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김하은', id, 48000, '2026-03-08', '목회지원비', '[2026-01-25] 식당봉사_커피', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 28800, '2026-03-08', '목회지원비', '[2026-02-28] 제천사역팀 커피_장준호, 박영규 외 12명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 106000, '2026-03-29', '목회지원비', '[2026-03-07] 헤노테스 사역지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 110000, '2026-02-01', '예배준비비', '[2026-01-01] 마이박스_1년 구독', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13500, '2026-02-01', '예배준비비', '[2026-01-02] 도서비', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 150000, '2026-02-01', '예배준비비', '[2026-01-20] 베이스 이펙트 스트립_찬양팀 물품', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 160800, '2026-02-01', '예배준비비', '[2026-01-24] 미리캔버스 결제', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 10000, '2026-02-01', '예배준비비', '[2026-01-27] 인이어', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 10890, '2026-02-01', '예배준비비', '[2026-01-27] 이펙터 패달 전용 어댑터', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 141540, '2026-03-08', '예배준비비', '[2026-02-05] 기도통장', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12600, '2026-03-29', '예배준비비', '[2026-03-04] 제자훈련교재', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 176400, '2026-03-29', '예배준비비', '[2026-03-04] 제자훈련교재', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 37800, '2026-03-29', '예배준비비', '[2026-03-04] 도서-예배준비비', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 22790, '2026-03-29', '예배준비비', '[2026-03-13] 수련회 프로그램', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 20000, '2026-02-01', '리더장 지원비', '[2026-01-23] 온라인 심방 / 김경아', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 56500, '2026-03-08', '리더장 지원비', '[2025-02-22] 식사 / 김지원, 김수연 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 16500, '2026-03-08', '리더장 지원비', '[2025-02-22] 카페 / 김지원, 김수연 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김하은', id, 40000, '2026-03-08', '리더장 지원비', '[2026-03-05] 식사 / 김하은 편라원 정연우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장 지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 32300, '2026-02-01', '리더 모임', '[2026-01-16] 간식 / 김지원, 김하은 외 15명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 154100, '2026-03-08', '리더 모임', '[2026-02-13] 식사 / 김지원, 김하은 외 14명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 29000, '2026-03-29', '리더 모임', '[2026-03-13] 간식 / 김지원, 김하은 외 12명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더 모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.02.01 청구완료', id, 15700, '2026-02-01', '임원단 활동비', '[2026-01-03] 임원단 회의_임형재, 김하은 외', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 28500, '2026-03-08', '임원단 활동비', '[2026-02-15] 임원단 점심_설날', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 10400, '2026-03-08', '임원단 활동비', '[2026-02-15] 임원단 음료_설날', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 13400, '2026-03-08', '임원단 활동비', '[2026-03-07] 헤노테스 러닝_커피 박병욱 외 15명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 1800, '2026-03-08', '임원단 활동비', '[2026-03-07] 헤노테스 러닝_커피', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 23500, '2026-03-29', '임원단 활동비', '[2026-03-01] 임원단 음료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단 활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-02-01', '생일/등반', '[2026-01-11] 생일_이정원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 10000, '2026-02-01', '생일/등반', '[2026-01-11] 생일_진승현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 10000, '2026-02-01', '생일/등반', '[2026-01-15] 생일_김채은', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-02-01', '생일/등반', '[2026-01-17] 생일_이수민', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-02-01', '생일/등반', '[2026-01-24] 생일_최예지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 12000, '2026-02-01', '생일/등반', '[2026-01-25] 등반_꽃_남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', id, 9800, '2026-02-01', '생일/등반', '[2026-01-25] 생일_오아름', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 48000, '2026-02-08', '생일/등반', '[2026-01-04] 장로님/권사님_환영꽃', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 10000, '2026-02-08', '생일/등반', '[2026-01-06] 생일_이상준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-02-08', '생일/등반', '[2026-01-07] 생일_홍지은', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이다은', id, 10000, '2026-02-08', '생일/등반', '[2026-01-20] 생일_심수정', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-02-08', '생일/등반', '[2026-01-26] 생일_김수연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 10000, '2026-02-08', '생일/등반', '[2026-01-27] 생일_이재경', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 24000, '2026-02-08', '생일/등반', '[2026-02-01] 등반_꽃_박서진/박서윤', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-03-08', '생일/등반', '[2026-02-13] 생일_원수현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12000, '2026-03-08', '생일/등반', '[2026-02-22] 등반_하헌규', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', id, 10000, '2026-03-08', '생일/등반', '[2026-02-22] 생일_조윤상', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-03-08', '생일/등반', '[2026-02-25] 생일_송인준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12000, '2026-03-08', '생일/등반', '[2026-03-01] 등반_김재훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예람', id, 10000, '2026-03-08', '생일/등반', '[2026-02-06] 생일_최재열', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김영균', id, 10000, '2026-03-08', '생일/등반', '[2026-02-25] 생일_김지우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-03-29', '생일/등반', '[2026-01-19] 생일_김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-03-29', '생일/등반', '[2026-03-12] 생일_김영균', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-03-29', '생일/등반', '[2026-03-17] 생일_정연우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-03-29', '생일/등반', '[2026-03-17] 생일_이현우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-03-29', '생일/등반', '[2026-03-20] 생일_김예원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 9400, '2026-03-29', '생일/등반', '[2026-03-18] 생일_김주성', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-03-29', '생일/등반', '[2026-03-20] 생일_임윤희', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 10000, '2026-03-29', '생일/등반', '[2026-03-20] 생일_정민혁', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 9500, '2026-03-29', '생일/등반', '[2026-03-21] 생일_김현지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-03-29', '생일/등반', '[2026-02-26] 생일_김준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 24000, '2026-03-29', '생일/등반', '[2026-03-15] 등반_변유진, 박정훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.02.01 정산완료', id, 75000, '2026-02-01', '새가족팀', '[2026-01-09] 새가족 선물', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.03.29 정산완료', id, 100000, '2026-03-29', '새가족팀', '[2026-03-19] 새가족 선물', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 20000, '2026-03-08', '사역국장지원비', '[2026-02-21] 사역팀장 심방_손은혜, 김강영', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 22000, '2026-03-08', '사역국장지원비', '[2026-03-06] 사역팀장 심방_손은혜, 김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12700, '2026-03-08', '사역국장지원비', '[2026-03-06] 사역팀장 심방_손은혜, 김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 27900, '2026-03-29', '금요예배 지원', '[2026-03-05] 간식지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배 지원';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 38000, '2026-03-29', '금요예배 지원', '[2026-03-06] 금요기도회 지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배 지원';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.03.29 청구완료', id, 40980, '2026-03-29', '금요예배 지원', '[2026-03-19] 금요기도회 지원_컵밥', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배 지원';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '주혜지', id, 318000, '2026-02-01', '신입생 환영캠프', '[2026-01-01] 파티룸', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 5900, '2026-02-01', '신입생 환영캠프', '[2026-01-09] 파티룸 장식 풍선 구매', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 337500, '2026-02-01', '신입생 환영캠프', '[2026-01-10] 점심 식사(15인)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 42700, '2026-02-01', '신입생 환영캠프', '[2026-01-10] 커피(15인)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 52540, '2026-02-01', '신입생 환영캠프', '[2026-01-10] 간식 구매_과자/음료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12000, '2026-02-01', '신입생 환영캠프', '[2026-01-10] 간식 구매_귤', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 61500, '2026-02-01', '신입생 환영캠프', '[2026-01-10] 간식 배달_요거트아이스크림', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', 'o', id, 10600, '2026-03-08', '카이노스 찬양팀', '[2026-02-13] 카페 / 고성민, 박영규', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', 'o', id, 20000, '2026-03-08', '카이노스 찬양팀', '[2026-02-14] 카페 / 고성민, 김희주 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', 'o', id, 26200, '2026-03-29', '카이노스 찬양팀', '[2026-03-01] 카페 / 고성민, 김다슬 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', 'o', id, 167400, '2026-03-29', '카이노스 찬양팀', '[2026-03-03] 단체티', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', 'o', id, 9270, '2026-03-29', '카이노스 찬양팀', '[2026-03-12] 일회용 마이크커버', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '카이노스 찬양팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.02.01 정산완료', id, 71400, '2026-02-01', '방송팀', '[2026-01-18] 식사/윤지훈 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.02.08 정산완료', id, 81800, '2026-02-08', '방송팀', '[2026-01-31] 식사/윤지훈_외_7명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '방송팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김강영', id, 68500, '2026-03-08', '스포츠선교팀', '[2026-03-07] 헤노테스 러닝 식사(라면) 김강영 외 17명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 12400, '2026-03-29', '스포츠선교팀', '[2026-03-14] 헤노테스 주차비', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 66300, '2026-03-29', '스포츠선교팀', '[2026-03-14] 헤노테스 러닝커피_손은혜 외 13명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김강영', id, 9700, '2026-03-29', '스포츠선교팀', '[2026-03-14] 헤노테스 러닝커피_김강영 외1 명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '스포츠선교팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 53000, '2026-02-08', '전도팀', '[2026-01-24] 뉴플랜트 MT 식사 / 장준호, 최정환 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '2026.02.08 정산완료', id, 52000, '2026-02-08', '전도팀', '[2026-01-24] 뉴플랜트 MT 카페 / 장준호, 최정환 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 9120, '2026-03-29', '전도팀', '[2026-03-10] 뉴플랜트 / 03.21.토요 집회 초대장', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 147090, '2026-03-29', '전도팀', '[2026-03-20] 뉴플랜트 / 03.21.토요 집회 물품(다과)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 80000, '2026-03-29', '전도팀', '[2026-03-21] 뉴플랜트 / 토요 집회 준비 식사(장준호 외 15명)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '전도팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지환', id, 60000, '2026-02-08', '로뎀 기도회', '기도노트 40권 구매', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 38000, '2026-03-08', '로뎀 기도회', '[2026-02-20] 로뎀금요기도회 식사 비용', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '로뎀 기도회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 16150, '2026-02-01', '소그룹 운영비', '[2026-01-04] 간식 / 김지원, 홍지은 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 26000, '2026-02-01', '소그룹 운영비', '[2026-01-11] 소그룹모임(간식) / 이수민 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 39000, '2026-02-01', '소그룹 운영비', '[2026-01-11] 카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 39600, '2026-02-01', '소그룹 운영비', '[2026-01-18] 소그룹모임(간식) / 이수민 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 49000, '2026-02-01', '소그룹 운영비', '[2026-01-18] 카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', id, 21000, '2026-02-01', '소그룹 운영비', '[2026-01-18] 카페_김요웅 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 14500, '2026-02-01', '소그룹 운영비', '[2026-01-18] 카페 / 김지원, 홍지은 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 14500, '2026-02-01', '소그룹 운영비', '[2026-01-18] 카페 / 김은지, 김현지 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 11500, '2026-02-01', '소그룹 운영비', '[2026-01-18] 카페 / 김경아, 김지환, 김준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 18800, '2026-02-01', '소그룹 운영비', '[2026-02-20] 식사 / 정연우, 김영광', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 1200, '2026-02-01', '소그룹 운영비', '소그룹 운영비 기타 (2026-02-01)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예람', id, 11500, '2026-02-08', '소그룹 운영비', '[2026-02-22] 카페 / 최예람, 김재혁 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 26200, '2026-03-08', '소그룹 운영비', '[2026-02-12] 식사 / 박영규, 김희주', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 18500, '2026-03-08', '소그룹 운영비', '[2026-02-22] 카페 / 박영규, 송인준 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 18500, '2026-03-08', '소그룹 운영비', '[2026-02-22] 카페 / 원수현, 이재경 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 41700, '2026-03-08', '소그룹 운영비', '[2026-02-26] 심방(식사) / 이수민 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 19500, '2026-03-08', '소그룹 운영비', '[2026-02-26] 식사 / 박영규, 조준서', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '편라원', id, 27500, '2026-03-08', '소그룹 운영비', '[2026-03-01] 심방_(카페) 편라원 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김영균', id, 12600, '2026-03-08', '소그룹 운영비', '[2026-03-01] 소그룹 생일 케이크', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 17500, '2026-03-08', '소그룹 운영비', '[2026-03-01] 카페 / 김지원,김요섭 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 21700, '2026-03-08', '소그룹 운영비', '[2026-01-08] 식사 / 한유선, 편라훤 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 3500, '2026-03-08', '소그룹 운영비', '[2026-02-22] 카페 / 한유선, 고성민 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 3000, '2026-03-08', '소그룹 운영비', '[2026-02-22] 카페 / 김보람', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 2100, '2026-03-08', '소그룹 운영비', '소그룹 운영비 기타 (2026-03-08)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 29700, '2026-03-29', '소그룹 운영비', '[2026-01-08] 카페 / 한유선, 편라훤 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 15500, '2026-03-29', '소그룹 운영비', '[2026-02-22] 카페 / 한유선, 고성민 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 18000, '2026-03-29', '소그룹 운영비', '[2026-02-22] 카페 / 김경아, 김지환, 조형찬, 남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 30300, '2026-03-29', '소그룹 운영비', '[2026-03-01] 식사 / 박영규, 김예원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 11130, '2026-03-29', '소그룹 운영비', '[2026-03-01] 카페 / 박영규, 김희주 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 25500, '2026-03-29', '소그룹 운영비', '[2026-03-01] 카페 / 박영규, 김희주 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 30500, '2026-03-29', '소그룹 운영비', '[2026-03-08] 카페 / 박영규, 김희주 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 17500, '2026-03-29', '소그룹 운영비', '[2026-03-08] 카페 / 원수현, 이재경 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 27500, '2026-03-29', '소그룹 운영비', '[2026-03-15] 소그룹모임(카페) / 이수민 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김영균', id, 16500, '2026-03-29', '소그룹 운영비', '[2026-03-15] 카페 / 김영균, 김준영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 19500, '2026-03-29', '소그룹 운영비', '[2026-03-15] 카페 / 김은지, 김현지 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 28000, '2026-03-29', '소그룹 운영비', '[2026-03-19] 심방(식사) / 이수민 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 40000, '2026-03-29', '소그룹 운영비', '[2026-03-21] 식사 / 한유선, 박서윤 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 29500, '2026-03-29', '소그룹 운영비', '[2026-03-21] 카페 / 한유선, 박서윤 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 18500, '2026-03-29', '소그룹 운영비', '[2026-03-22] 카페 / 정연우, 윤지훈 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 27500, '2026-03-29', '소그룹 운영비', '[2026-03-22] 심방(식사) / 이수민 외 1명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 24900, '2026-03-29', '소그룹 운영비', '[2026-03-26] 식사 / 정연우, 윤지훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 6800, '2026-03-29', '소그룹 운영비', '소그룹 운영비 기타 (2026-03-29)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '소그룹 운영비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 10000000, '2026-02-01', '겨울 수련회', '겨울 수련회 예산 지출', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 1000000, '2026-02-08', '평신도사역자 지원비', '간사_입금(1,2월분)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 500000, '2026-03-29', '평신도사역자 지원비', '간사_입금(3월분)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '평신도사역자 지원비';

