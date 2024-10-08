-- Disable RLS for necessary tables
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
DECLARE 
    tables TEXT[] := ARRAY['bookings', 'profiles', 'services', 'smtp_settings', 'users'];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'policy_' || t || '_select', t);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'policy_' || t || '_insert', t);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'policy_' || t || '_update', t);
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'policy_' || t || '_delete', t);
    END LOOP;
END $$;

-- Create optimized policies
CREATE POLICY "policy_bookings_select" ON public.bookings
    FOR SELECT USING ((auth.uid() = user_id) OR ((SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin')));

CREATE POLICY "policy_bookings_insert" ON public.bookings
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "policy_bookings_update" ON public.bookings
    FOR UPDATE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_bookings_delete" ON public.bookings
    FOR DELETE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_profiles_select" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "policy_profiles_insert" ON public.profiles
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "policy_profiles_update" ON public.profiles
    FOR UPDATE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_profiles_delete" ON public.profiles
    FOR DELETE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_services_select" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "policy_services_insert" ON public.services
    FOR INSERT WITH CHECK ((SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_services_update" ON public.services
    FOR UPDATE USING ((SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_services_delete" ON public.services
    FOR DELETE USING ((SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_smtp_settings_select" ON public.smtp_settings
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_smtp_settings_insert" ON public.smtp_settings
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_smtp_settings_update" ON public.smtp_settings
    FOR UPDATE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_smtp_settings_delete" ON public.smtp_settings
    FOR DELETE USING ((SELECT auth.uid()) = user_id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_users_select" ON public.users
    FOR SELECT USING ((SELECT auth.uid()) = id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_users_insert" ON public.users
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = id OR (SELECT auth.jwt() ->> 'role') = 'super_admin');

CREATE POLICY "policy_users_update" ON public.users
    FOR UPDATE USING ((SELECT auth.uid()) = id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

CREATE POLICY "policy_users_delete" ON public.users
    FOR DELETE USING ((SELECT auth.uid()) = id OR (SELECT auth.jwt() ->> 'role') IN ('admin', 'super_admin'));

-- Enable RLS for all tables
DO $$ 
DECLARE 
    tables TEXT[] := ARRAY['bookings', 'profiles', 'services', 'smtp_settings', 'users'];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;