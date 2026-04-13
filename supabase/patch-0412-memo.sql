-- 마이그레이션 영수증 적요(memo) + 결제자(payer_name) 업데이트 (합산 버전)
-- patch-0412-memo-v2.sql

UPDATE public.receipts
SET memo = '수준위 식사 / 황루안, 양정우 외 4명 / 수준위 식사 / 이성진, 윤지훈 외 5명 / 수준위 식사 / 이성진, 윤지훈 외 5명 / 물품구매(기도운동시트지) / 수준위 식사 / 김은지, 김서연 외 6명 / 수준위 식사 / 양정우, 이성진 외 2명 / 수준위 식사 / 황루안, 김은지 외 8명 / 물품구매(수준위 단체티 구매) / 수준위 식사 / 황루안, 양정우 외 6명 / 수준위 식사 / 최예지, 김서연 외 6명 / 물품구매(뱃지) / 물품구매(돌파스테이지-가림막) / 물품구매(볼펜) / 수준위 식사 / 황루안, 김강영 외 7명 / 물품구매(돌파스테이지-편지봉투) / 물품구매(돌파스테이지-편지지) / 물품구매(명찰) / 물품구매(돌파스테이지-우체통) / 물품구매(돌파스테이지-양말목, O형키링, 오링, 나일론끈, 스마일비즈, 네임택) / 물품구매(돌파스테이지-알파벳 비즈) / 물품구매(돌파스테이지-페이퍼프레임) / 물품구매(돌파스테이지-엽서) / 물품구매(돌파스테이지-말씀엽서) / 물품구매(웰컴키트, 간식, 교회선물) / 물품구매(돌파 시뮬레이션) / 물품구매(웰컴키트-손잡이지퍼백) / 물품구매(워크북) / 물품구매(비상약) / 물품구매(가림막) / 찬양팀 식사 / 고성민, 김다슬 외 8명 / 수준위, 찬양팀 식사 / 황루안, 고성민 외 15명 / 수준위 식사 / 최예지, 김은지 외 7명', payer_name = '고성민, 김강영, 김서연, 김은지, 목사님, 예산, 최예지'
WHERE amount = 2318743
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '겨울 수련회')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '물품구매(돌파스테이지-O형키링) / 물품구매(돌파스테이지-오링, 진주실) / 물품구매(돌파스테이지-네임택) / 물품구매(간식, 컵라면) / 물품구매(차) / 물품구매(간식) / 물품구매(간식) / 물품구매(간식) / 물품구매(간식) / 물품구매(간식) / 물품구매(간식) / 물품구매(커피) / 물품구매(구운란) / 물품구매(칫솔) / 물품구매(절연테이프) / 물품구매(음료) / 물품구매(음료) / 물품구매(음료) / 물품구매(음료) / 물품구매(음료) / 물품구매(음료) / 수준위 식사 / 김강영, 이성진 외 2명 / 수준위 식사 / 황루안, 김은지 / 물품구매(간식) / 물품구매(조식, 종이컵) / 물품구매(간식) / 물품구매(삼각대 거치대) / 물품구매(귤, 레몬) / 현금인출(강사비) / 물품구매(간식, 봉투) / 물품구매(여성용품) / 물품구매(비상약) / 여행자보험 가입 / 물품구매(단프라 이삿짐 박스) / 수준위 식사 / 김은지, 양정우 외 7인 / 선발대 식사 / 주혜지, 고성민 외 6명 / 선발대 식사 / 주혜지, 고성민 외 6명 / 버스 대절 / 후발대 식사 / 이상준, 김지환 / 대관료(동신기도원) / 외부 찬양팀 / 선발대 식사  / 주혜지, 고성민 8명 / 식사(노브랜드버거) / 김은지, 최예지 외 63명 / 선발대 식사 / 이민지, 조윤상 / 수준위 식사 / 황루안, 김은지 외 7명 / 수준위 식사 / 황루안, 김은지 외 7명', payer_name = '김은지, 목사님, 예산, 윤지훈, 이민지, 주혜지, 황루안'
WHERE amount = 11647251
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '겨울 수련회')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '간식지원 / 금요기도회 지원'
WHERE amount = 65900
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '금요예배지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '금요기도회 지원_컵밥'
WHERE amount = 40980
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '금요예배지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '간식 / 김지원, 김하은 외 15명', payer_name = '김지원'
WHERE amount = 32300
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '리더모임')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '식사 / 김지원, 김하은 외 14명', payer_name = '김지원'
WHERE amount = 154100
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '리더모임')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '간식 / 김지원, 김하은 외 12명', payer_name = '김지원'
WHERE amount = 29000
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '리더모임')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '온라인 심방 / 김경아 / 식사 / 김지원, 김수연 외 2명 / 카페 / 김지원, 김수연 외 2명', payer_name = '김지원'
WHERE amount = 93000
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '리더장지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '식사 / 김하은 편라원 정연우', payer_name = '김하은'
WHERE amount = 40000
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '리더장지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '키르기스스탄 후속 모임_임형재, 장주영, 장세창 외 10명 / 식당봉사_커피', payer_name = '김하은, 최예지'
WHERE amount = 155500
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '목회지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '제천사역팀 커피_장준호, 박영규 외 12명 / 헤노테스 사역지원', payer_name = '목사님'
WHERE amount = 134800
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '목회지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '사역팀장 심방_손은혜, 김강영 / 사역팀장 심방_손은혜, 김지환 / 사역팀장 심방_손은혜, 김지환', payer_name = '손은혜'
WHERE amount = 54700
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '사역국장지원비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '새가족 선물'
WHERE amount = 75000
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '새가족팀')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '새가족 선물'
WHERE amount = 100000
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '새가족팀')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '생일_이정원 / 생일_진승현 / 생일_김채은 / 생일_이수민 / 생일_최예지 / 등반_꽃_남상욱 / 생일_오아름 / 장로님/권사님_환영꽃 / 생일_이상준 / 생일_홍지은 / 생일_심수정 / 생일_김수연 / 생일_이재경 / 등반_꽃_박서진/박서윤 / 생일_김지환', payer_name = '김경아, 김요웅, 김지원, 박영규, 손은혜, 원수현, 이다은, 이수민, 임형재, 정연우'
WHERE amount = 203800
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '생일/등반')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '생일_원수현 / 등반_하헌규 / 생일_조윤상 / 생일_송인준 / 등반_김재훈 / 생일_최재열 / 생일_김지우 / 생일_김준호', payer_name = '김경아, 김영균, 김요웅, 김지원, 박영규, 손은혜, 최예람'
WHERE amount = 84000
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '생일/등반')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '생일_김영균 / 생일_정연우 / 생일_이현우 / 생일_김예원 / 생일_김주성 / 생일_임윤희 / 생일_정민혁 / 생일_김현지 / 등반_변유진, 박정훈 / 생일_고성민', payer_name = '김경아, 김은지, 김지원, 박영규, 손은혜, 이수민, 정연우, 한유선'
WHERE amount = 112900
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '생일/등반')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '파티룸 / 파티룸 장식 풍선 구매 / 점심 식사(15인) / 커피(15인) / 간식 구매_과자/음료 / 간식 구매_귤 / 간식 배달_요거트아이스크림', payer_name = '목사님, 박병욱, 주혜지'
WHERE amount = 830140
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '신입생 환영 캠프')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '심방_김서연 / 심방_김은지, 전미현 / 심방_손은혜, 이혜원, 김시내 / 심방_손은혜, 김시내, 이혜원 / 심방_장준호 / 수준위 답사 식사_황루안, 최예지 외 8명 / 심방_ 장대성, 손은혜 / 심방_양정우, 김서연 / 심방_손은혜, 김하정', payer_name = '목사님, 손은혜'
WHERE amount = 306200
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '심방비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '심방_임형재, 최예지, 황루안, 박수지 / 심방_임형재, 황루안, 한유선 / 심방_임형재, 황루안, 한유선 / 심방_임형재, 장준호, 이상준 / 심방_임형재, 김민태 / 심방_임형재, 남상욱 / 심방_임형재, 김예진, 김영광 외 3명 / 심방_임형재, 김강영, 손은혜 / 심방_임형재, 양진성 / 심방_편라훤, 조우태', payer_name = '목사님'
WHERE amount = 250580
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '심방비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '심방_이규인 / 심방_주재형,김민태 / 심방_김강영 외 2명 / 심방_김강영 외 2명 / 심방_황루안 / 심방_김수연', payer_name = '목사님'
WHERE amount = 129000
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '심방비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '마이박스_1년 구독 / 도서비 / 베이스 이펙트 스트립_찬양팀 물품 / 미리캔버스 결제 / 인이어 / 이펙터 패달 전용 어댑터', payer_name = '고성민, 목사님'
WHERE amount = 455190
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '예배준비비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '기도통장 / 제자훈련교재 / 제자훈련교재 / 도서-예배준비비', payer_name = '목사님'
WHERE amount = 368340
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '예배준비비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '수련회 프로그램', payer_name = '목사님'
WHERE amount = 22790
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '예배준비비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '임원단 회의_임형재, 김하은 외'
WHERE amount = 15700
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '임원단활동비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '임원단 점심_설날 / 임원단 음료_설날 / 헤노테스 러닝_커피 박병욱 외 15명 / 헤노테스 러닝_커피 / 임원단 음료', payer_name = '목사님, 박병욱, 임형재'
WHERE amount = 77600
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '임원단활동비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '행정물품_사무실간식 / 행정물품_수준위 물품 / 행정물품_USB젠더 / 행정물품_마우스', payer_name = '목사님'
WHERE amount = 133300
  AND receipt_date = '2026-02-01'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '행정물품비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '카카오 푸시 메시지 발송 / 행정물품_렉선반 당근거래 / 카카오 푸시 메시지 발송', payer_name = '박병욱'
WHERE amount = 174000
  AND receipt_date = '2026-03-08'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '행정물품비')
  AND file_url = '실물영수증제출';

UPDATE public.receipts
SET memo = '행정물품_사무실간식 / 행정물품_종이컵', payer_name = '목사님'
WHERE amount = 74290
  AND receipt_date = '2026-03-29'
  AND budget_category_id = (SELECT id FROM public.budget_categories WHERE category_name = '행정물품비')
  AND file_url = '실물영수증제출';

-- Total: 29 updates