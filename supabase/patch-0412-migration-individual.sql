-- 마이그레이션 영수증 개별 건 재입력
-- patch-0412-migration-individual.sql
-- 기존 합산 마이그레이션 데이터 삭제 후 개별 건으로 재입력

-- 1. 기존 마이그레이션 영수증 삭제
DELETE FROM public.receipts WHERE file_url = '실물영수증제출';

-- 2. 개별 건 INSERT
INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 50760, '2026-01-13', '물품구매', '행정물품_사무실간식', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9560, '2026-01-14', '물품구매', '행정물품_수준위 물품', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 3980, '2026-01-20', '물품구매', '행정물품_USB젠더', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 69000, '2026-02-01', '물품구매', '행정물품_마우스', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 64800, '2026-03-19', '물품구매', '행정물품_사무실간식', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 10000, '2026-02-22', '물품구매', '카카오 푸시 메시지 발송', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 114000, '2026-03-06', '물품구매', '행정물품_렉선반 당근거래', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 50000, '2026-03-08', '물품구매', '카카오 푸시 메시지 발송', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9490, '2026-03-20', '물품구매', '행정물품_종이컵', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '행정물품비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 3000, '2026-01-14', '기타', '심방_김서연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13000, '2026-01-14', '기타', '심방_김은지, 전미현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20000, '2026-01-15', '기타', '심방_손은혜, 이혜원, 김시내', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 23200, '2026-01-15', '기타', '심방_손은혜, 김시내, 이혜원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 26000, '2026-01-16', '기타', '심방_장준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 179000, '2026-01-17', '기타', '수준위 답사 식사_황루안, 최예지 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 20000, '2026-01-18', '기타', '심방_ 장대성, 손은혜', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13000, '2026-01-22', '기타', '심방_양정우, 김서연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 9000, '2026-01-28', '기타', '심방_손은혜, 김하정', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 26700, '2026-02-06', '기타', '심방_임형재, 최예지, 황루안, 박수지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 36000, '2026-02-12', '기타', '심방_임형재, 황루안, 한유선', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 23400, '2026-02-12', '기타', '심방_임형재, 황루안, 한유선', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 30000, '2026-02-12', '기타', '심방_임형재, 장준호, 이상준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 8500, '2026-02-15', '기타', '심방_임형재, 김민태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 8500, '2026-02-18', '기타', '심방_임형재, 남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 61680, '2026-02-20', '기타', '심방_임형재, 김예진, 김영광 외 3명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 15000, '2026-02-21', '기타', '심방_임형재, 김강영, 손은혜', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20000, '2026-02-27', '기타', '심방_임형재, 양진성', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 20800, '2026-03-08', '기타', '심방_편라훤, 조우태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 31800, '2026-03-11', '기타', '심방_이규인', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 34600, '2026-03-13', '기타', '심방_주재형,김민태', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 27400, '2026-03-20', '기타', '심방_김강영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 17000, '2026-03-20', '기타', '심방_김강영 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 5400, '2026-03-27', '기타', '심방_황루안', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12800, '2026-03-25', '기타', '심방_김수연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '심방비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예지', id, 107500, '2026-01-03', '기타', '키르기스스탄 후속 모임_임형재, 장주영, 장세창 외 10명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김하은', id, 48000, '2026-01-25', '기타', '식당봉사_커피', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 28800, '2026-02-28', '기타', '제천사역팀 커피_장준호, 박영규 외 12명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 106000, '2026-03-07', '기타', '헤노테스 사역지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '목회지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 110000, '2026-01-01', '예배준비비', '마이박스_1년 구독', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 13500, '2026-01-02', '예배준비비', '도서비', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 150000, '2026-01-20', '예배준비비', '베이스 이펙트 스트립_찬양팀 물품', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 160800, '2026-01-24', '예배준비비', '미리캔버스 결제', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 10000, '2026-01-27', '예배준비비', '인이어', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 10890, '2026-01-27', '예배준비비', '이펙터 패달 전용 어댑터', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 141540, '2026-02-05', '예배준비비', '기도통장', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12600, '2026-03-04', '예배준비비', '제자훈련교재', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 176400, '2026-03-04', '예배준비비', '제자훈련교재', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 37800, '2026-03-04', '예배준비비', '도서-예배준비비', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 22790, '2026-03-13', '예배준비비', '수련회 프로그램', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '예배준비비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 20000, '2026-01-23', '심방', '온라인 심방 / 김경아', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 56500, '2025-02-22', '심방', '식사 / 김지원, 김수연 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 16500, '2025-02-22', '심방', '카페 / 김지원, 김수연 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김하은', id, 40000, '2026-03-05', '심방', '식사 / 김하은 편라원 정연우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 32300, '2026-01-16', '소그룹 모임', '간식 / 김지원, 김하은 외 15명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 154100, '2026-02-13', '소그룹 모임', '식사 / 김지원, 김하은 외 14명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 29000, '2026-03-13', '소그룹 모임', '간식 / 김지원, 김하은 외 12명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '리더모임';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 55500, '2025-12-27', '기타', '수준위 식사 / 황루안, 양정우 외 4명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 16310, '2026-01-04', '겨울 수련회', '수준위 식사 / 이성진, 윤지훈 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 103800, '2026-01-04', '겨울 수련회', '수준위 식사 / 이성진, 윤지훈 외 5명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 18160, '2026-01-11', '겨울 수련회', '물품구매(기도운동시트지)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 98200, '2026-01-11', '겨울 수련회', '수준위 식사 / 김은지, 김서연 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김강영', id, 47600, '2026-01-15', '겨울 수련회', '수준위 식사 / 양정우, 이성진 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 47300, '2026-01-17', '겨울 수련회', '수준위 식사 / 황루안, 김은지 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 119153, '2026-01-17', '겨울 수련회', '물품구매(수준위 단체티 구매)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 39000, '2026-01-18', '겨울 수련회', '수준위 식사 / 황루안, 양정우 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 38200, '2026-01-18', '겨울 수련회', '수준위 식사 / 최예지, 김서연 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예지', id, 83000, '2026-01-20', '겨울 수련회', '물품구매(뱃지)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 22740, '2026-01-24', '겨울 수련회', '물품구매(돌파스테이지-가림막)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 27500, '2026-01-24', '겨울 수련회', '물품구매(볼펜)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김서연', id, 101800, '2026-01-25', '겨울 수련회', '수준위 식사 / 황루안, 김강영 외 7명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 5380, '2026-01-25', '겨울 수련회', '물품구매(돌파스테이지-편지봉투)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 26730, '2026-01-25', '겨울 수련회', '물품구매(돌파스테이지-편지지)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 35500, '2026-01-25', '겨울 수련회', '물품구매(명찰)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 20850, '2026-01-25', '겨울 수련회', '물품구매(돌파스테이지-우체통)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 99840, '2026-01-27', '겨울 수련회', '물품구매(돌파스테이지-양말목, O형키링, 오링, 나일론끈, 스마일비즈, 네임택)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 31000, '2026-01-27', '겨울 수련회', '물품구매(돌파스테이지-알파벳 비즈)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 109400, '2026-01-28', '겨울 수련회', '물품구매(돌파스테이지-페이퍼프레임)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 8500, '2026-01-28', '겨울 수련회', '물품구매(돌파스테이지-엽서)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예지', id, 21000, '2026-01-29', '겨울 수련회', '물품구매(돌파스테이지-말씀엽서)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 592610, '2026-01-29', '겨울 수련회', '물품구매(웰컴키트, 간식, 교회선물)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 10850, '2026-01-29', '겨울 수련회', '물품구매(돌파 시뮬레이션)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 12500, '2026-01-29', '겨울 수련회', '물품구매(웰컴키트-손잡이지퍼백)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 146080, '2026-01-30', '겨울 수련회', '물품구매(워크북)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 40800, '2026-01-30', '겨울 수련회', '물품구매(비상약)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 22740, '2026-01-30', '겨울 수련회', '물품구매(가림막)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '고성민', id, 116300, '2026-01-31', '겨울 수련회', '찬양팀 식사 / 고성민, 김다슬 외 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 151300, '2026-02-01', '겨울 수련회', '수준위, 찬양팀 식사 / 황루안, 고성민 외 15명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 49100, '2026-02-01', '겨울 수련회', '수준위 식사 / 최예지, 김은지 외 7명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 22000, '2026-02-02', '겨울 수련회', '물품구매(돌파스테이지-O형키링)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 10300, '2026-02-02', '겨울 수련회', '물품구매(돌파스테이지-오링, 진주실)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 7000, '2026-02-02', '겨울 수련회', '물품구매(돌파스테이지-네임택)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 218010, '2026-02-02', '겨울 수련회', '물품구매(간식, 컵라면)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 12900, '2026-02-02', '겨울 수련회', '물품구매(차)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 42820, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 23200, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 15740, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 32680, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 15300, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 27800, '2026-02-02', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 17480, '2026-02-02', '겨울 수련회', '물품구매(커피)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 41750, '2026-02-03', '겨울 수련회', '물품구매(구운란)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 14400, '2026-02-03', '겨울 수련회', '물품구매(칫솔)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 5950, '2026-02-03', '겨울 수련회', '물품구매(절연테이프)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 11570, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 7500, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 17300, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 43900, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 12340, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 11980, '2026-02-03', '겨울 수련회', '물품구매(음료)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 55200, '2026-02-03', '겨울 수련회', '수준위 식사 / 김강영, 이성진 외 2명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 25300, '2026-02-03', '겨울 수련회', '수준위 식사 / 황루안, 김은지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 28080, '2026-02-03', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 118400, '2026-02-04', '겨울 수련회', '물품구매(조식, 종이컵)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 12740, '2026-02-04', '겨울 수련회', '물품구매(간식)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '윤지훈', id, 5218, '2026-02-04', '겨울 수련회', '물품구매(삼각대 거치대)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 124100, '2026-02-05', '겨울 수련회', '물품구매(귤, 레몬)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 800000, '2026-02-05', '겨울 수련회', '현금인출(강사비)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '황루안', id, 8060, '2026-02-05', '겨울 수련회', '물품구매(간식, 봉투)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 19000, '2026-02-05', '겨울 수련회', '물품구매(여성용품)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 19000, '2026-02-05', '겨울 수련회', '물품구매(비상약)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 255840, '2026-02-05', '겨울 수련회', '여행자보험 가입', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 22000, '2026-02-05', '겨울 수련회', '물품구매(단프라 이삿짐 박스)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 155200, '2026-02-05', '겨울 수련회', '수준위 식사 / 김은지, 양정우 외 7인', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '주혜지', id, 27300, '2026-02-06', '겨울 수련회', '선발대 식사 / 주혜지, 고성민 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '주혜지', id, 76000, '2026-02-06', '겨울 수련회', '선발대 식사 / 주혜지, 고성민 외 6명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 800000, '2026-02-06', '겨울 수련회', '버스 대절', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 23000, '2026-02-06', '겨울 수련회', '후발대 식사 / 이상준, 김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 6692000, '2026-02-07', '겨울 수련회', '대관료(동신기도원)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 1050000, '2026-02-08', '겨울 수련회', '외부 찬양팀', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '주혜지', id, 78293, '2026-02-08', '겨울 수련회', '선발대 식사  / 주혜지, 고성민 8명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '예산', id, 390000, '2026-02-08', '겨울 수련회', '식사(노브랜드버거) / 김은지, 최예지 외 63명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이민지', id, 49700, '2026-02-08', '겨울 수련회', '선발대 식사 / 이민지, 조윤상', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 90000, '2026-02-08', '겨울 수련회', '수준위 식사 / 황루안, 김은지 외 7명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '윤지훈', id, 110900, '2026-02-08', '겨울 수련회', '수준위 식사 / 황루안, 김은지 외 7명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '겨울 수련회';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 15700, '2026-01-03', '기타', '임원단 회의_임형재, 김하은 외', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 28500, '2026-02-15', '기타', '임원단 점심_설날', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 10400, '2026-02-15', '기타', '임원단 음료_설날', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 13400, '2026-03-07', '기타', '헤노테스 러닝_커피 박병욱 외 15명', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 1800, '2026-03-07', '기타', '헤노테스 러닝_커피', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 23500, '2026-03-01', '기타', '임원단 음료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '임원단활동비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-01-11', '기타', '생일_이정원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 10000, '2026-01-11', '기타', '생일_진승현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 10000, '2026-01-15', '기타', '생일_김채은', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-01-17', '기타', '생일_이수민', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-01-24', '기타', '생일_최예지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 12000, '2026-01-25', '기타', '등반_꽃_남상욱', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', id, 9800, '2026-01-25', '기타', '생일_오아름', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '임형재', id, 48000, '2026-01-04', '기타', '장로님/권사님_환영꽃', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 10000, '2026-01-06', '기타', '생일_이상준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-01-07', '기타', '생일_홍지은', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이다은', id, 10000, '2026-01-20', '기타', '생일_심수정', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-01-26', '기타', '생일_김수연', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '원수현', id, 10000, '2026-01-27', '기타', '생일_이재경', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 24000, '2026-02-01', '기타', '등반_꽃_박서진/박서윤', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-02-13', '기타', '생일_원수현', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12000, '2026-02-22', '기타', '등반_하헌규', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김요웅', id, 10000, '2026-02-22', '기타', '생일_조윤상', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-02-25', '기타', '생일_송인준', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12000, '2026-03-01', '기타', '등반_김재훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '최예람', id, 10000, '2026-02-06', '기타', '생일_최재열', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김영균', id, 10000, '2026-02-25', '기타', '생일_김지우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-01-19', '기타', '생일_김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-03-12', '기타', '생일_김영균', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김지원', id, 10000, '2026-03-17', '기타', '생일_정연우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-03-17', '기타', '생일_이현우', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박영규', id, 10000, '2026-03-20', '기타', '생일_김예원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '이수민', id, 9400, '2026-03-18', '기타', '생일_김주성', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-03-20', '기타', '생일_임윤희', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '정연우', id, 10000, '2026-03-20', '기타', '생일_정민혁', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김은지', id, 9500, '2026-03-21', '기타', '생일_김현지', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '김경아', id, 10000, '2026-02-26', '기타', '생일_김준호', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 24000, '2026-03-15', '기타', '등반_변유진, 박정훈', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '한유선', id, 10000, '2026-03-09', '기타', '생일_고성민', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '생일/등반';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 75000, '2026-01-09', '새가족팀', '새가족 선물', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 100000, '2026-03-19', '새가족팀', '새가족 선물', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '새가족팀';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 20000, '2026-02-21', '기타', '사역팀장 심방_손은혜, 김강영', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 22000, '2026-03-06', '기타', '사역팀장 심방_손은혜, 김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '손은혜', id, 12700, '2026-03-06', '기타', '사역팀장 심방_손은혜, 김지환', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '사역국장지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 27900, '2026-03-05', '금요예배지원비', '간식지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 38000, '2026-03-06', '금요예배지원비', '금요기도회 지원', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', NULL, id, 40980, '2026-03-19', '금요예배지원비', '금요기도회 지원_컵밥', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '금요예배지원비';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '주혜지', id, 318000, '2026-01-01', '기타', '파티룸', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '박병욱', id, 5900, '2026-01-09', '물품구매', '파티룸 장식 풍선 구매', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 337500, '2026-01-10', '기타', '점심 식사(15인)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 42700, '2026-01-10', '기타', '커피(15인)', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 52540, '2026-01-10', '기타', '간식 구매_과자/음료', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 12000, '2026-01-10', '기타', '간식 구매_귤', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

INSERT INTO public.receipts (submitter_name, payer_name, budget_category_id, amount, receipt_date, vendor_name, memo, file_url, file_path, status, is_claimed)
SELECT '마이그레이션', '목사님', id, 61500, '2026-01-10', '기타', '간식 배달_요거트아이스크림', '실물영수증제출', 'migration', 'approved', true
FROM public.budget_categories WHERE category_name = '신입생 환영 캠프';

-- Total: 188 individual receipts inserted