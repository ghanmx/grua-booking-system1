-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data when authenticated and paid" ON public.users;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.services_logs;

-- Create users table with UUID as primary key
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create services_logs table
CREATE TABLE public.services_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL,
    service_id UUID NOT NULL,
    status TEXT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    pickup_address TEXT,
    dropoff_address TEXT,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT services_logs_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT services_logs_service_id_fkey FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS) on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
-- Allow users to see their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Allow authenticated users to insert their own data when they have a paid booking
CREATE POLICY "Users can insert own data when authenticated and paid" ON public.users FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 
            FROM public.bookings 
            WHERE bookings.user_id = auth.uid() 
            AND bookings.payment_status = 'paid'
        )
    );

-- Enable Row Level Security (RLS) on the bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for the bookings table
-- Allow users to see their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own bookings
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Modify the policy for updating bookings
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own unpaid bookings" ON public.bookings
    FOR UPDATE
    USING (auth.uid() = user_id AND payment_status != 'paid');

-- Insert sample data into profiles table
INSERT INTO profiles (email, full_name, phone_number, role)
VALUES 
    ('john.doe@example.com', 'John Doe', '123-456-7890', 'user'),
    ('jane.smith@example.com', 'Jane Smith', '098-765-4321', 'admin');

-- Retrieve profile IDs
SELECT id, full_name FROM profiles;

-- Insert sample data into services table
INSERT INTO services (service_name, description, price)
VALUES 
    ('Towing Service', 'Emergency towing service available 24/7', 50.00),
    ('Roadside Assistance', 'Help with flat tires, dead batteries, etc.', 30.00);

-- Insert sample data into services_logs table
INSERT INTO services_logs (profile_id, service_id, status, total_cost)
VALUES 
    ((SELECT id FROM profiles WHERE full_name = 'John Doe'),
     (SELECT id FROM services WHERE service_name = 'Towing Service'),
     'completed', 75.00),
    ((SELECT id FROM profiles WHERE full_name = 'Jane Smith'),
     (SELECT id FROM services WHERE service_name = 'Roadside Assistance'),
     'pending', 30.00);

-- Update services_logs entries with more detailed booking information
UPDATE services_logs
SET pickup_address = '123 Main St',
    dropoff_address = '456 Elm St',
    vehicle_brand = 'Honda',
    vehicle_model = 'Civic',
    vehicle_size = 'Sedan' 
WHERE profile_id = (SELECT id FROM profiles WHERE full_name = 'John Doe');

UPDATE services_logs
SET pickup_address = '789 Oak St',
    dropoff_address = '321 Pine St',
    vehicle_brand = 'Toyota',
    vehicle_model = 'Corolla',
    vehicle_size = 'Sedan' 
WHERE profile_id = (SELECT id FROM profiles WHERE full_name = 'Jane Smith');

-- Select all services_logs entries with their related profiles and services
SELECT sl.*, p.full_name, s.service_name
FROM services_logs sl
JOIN profiles p ON sl.profile_id = p.id
JOIN services s ON sl.service_id = s.id;

-- Select all users with their related bookings
SELECT u.id, u.username, u.email, b.booking_date, b.status, b.payment_status
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id;
