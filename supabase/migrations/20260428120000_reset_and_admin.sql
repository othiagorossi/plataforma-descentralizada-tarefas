DO $$
BEGIN
  -- Truncate application data to reset workspaces, projects and tasks
  -- Using CASCADE to automatically drop dependent records (like task_assignees)
  TRUNCATE TABLE public.activities CASCADE;
  TRUNCATE TABLE public.task_assignees CASCADE;
  TRUNCATE TABLE public.tasks CASCADE;
  TRUNCATE TABLE public.macro_areas CASCADE;
  TRUNCATE TABLE public.spaces CASCADE;
END $$;

-- Delete all users except andre.calareso@gmail.com to clean up test profiles
DELETE FROM auth.users WHERE email != 'andre.calareso@gmail.com';

-- Set andre.calareso@gmail.com as Admin
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'andre.calareso@gmail.com' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET role = 'Admin' 
    WHERE id = v_user_id;
  END IF;
END $$;
