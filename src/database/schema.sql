-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS services_logs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS profiles;

-- Create the profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone_number TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the services_logs table
CREATE TABLE services_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL,
    service_id UUID NOT NULL,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_cost NUMERIC(10, 2),
    CONSTRAINT services_logs_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT services_logs_service_id_fkey FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
);

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Allow public read-only access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public read-only access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON services FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Allow admin to update services" ON services FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Allow authenticated read access" ON services_logs FOR SELECT USING (auth.uid() = profile_id OR auth.role() = 'admin');
CREATE POLICY "Allow authenticated insert" ON services_logs FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Allow users to update own logs" ON services_logs FOR UPDATE USING (auth.uid() = profile_id OR auth.role() = 'admin');