-- ============================================================
-- 아현 재정 관리 시스템 — DB 스키마
-- Supabase SQL Editor에서 실행
-- ============================================================

-- ============================================================
-- 0. 초기화 (기존 테이블/정책 전체 삭제)
-- ============================================================
drop table if exists public.budget_transactions cascade;
drop table if exists public.receipts cascade;
drop table if exists public.claim_batches cascade;
drop table if exists public.budget_categories cascade;

drop policy if exists "public upload receipt files" on storage.objects;
drop policy if exists "public read receipt files" on storage.objects;


create extension if not exists pgcrypto;

-- ============================================================
-- 1. 예산 항목
-- ============================================================
create table if not exists public.budget_categories (
  id            bigint generated always as identity primary key,
  group_name    text not null check (group_name in ('목회', '양육', '사역', '행사')),
  category_name text not null,
  annual_budget numeric(14, 2) not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 2. 청구 배치
-- ============================================================
create table if not exists public.claim_batches (
  id                  bigint generated always as identity primary key,
  year                int not null,
  month               int not null check (month between 1 and 12),
  week_no             int not null default 1 check (week_no between 1 and 5),  -- 해당 월의 N번째 토요일
  submission_deadline timestamptz not null,
  claim_date          date not null,
  status              text not null default 'draft' check (status in ('draft', 'confirmed')),
  total_amount        numeric(14, 2) not null default 0,
  created_at          timestamptz not null default now(),
  unique (year, month, week_no)
);

-- ============================================================
-- 3. 영수증
-- ============================================================
create table if not exists public.receipts (
  id                  bigint generated always as identity primary key,
  submitter_name      text not null,
  payer_name          text,            -- 결제자 (제출자와 다를 수 있음)
  budget_category_id  bigint not null references public.budget_categories(id),
  claim_batch_id      bigint references public.claim_batches(id),
  amount              numeric(14, 2) not null check (amount > 0),
  receipt_date        date not null,
  submitted_at        timestamptz default now(),
  vendor_name         text not null,
  memo                text,
  file_url            text not null,
  file_path           text not null,
  status              text not null default 'submitted' check (status in ('draft', 'submitted', 'approved')),
  is_claimed          boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- 4. 예산 변동 이력
-- ============================================================
create table if not exists public.budget_transactions (
  id                  bigint generated always as identity primary key,
  budget_category_id  bigint not null references public.budget_categories(id),
  transaction_type    text not null check (
                        transaction_type in ('opening_budget', 'prior_claim', 'monthly_claim', 'adjustment')
                      ),
  amount              numeric(14, 2) not null,
  transaction_date    date not null,
  source_type         text not null check (
                        source_type in ('receipt', 'migration', 'claim_batch', 'manual', 'system')
                      ),
  source_id           bigint,
  memo                text,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- 5. Storage 버킷
-- ============================================================
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

-- ============================================================
-- 6. RLS 설정
-- ============================================================
alter table public.budget_categories enable row level security;
alter table public.claim_batches enable row level security;
alter table public.receipts enable row level security;
alter table public.budget_transactions enable row level security;

create policy "public read categories" on public.budget_categories for select using (true);
create policy "public insert receipts" on public.receipts for insert with check (true);
create policy "public read receipts" on public.receipts for select using (true);
create policy "public update receipts" on public.receipts for update using (true);
create policy "public read claim batches" on public.claim_batches for select using (true);
create policy "public insert claim batches" on public.claim_batches for insert with check (true);
create policy "public update claim batches" on public.claim_batches for update using (true);
create policy "public read budget transactions" on public.budget_transactions for select using (true);
create policy "public insert budget transactions" on public.budget_transactions for insert with check (true);
create policy "public upload receipt files" on storage.objects for insert with check (bucket_id = 'receipts');
create policy "public read receipt files" on storage.objects for select using (bucket_id = 'receipts');

-- ============================================================
-- 7. 초기 예산 데이터 (2026년)
-- ============================================================
insert into public.budget_categories (group_name, category_name, annual_budget) values
  -- 목회
  ('목회', '행정물품비',   1700000),
  ('목회', '심방비',       4800000),
  ('목회', '목회지원비',   1200000),
  ('목회', '예배준비비',   1500000),
  -- 양육
  ('양육', '리더장 지원비',  1200000),
  ('양육', '리더 모임',      2000000),
  ('양육', '소그룹 운영비',  8100000),
  ('양육', '전체리더십캠프', 2000000),
  ('양육', '여름 수련회',    8000000),
  ('양육', '겨울 수련회',   10000000),
  ('양육', '임원단 활동비',  1800000),
  ('양육', '임원단 캠프',    1500000),
  ('양육', '교육훈련비',      800000),
  ('양육', '생일/등반',      1370000),
  ('양육', '고3 사역',        300000),
  ('양육', '새가족팀',        720000),
  -- 사역
  ('사역', '사역국장지원비',          720000),
  ('사역', '카이노스 찬양팀',        1500000),
  ('사역', '중보기도팀',              600000),
  ('사역', '방송팀',                 1020000),
  ('사역', '스포츠선교팀',           1500000),
  ('사역', '전도팀',                 1200000),
  ('사역', '케노시스 워십팀',         420000),
  ('사역', '로뎀 기도회',             600000),
  ('사역', '평신도사역자 지원비',    6000000),
  ('사역', '금요예배 지원',          1000000),
  -- 행사
  ('행사', '특별예배',      1000000),
  ('행사', '전도프로그램',  1500000),
  ('행사', '신입생 환영캠프', 1000000),
  ('행사', '임명식/수료식',   500000),
  ('행사', '연합행사',        200000),
  ('행사', '크리스마스',     1200000),
  ('행사', '야외예배',              0),
  ('행사', '봉사활동',      1000000),
  ('행사', '강사초청',      1600000)
on conflict do nothing;

-- ============================================================
-- 8. 테이블 권한 부여 (RLS 정책 외 별도 필요)
-- ============================================================
grant select on public.budget_categories to anon, authenticated;
grant select on public.claim_batches to anon, authenticated;
grant select, insert, update on public.receipts to anon, authenticated;
grant select, insert on public.budget_transactions to anon, authenticated;

-- ============================================================
-- 9. 업로드 차단 시간대 (토 22:00~24:00 = 청구 정리 시간)
--
--   영수증 insert는 브라우저 → Supabase 직행이라 서버 라우트를 안 거친다.
--   화면에서 버튼을 잠가도 폰 시계가 틀리면 통과하므로, 서버 시계(KST)로
--   여기서 막는다. 화면 차단은 안내용이고 이게 진짜 차단이다.
-- ============================================================
create or replace function public.reject_upload_during_blackout()
returns trigger
language plpgsql
as $$
declare
  kst timestamp;
begin
  kst := now() at time zone 'Asia/Seoul';

  -- extract(dow): 0=일, 6=토
  if extract(dow from kst) = 6 and kst::time >= time '22:00' then
    raise exception using
      errcode = 'P0001',
      message = '토요일 22:00~24:00은 청구 정리 시간이라 영수증을 등록할 수 없습니다. 일요일 0시부터 다시 등록해주세요.';
  end if;

  return new;
end;
$$;

drop trigger if exists receipts_upload_blackout on public.receipts;

create trigger receipts_upload_blackout
  before insert on public.receipts
  for each row
  execute function public.reject_upload_during_blackout();

-- ============================================================
-- 10. 영수증 수정 규칙
--
--   청구된 영수증의 내용은 영구히 잠근다. 토 22:00~24:00에도 못 고친다.
--   단 "내용" 칸만 본다 — 회계가 배치에 쓰는 claim_batch_id / is_claimed /
--   status만 바뀌는 update는 통과시킨다. 안 그러면 하필 회계가 일하는
--   그 시간에 배치를 못 만든다.
--
--   삭제는 막지 않는다. 관리자는 정리 시간에도 잘못된 영수증을 빼야 하는데,
--   DB는 익명 키만 보므로 관리자와 유저를 구분할 수 없다. 삭제 차단은 화면에서.
-- ============================================================
create or replace function public.reject_receipt_content_edit()
returns trigger
language plpgsql
as $$
declare
  kst timestamp;
  content_changed boolean;
begin
  content_changed :=
       new.submitter_name     is distinct from old.submitter_name
    or new.payer_name         is distinct from old.payer_name
    or new.budget_category_id is distinct from old.budget_category_id
    or new.amount             is distinct from old.amount
    or new.receipt_date       is distinct from old.receipt_date
    or new.vendor_name        is distinct from old.vendor_name
    or new.memo               is distinct from old.memo
    or new.file_url           is distinct from old.file_url
    or new.file_path          is distinct from old.file_path;

  if not content_changed then
    return new;
  end if;

  if old.is_claimed or old.claim_batch_id is not null then
    raise exception using
      errcode = 'P0001',
      message = '이미 청구된 영수증은 수정할 수 없습니다.';
  end if;

  kst := now() at time zone 'Asia/Seoul';
  if extract(dow from kst) = 6 and kst::time >= time '22:00' then
    raise exception using
      errcode = 'P0001',
      message = '토요일 22:00~24:00은 청구 정리 시간이라 영수증을 수정할 수 없습니다. 일요일 0시부터 수정해주세요.';
  end if;

  return new;
end;
$$;

drop trigger if exists receipts_content_edit_guard on public.receipts;

create trigger receipts_content_edit_guard
  before update on public.receipts
  for each row
  execute function public.reject_receipt_content_edit();
