DO $$
BEGIN
  -- 1. Create missing tables (spaces, activities)
  CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'https://img.usecurling.com/i?q=workspace',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. Enable RLS
  ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

  -- 3. RLS Policies for new tables
  DROP POLICY IF EXISTS "spaces_select" ON public.spaces;
  CREATE POLICY "spaces_select" ON public.spaces FOR SELECT TO authenticated USING (true);
  
  DROP POLICY IF EXISTS "spaces_all" ON public.spaces;
  CREATE POLICY "spaces_all" ON public.spaces FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
  );

  DROP POLICY IF EXISTS "activities_select" ON public.activities;
  CREATE POLICY "activities_select" ON public.activities FOR SELECT TO authenticated USING (true);
  
  DROP POLICY IF EXISTS "activities_insert" ON public.activities;
  CREATE POLICY "activities_insert" ON public.activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

  -- 4. Update profiles policies for admin
  DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
  CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
  );
  
  DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
  CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
  );
  
  -- 5. Admin can delete any task
  DROP POLICY IF EXISTS "tasks_delete" ON public.tasks;
  CREATE POLICY "tasks_delete" ON public.tasks FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
  );
END $$;

-- 6. Clean existing mock/legacy data
DELETE FROM public.activities;
DELETE FROM public.task_assignees;
DELETE FROM public.tasks;
DELETE FROM public.macro_areas;
DELETE FROM public.spaces;

-- 7. Reset all users except the admin
DELETE FROM auth.users WHERE email != 'andre.calareso@gmail.com';

-- 8. Ensure the user is an Admin
UPDATE public.profiles SET role = 'Admin' WHERE email = 'andre.calareso@gmail.com';
