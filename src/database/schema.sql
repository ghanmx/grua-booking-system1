-- Drop existing tables if they exist
DROP TABLE IF EXISTS services_logs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user'
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL
);

-- Create services_logs table
CREATE TABLE services_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    service_id UUID REFERENCES services(id),
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
-- Allow users to see their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow authenticated users to insert their own data
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow administrators to view all user data
CREATE POLICY "Admins can view all user data" ON public.users
    FOR SELECT
    USING (auth.role() = 'admin');

-- Allow administrators to update all user data
CREATE POLICY "Admins can update all user data" ON public.users
    FOR UPDATE
    USING (auth.role() = 'admin');


-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Allow public read-only access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read-only access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage services" ON services USING (auth.role() = 'admin');

CREATE POLICY "Allow authenticated read access" ON services_logs FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM profiles WHERE id = services_logs.profile_id) OR auth.role() = 'admin'
);
CREATE POLICY "Allow authenticated insert" ON services_logs FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM profiles WHERE id = services_logs.profile_id)
);
CREATE POLICY "Allow users to update own logs" ON services_logs FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM profiles WHERE id = services_logs.profile_id) OR auth.role() = 'admin'
);
