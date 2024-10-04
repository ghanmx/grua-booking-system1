-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS services_logs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role TEXT NOT NULL
);

-- Create services table
CREATE TABLE services (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    price_per_km NUMERIC(10, 2) NOT NULL
);

-- Create services_logs table
CREATE TABLE services_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id BIGINT REFERENCES profiles (id),
    service_id BIGINT REFERENCES services (id),
    status TEXT NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    pickup_address TEXT,
    dropoff_address TEXT,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_size TEXT
);

-- Insert sample data into profiles table
INSERT INTO profiles (email, full_name, phone_number, role)
VALUES
    ('john.doe@example.com', 'John Doe', '123-456-7890', 'user'),
    ('jane.smith@example.com', 'Jane Smith', '098-765-4321', 'admin'),
    ('israelreyes16.ir@gmail.com', 'Israel Reyes', NULL, 'admin');

-- Insert sample data into services table
INSERT INTO services (name, description, base_price, price_per_km)
VALUES
    ('Towing Service', 'Emergency towing service available 24/7', 50.00, 2.00),
    ('Roadside Assistance', 'Help with flat tires, dead batteries, etc.', 30.00, 1.50);

-- Insert sample data into services_logs table
INSERT INTO services_logs (profile_id, service_id, status, total_cost, pickup_address, dropoff_address, vehicle_brand, vehicle_model, vehicle_size)
VALUES
    ((SELECT id FROM profiles WHERE full_name = 'John Doe'),
     (SELECT id FROM services WHERE name = 'Towing Service'),
     'completed', 75.00, '123 Main St', '456 Elm St', 'Honda', 'Civic', 'Sedan'),
    ((SELECT id FROM profiles WHERE full_name = 'Jane Smith'),
     (SELECT id FROM services WHERE name = 'Roadside Assistance'),
     'pending', 30.00, '789 Oak St', '101 Pine St', 'Toyota', 'Corolla', 'Sedan');

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Allow public read-only access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Allow public read-only access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON services FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Allow admin to update services" ON services FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Allow authenticated read access" ON services_logs FOR SELECT USING (
    auth.uid()::text = profile_id::text OR auth.role() = 'admin'
);
CREATE POLICY "Allow authenticated insert" ON services_logs FOR INSERT WITH CHECK (auth.uid()::text = profile_id::text);
CREATE POLICY "Allow users to update own logs" ON services_logs FOR UPDATE USING (
    auth.uid()::text = profile_id::text OR auth.role() = 'admin'
);