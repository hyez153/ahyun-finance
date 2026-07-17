-- ============================================================
-- 패치 2026-07-17: 토요일 22:00~24:00 영수증 등록 차단
--
--   토요일 22:00 마감 → 22:00~24:00 회계 정리 → 일요일 청구
--
--   정리 중에 영수증이 새로 들어오면 이번 배치에 넣을지 다음으로 미룰지가
--   애매해진다. 그래서 그 두 시간은 접수를 아예 닫는다.
--
-- [왜 화면 차단만으로 부족한가]
--   영수증 insert는 브라우저 → Supabase 직행이다. 서버 라우트를 안 거친다.
--   그래서 화면에서 버튼을 잠가도, 폰 시계가 틀리거나 시간대가 다른 곳에
--   있으면 그대로 통과한다. 판단을 기기 시계에 맡길 수 없다.
--   이 트리거는 서버 시계를 KST로 바꿔서 보므로 기기와 무관하게 막는다.
--
-- [왜 RLS 정책이 아니라 트리거인가]
--   RLS로 막으면 "new row violates row-level security policy for table
--   receipts" 라는 알 수 없는 영어가 사용자에게 뜬다.
--   트리거는 아래에 쓴 한국어 안내를 그대로 띄울 수 있다.
--
-- [의도적으로 안 한 것]
--   관리자 예외를 두지 않았다. 지금 이 앱에는 DB가 신뢰할 수 있는
--   사용자 신원(auth.uid())이 없다. 이름+비밀번호를 앱이 직접 확인하고
--   Supabase에는 익명 키로 붙는 구조라, 트리거 입장에서 관리자와 일반
--   사용자를 구분할 방법이 없다. 회계가 그 두 시간에 영수증을 대신
--   등록해야 하는 일이 생기면 그때 신원 구조부터 손봐야 한다.
--
-- ※ 여러 번 실행해도 안전 (멱등성 보장)
-- ============================================================

CREATE OR REPLACE FUNCTION public.reject_upload_during_blackout()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  kst timestamp;
BEGIN
  -- now()는 timestamptz. 서버가 UTC로 돌아도 KST 벽시계로 바꿔서 본다.
  kst := now() AT TIME ZONE 'Asia/Seoul';

  -- extract(dow): 0=일, 6=토
  IF EXTRACT(dow FROM kst) = 6 AND kst::time >= TIME '22:00' THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = '토요일 22:00~24:00은 청구 정리 시간이라 영수증을 등록할 수 없습니다. 일요일 0시부터 다시 등록해주세요.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS receipts_upload_blackout ON public.receipts;

CREATE TRIGGER receipts_upload_blackout
  BEFORE INSERT ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.reject_upload_during_blackout();

-- ============================================================
-- 검증 (실행 후 확인용)
-- ============================================================
-- 1) 지금 서버가 보는 KST 시각과 차단 여부:
--
-- SELECT
--   now() AT TIME ZONE 'Asia/Seoul'                        AS kst_now,
--   EXTRACT(dow FROM now() AT TIME ZONE 'Asia/Seoul')      AS dow_0is_sun,
--   (EXTRACT(dow FROM now() AT TIME ZONE 'Asia/Seoul') = 6
--    AND (now() AT TIME ZONE 'Asia/Seoul')::time >= TIME '22:00') AS blocked_now;
--
-- 2) 트리거가 붙었는지:
--
-- SELECT tgname, tgenabled FROM pg_trigger
-- WHERE tgrelid = 'public.receipts'::regclass AND NOT tgisinternal;
--
-- 3) 차단 시간대가 아닐 때 일부러 막히는지 시험하려면 함수의 시각 조건을
--    잠깐 바꿔서 insert 해보고 되돌린다. (운영 데이터에는 넣지 말 것)
