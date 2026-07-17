-- ============================================================
-- 패치 2026-07-17: 영수증 수정 규칙
--
--   1. 청구된 영수증(is_claimed 또는 claim_batch_id 있음)의 내용은
--      영구히 수정 불가. 확정된 회계 기록이므로 시간과 무관하게 잠근다.
--   2. 토요일 22:00~24:00(청구 정리 시간)에는 내용 수정 불가.
--
-- [핵심: "내용"만 막는다]
--   회계가 배치를 확정할 때 영수증의 claim_batch_id / is_claimed / status를
--   바꾼다. 배치를 지울 때도 같은 세 칸을 되돌린다. 그게 전부다.
--   그래서 이 세 칸만 바뀌는 update는 그냥 통과시킨다.
--   안 그러면 22:00~24:00에 회계가 배치를 못 만든다. 하필 그 시간이
--   회계가 일하는 시간이다.
--
-- [삭제는 왜 안 막나]
--   관리자는 22:00~24:00에도 잘못된 영수증을 지울 수 있어야 한다
--   (그걸 빼고 배치를 만들어야 하므로). 그런데 이 앱은 이름+비밀번호를
--   앱이 직접 확인하고 Supabase에는 익명 키로 붙는 구조라, DB 입장에서
--   관리자와 일반 사용자가 완전히 똑같다. auth.uid()가 없다.
--   그래서 "관리자는 되고 유저는 안 되는" 규칙은 DB에서 표현할 수 없다.
--   삭제 차단은 화면에서만 한다. 실수를 막는 게 목적이고, 악의적 우회를
--   막으려면 신원 구조부터 바꿔야 한다.
--
-- ※ 여러 번 실행해도 안전 (멱등성 보장)
-- ============================================================

CREATE OR REPLACE FUNCTION public.reject_receipt_content_edit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  kst timestamp;
  content_changed boolean;
BEGIN
  -- 사용자가 고치는 "내용" 칸들. 회계가 쓰는 세 칸(claim_batch_id,
  -- is_claimed, status)은 여기 없다 = 언제든 통과.
  content_changed :=
       NEW.submitter_name     IS DISTINCT FROM OLD.submitter_name
    OR NEW.payer_name         IS DISTINCT FROM OLD.payer_name
    OR NEW.budget_category_id IS DISTINCT FROM OLD.budget_category_id
    OR NEW.amount             IS DISTINCT FROM OLD.amount
    OR NEW.receipt_date       IS DISTINCT FROM OLD.receipt_date
    OR NEW.vendor_name        IS DISTINCT FROM OLD.vendor_name
    OR NEW.memo               IS DISTINCT FROM OLD.memo
    OR NEW.file_url           IS DISTINCT FROM OLD.file_url
    OR NEW.file_path          IS DISTINCT FROM OLD.file_path;

  IF NOT content_changed THEN
    RETURN NEW;
  END IF;

  -- 1. 청구된 건은 언제든 못 고친다
  IF OLD.is_claimed OR OLD.claim_batch_id IS NOT NULL THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = '이미 청구된 영수증은 수정할 수 없습니다.';
  END IF;

  -- 2. 청구 정리 시간에는 못 고친다
  kst := now() AT TIME ZONE 'Asia/Seoul';
  IF EXTRACT(dow FROM kst) = 6 AND kst::time >= TIME '22:00' THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = '토요일 22:00~24:00은 청구 정리 시간이라 영수증을 수정할 수 없습니다. 일요일 0시부터 수정해주세요.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS receipts_content_edit_guard ON public.receipts;

CREATE TRIGGER receipts_content_edit_guard
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.reject_receipt_content_edit();

-- ============================================================
-- 검증 (실행 후 확인용)
-- ============================================================
-- 1) 트리거 둘 다 붙었는지 (insert 차단 + update 차단):
--
-- SELECT tgname FROM pg_trigger
-- WHERE tgrelid = 'public.receipts'::regclass AND NOT tgisinternal
-- ORDER BY tgname;
--   → receipts_content_edit_guard
--     receipts_upload_blackout
--
-- 2) 회계의 배치 작업이 안 막히는지 (내용 안 바뀌는 update):
--    아래는 status만 제자리로 다시 쓰는 것이라 통과해야 한다.
--
-- UPDATE public.receipts SET status = status WHERE id = (
--   SELECT id FROM public.receipts LIMIT 1
-- );
--
-- 3) 청구된 영수증의 내용이 잠겼는지:
--    아래는 반드시 에러가 나야 한다 ("이미 청구된 영수증은...").
--
-- UPDATE public.receipts SET memo = memo || '_시험'
-- WHERE is_claimed = true LIMIT 1;
--   → 실행 후 되돌릴 필요 없음 (에러로 롤백됨)
