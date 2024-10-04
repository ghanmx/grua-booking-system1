-- Drop existing policies and tables
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data when authenticated and paid" ON public.users;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own unpaid bookings" ON public.bookings;

DROP TABLE IF EXISTS public.payment_transactions;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.services_logs;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.users;

-- Create users table
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
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
    base_price DECIMAL(10, 2) NOT NULL
);

-- Create bookings table with additional fields
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id),
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    vehicle_brand TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    vehicle_size TEXT NOT NULL,
    status TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL
);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for the profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for the bookings table
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unpaid bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id AND payment_status != 'paid');

-- Create policies for the payment_transactions table
CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id));

-- Insert sample data
INSERT INTO public.users (username, email, password_hash)
VALUES 
    ('johndoe', 'john.doe@example.com', 'hashed_password_1'),
    ('janesmith', 'jane.smith@example.com', 'hashed_password_2');

INSERT INTO public.profiles (user_id, full_name, phone_number, role)
VALUES 
    ((SELECT id FROM public.users WHERE email = 'john.doe@example.com'), 'John Doe', '123-456-7890', 'user'),
    ((SELECT id FROM public.users WHERE email = 'jane.smith@example.com'), 'Jane Smith', '098-765-4321', 'admin');

INSERT INTO public.services (service_name, description, base_price)
VALUES 
    ('Towing Service', 'Emergency towing service available 24/7', 50.00),
    ('Roadside Assistance', 'Help with flat tires, dead batteries, etc.', 30.00);

-- Insert sample bookings and payment transactions
-- (You would typically do this through your application logic)

-- Example queries
-- Select all users with their profiles
SELECT u.*, p.full_name, p.phone_number, p.role
FROM public.users u
JOIN public.profiles p ON u.id = p.user_id;

-- Select all bookings with user and service information
SELECT b.*, u.username, s.service_name
FROM public.bookings b
JOIN public.users u ON b.user_id = u.id
JOIN public.services s ON b.service_id = s.id;

-- Select all payment transactions with booking and user information
SELECT pt.*, b.total_cost, u.username
FROM public.payment_transactions pt
JOIN public.bookings b ON pt.booking_id = b.id
JOIN public.users u ON b.user_id = u.id;