-- Drop existing tables if they exist
DROP TABLE IF EXISTS services_logs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    phone_number TEXT,
    role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user'
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    price_per_km NUMERIC(10, 2) NOT NULL
);

-- Create services_logs table
CREATE TABLE services_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    service_id UUID REFERENCES services(id),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    total_cost NUMERIC(10, 2) NOT NULL,
    pickup_address TEXT,
    dropoff_address TEXT,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for services_logs
CREATE TRIGGER update_services_logs_modtime
    BEFORE UPDATE ON services_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Insert sample data
INSERT INTO services (name, description, base_price, price_per_km)
VALUES 
    ('Basic Towing', 'Standard towing service for small to medium vehicles', 50.00, 2.00),
    ('Heavy Duty Towing', 'Towing service for large vehicles and trucks', 100.00, 3.50),
    ('Roadside Assistance', 'Basic roadside help including tire change and jump start', 30.00, 1.50);

-- Note: Sample profiles and services_logs data should be inserted after setting up authentication and creating real users