-- Existing tables and policies
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

-- Create SMTP settings table
CREATE TABLE public.smtp_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_custom_smtp BOOLEAN NOT NULL DEFAULT false,
    sender_email TEXT,
    sender_name TEXT,
    smtp_host TEXT,
    port_number INTEGER,
    min_interval INTEGER,
    username TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on smtp_settings table
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for smtp_settings table
CREATE POLICY "Users can manage their own SMTP settings" ON public.smtp_settings
    FOR ALL USING (auth.uid() = user_id);

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
