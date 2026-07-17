-- ============================================================
-- 패치 2026-07-17: 청구 주기 격주 → 매주
--
--   claim_batches.half     (1=첫째주, 2=셋째주)
--     → claim_batches.week_no (1~5 = 해당 월의 N번째 토요일)
--
-- 기존 데이터 변환:
--   half=1 (첫째주) → week_no=1
--   half=2 (셋째주) → week_no=3
--   submission_deadline / claim_date 는 이미 실제 날짜가 저장되어 있으므로
--   건드리지 않는다. week_no는 그 날짜에 붙는 이름표일 뿐이다.
--
-- [알려진 차이 — 의도된 것]
--   초기 마이그레이션 시절 배치 3건은 half 값과 실제 마감일이 원래부터
--   어긋나 있다. 확정된 과거 회계 데이터라 보정하지 않고 그대로 둔다.
--     id=13  2월 half=1 → week_no=1  (실제 마감 1/31 = 1월 5번째 토요일)
--     id=14  2월 half=2 → week_no=3  (실제 마감 2/07 = 2월 1번째 토요일)
--     id=16  3월 half=2 → week_no=3  (실제 마감 3/28 = 3월 4번째 토요일)
--   → 이 3건은 배치 카드의 "N째주" 라벨만 실제 마감일과 다르게 보인다.
--     마감일·청구일·금액·영수증 연결은 모두 정확하므로 집계에는 영향 없다.
--     스케줄러(findOpenSlot)는 이번 달과 다음 달만 보므로 영향 없다.
--   4월 이후 배치 7건은 값이 실제 마감일과 정확히 일치한다.
--
-- ※ 여러 번 실행해도 안전 (멱등성 보장)
--   전체를 "half 컬럼이 아직 존재하는가"로 감싼 이유:
--   매주 전환 후에는 week_no=2(둘째주)가 정상 데이터이므로,
--   2→3 변환이 재실행되면 멀쩡한 둘째주 배치를 망가뜨린다.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'claim_batches'
      AND column_name = 'half'
  ) THEN
    ALTER TABLE public.claim_batches RENAME COLUMN half TO week_no;

    -- RENAME은 제약을 따라오게 하므로(check (half in (1,2)) → week_no in (1,2)),
    -- 값을 옮기기 전에 먼저 떼어낸다
    ALTER TABLE public.claim_batches DROP CONSTRAINT IF EXISTS claim_batches_half_check;
    ALTER TABLE public.claim_batches DROP CONSTRAINT IF EXISTS claim_batches_year_month_half_key;

    UPDATE public.claim_batches SET week_no = 3 WHERE week_no = 2;

    -- 한 달에 토요일은 최대 5번
    ALTER TABLE public.claim_batches
      ADD CONSTRAINT claim_batches_week_no_check CHECK (week_no BETWEEN 1 AND 5);
    ALTER TABLE public.claim_batches
      ADD CONSTRAINT claim_batches_year_month_week_no_key UNIQUE (year, month, week_no);
  END IF;
END $$;

-- ============================================================
-- 검증 쿼리 (실행 후 확인용)
-- ============================================================
-- 배치별 week_no가 실제 claim_date와 맞는지 확인:
--
-- SELECT year, month, week_no, submission_deadline, claim_date, status
-- FROM public.claim_batches
-- ORDER BY year, month, week_no;
--
-- 기존 배치는 week_no가 1 또는 3 이어야 하고,
-- claim_date는 모두 일요일이어야 한다.
