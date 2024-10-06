-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view and update their own data" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins can view all user data" ON public.users
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Super admins can manage all user data" ON public.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Profiles table policies
CREATE POLICY "Users can view and update their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Super admins can manage all profiles" ON public.profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Services table policies
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Admins and super admins can manage services" ON public.services
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Bookings table policies
CREATE POLICY "Users can view and manage their own bookings" ON public.bookings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Admins can update booking status" ON public.bookings
    FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
    WITH CHECK (NEW.status IS DISTINCT FROM OLD.status);

CREATE POLICY "Super admins can manage all bookings" ON public.bookings
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Function to check if a user is an admin or super admin
CREATE OR REPLACE FUNCTION is_admin_or_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Additional security measures
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.services FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookings FORCE ROW LEVEL SECURITY;