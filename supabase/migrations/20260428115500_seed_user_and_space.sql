DO $$
DECLARE
  v_user_id uuid;
  v_space_id uuid;
BEGIN
  -- Seed user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andre.calareso@gmail.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'andre.calareso@gmail.com',
      crypt('Skip@Pass123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin Master"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'andre.calareso@gmail.com' LIMIT 1;
  END IF;

  -- Ensure profile exists and is Admin
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (v_user_id, 'andre.calareso@gmail.com', 'Admin Master', 'Admin')
  ON CONFLICT (id) DO UPDATE SET role = 'Admin';

  -- Seed space
  IF NOT EXISTS (SELECT 1 FROM public.spaces) THEN
    v_space_id := gen_random_uuid();
    INSERT INTO public.spaces (id, name, icon)
    VALUES (
      v_space_id,
      'Workspace Principal',
      'https://img.usecurling.com/i?q=company&color=solid-black'
    );
  END IF;
END $$;
