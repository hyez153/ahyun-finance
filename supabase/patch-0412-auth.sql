-- ============================================================
-- 패치: 사용자 인증 테이블 생성
-- ※ 여러 번 실행해도 안전 (멱등성 보장)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- 관리자 계정 시드 (이미 있으면 무시)
INSERT INTO public.users (name, password, role)
VALUES ('Ahyun', 'PraisetheLord', 'admin')
ON CONFLICT (name) DO NOTHING;
