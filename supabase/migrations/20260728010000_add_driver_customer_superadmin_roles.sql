-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'driver';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Allow super_admin to view all profiles
CREATE POLICY "Super admin view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to update all profiles
CREATE POLICY "Super admin update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to view all user_roles
CREATE POLICY "Super admin view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to insert roles
CREATE POLICY "Super admin insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to update roles
CREATE POLICY "Super admin update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to delete roles
CREATE POLICY "Super admin delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Function to get all users (for super admin)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  full_name TEXT,
  role public.app_role
)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT 
    u.id,
    u.email,
    u.created_at,
    p.full_name,
    ur.role
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE public.has_role(auth.uid(), 'super_admin')
  ORDER BY u.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;

-- Function to update a user's role (for super admin)
CREATE OR REPLACE FUNCTION public.update_user_role(_user_id UUID, _new_role public.app_role)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;
  
  UPDATE public.user_roles SET role = _new_role WHERE user_id = _user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _new_role);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_role(UUID, public.app_role) TO authenticated;

-- Function to delete a user (for super admin)
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;
  
  DELETE FROM auth.users WHERE id = _user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;

-- Update handle_new_user to use role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  
  -- Use role from signup metadata, default to 'customer' if not specified
  BEGIN
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::public.app_role;
  EXCEPTION WHEN invalid_text_representation THEN
    _role := 'customer';
  END;
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END; $$;