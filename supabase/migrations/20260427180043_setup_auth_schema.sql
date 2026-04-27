DO $$
BEGIN
  -- 1. Create tables
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'Member',
    credits INTEGER NOT NULL DEFAULT 0,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    assigned_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.macro_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cost_center TEXT NOT NULL,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    credits INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMPTZ,
    macro_area_id UUID REFERENCES public.macro_areas(id) ON DELETE SET NULL,
    google_event_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.task_assignees (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
  );
END $$;

-- 2. Triggers for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macro_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "macro_areas_select" ON public.macro_areas;
CREATE POLICY "macro_areas_select" ON public.macro_areas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "macro_areas_all" ON public.macro_areas;
CREATE POLICY "macro_areas_all" ON public.macro_areas FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'Project Manager' OR role = 'Admin'))
);

DROP POLICY IF EXISTS "tasks_select" ON public.tasks;
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "tasks_insert" ON public.tasks;
CREATE POLICY "tasks_insert" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "tasks_update" ON public.tasks;
CREATE POLICY "tasks_update" ON public.tasks FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "task_assignees_select" ON public.task_assignees;
CREATE POLICY "task_assignees_select" ON public.task_assignees FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "task_assignees_all" ON public.task_assignees;
CREATE POLICY "task_assignees_all" ON public.task_assignees FOR ALL TO authenticated USING (true);

-- 4. Seed Data
DO $$
DECLARE
  admin_id UUID := 'd90e66e9-38b4-4b52-b16a-1910ef0b3303'::uuid;
  user_id UUID := 'a8c71db1-2b99-44be-9f88-44fa12803b9f'::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andre.calareso@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'andre.calareso@gmail.com',
      crypt('Skip@Pass123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "André Calareso"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    
    UPDATE public.profiles SET role = 'Project Manager' WHERE id = admin_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ana.silva@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      user_id, '00000000-0000-0000-0000-000000000000', 'ana.silva@example.com',
      crypt('Skip@Pass123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Ana Silva"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;
  
  -- Seed Macro Areas
  INSERT INTO public.macro_areas (id, name, cost_center) VALUES 
    ('11111111-1111-1111-1111-111111111111'::uuid, 'Área 1', 'CC-001'),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Área 2', 'CC-002'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Área 3', 'CC-003'),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'Área 4', 'CC-004'),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'Área 5', 'CC-005'),
    ('66666666-6666-6666-6666-666666666666'::uuid, 'Área 6', 'CC-006')
  ON CONFLICT (id) DO NOTHING;
END $$;
