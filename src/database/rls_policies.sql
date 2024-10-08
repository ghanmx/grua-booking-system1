-- Disable RLS for necessary tables
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Bookings table policies
CREATE POLICY "Admins can delete any booking" ON public.bookings
    FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update any booking" ON public.bookings
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "booking_admin_delete" ON public.bookings
    FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "booking_admin_update" ON public.bookings
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "booking_user_delete_cancelled" ON public.bookings
    FOR DELETE TO public USING (status = 'cancelled' AND auth.uid() = user_id);

CREATE POLICY "booking_user_delete_own" ON public.bookings
    FOR DELETE TO public USING (auth.uid() = user_id);

CREATE POLICY "booking_user_insert_own" ON public.bookings
    FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

CREATE POLICY "booking_user_insert_pending" ON public.bookings
    FOR INSERT TO public WITH CHECK (status = 'pending');

CREATE POLICY "booking_user_select_confirmed" ON public.bookings
    FOR SELECT TO public USING (status = 'confirmed');

CREATE POLICY "booking_user_select_own" ON public.bookings
    FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY "booking_user_update_completed" ON public.bookings
    FOR UPDATE TO public USING (status = 'completed' AND auth.uid() = user_id);

CREATE POLICY "booking_user_update_own" ON public.bookings
    FOR UPDATE TO public USING (auth.uid() = user_id);

CREATE POLICY "Users can create pending bookings" ON public.bookings
    FOR INSERT TO authenticated WITH CHECK (status = 'pending');

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings" ON public.bookings
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cancelled bookings" ON public.bookings
    FOR DELETE TO authenticated USING (status = 'cancelled' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings to completed" ON public.bookings
    FOR UPDATE TO authenticated USING (status = 'completed' AND auth.uid() = user_id);

CREATE POLICY "Users can view confirmed bookings" ON public.bookings
    FOR SELECT TO authenticated USING (status = 'confirmed');

CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Profiles table policies
CREATE POLICY "Authenticated users can delete their own profiles" ON public.profiles
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert profiles" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profiles" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "profile_access_all" ON public.profiles
    FOR ALL TO public USING (true);

CREATE POLICY "user_access_policy" ON public.profiles
    FOR ALL TO public USING (true);

-- Services table policies
CREATE POLICY "Admins and super admins can manage services" ON public.services
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT TO anon USING (true);

CREATE POLICY "service_select_all" ON public.services
    FOR SELECT TO public USING (true);

CREATE POLICY "service_update_manage" ON public.services
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- SMTP Settings table policies
CREATE POLICY "Admins can manage all SMTP settings" ON public.smtp_settings
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can view SMTP settings" ON public.smtp_settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "smtp_admin_manage" ON public.smtp_settings
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "smtp_user_manage_own" ON public.smtp_settings
    FOR ALL TO public USING (auth.uid() = user_id);

CREATE POLICY "smtp_user_view" ON public.smtp_settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own SMTP settings" ON public.smtp_settings
    FOR ALL TO public USING (auth.uid() = user_id);

-- Users table policies
CREATE POLICY "Admins can delete any user data" ON public.users
    FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all user data" ON public.users
    FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Super admins can insert new data" ON public.users
    FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Super admins can manage all user data" ON public.users
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "user_admin_delete" ON public.users
    FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "user_admin_view" ON public.users
    FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "user_own_delete" ON public.users
    FOR DELETE TO public USING (auth.uid() = id);

CREATE POLICY "user_own_insert" ON public.users
    FOR INSERT TO public WITH CHECK (auth.uid() = id);

CREATE POLICY "user_own_update" ON public.users
    FOR UPDATE TO public USING (auth.uid() = id);

CREATE POLICY "user_own_view" ON public.users
    FOR SELECT TO public USING (auth.uid() = id);

CREATE POLICY "user_superadmin_insert" ON public.users
    FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "user_superadmin_manage" ON public.users
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Users can delete their own data" ON public.users
    FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert new data" ON public.users
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT TO authenticated USING (auth.uid() = id);