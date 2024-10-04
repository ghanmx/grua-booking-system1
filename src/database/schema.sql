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

-- New policies for bookings table

-- Modify the "Users can update own bookings before service" policy to include a time restriction
DROP POLICY IF EXISTS "Users can update own bookings before service" ON public.bookings;
CREATE POLICY "Users can update own bookings before service" ON public.bookings
FOR UPDATE USING (
    auth.uid() = user_id 
    AND booking_date > (now() + interval '24 hours')
    AND payment_status != 'paid'
);

-- Add a new policy to allow admin users to view and update all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Admins can update all bookings" ON public.bookings
FOR UPDATE USING (auth.role() = 'admin');

-- Modify the audit logging function to include more details
CREATE OR REPLACE FUNCTION log_booking_update() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bookings_audit (
        booking_id, 
        changed_by, 
        old_status, 
        new_status, 
        old_payment_status, 
        new_payment_status,
        old_pickup_address,
        new_pickup_address,
        old_dropoff_address,
        new_dropoff_address
    )
    VALUES (
        OLD.id, 
        auth.uid(), 
        OLD.status, 
        NEW.status, 
        OLD.payment_status, 
        NEW.payment_status,
        OLD.pickup_address,
        NEW.pickup_address,
        OLD.dropoff_address,
        NEW.dropoff_address
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Modify the bookings_audit table to include additional fields
ALTER TABLE public.bookings_audit
ADD COLUMN old_pickup_address TEXT,
ADD COLUMN new_pickup_address TEXT,
ADD COLUMN old_dropoff_address TEXT,
ADD COLUMN new_dropoff_address TEXT;

-- Add an index to improve query performance on the bookings table
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);

-- Add a check constraint to ensure the total_cost is always positive
ALTER TABLE public.bookings
ADD CONSTRAINT check_positive_total_cost CHECK (total_cost > 0);

-- Trigger function to limit booking updates
CREATE OR REPLACE FUNCTION limit_booking_update() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
        RAISE EXCEPTION 'No se puede modificar el estado de pago';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Assign trigger to bookings table
CREATE TRIGGER restrict_booking_updates
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION limit_booking_update();

-- Audit table for bookings
CREATE TABLE public.bookings_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL,
    changed_by UUID NOT NULL,
    change_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_status TEXT,
    new_status TEXT,
    old_payment_status TEXT,
    new_payment_status TEXT,
    CONSTRAINT bookings_audit_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE
);

-- Trigger function for logging booking updates
CREATE OR REPLACE FUNCTION log_booking_update() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bookings_audit (booking_id, changed_by, old_status, new_status, old_payment_status, new_payment_status)
    VALUES (OLD.id, auth.uid(), OLD.status, NEW.status, OLD.payment_status, NEW.payment_status);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Assign audit trigger to bookings table
CREATE TRIGGER audit_booking_changes
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION log_booking_update();

-- Trigger function for notifications
CREATE OR REPLACE FUNCTION notify_user_on_booking_update() 
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('booking_updates', 'La reserva ' || NEW.id || ' ha sido actualizada.');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Assign notification trigger to bookings table
CREATE TRIGGER send_notification_on_update
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION notify_user_on_booking_update();

-- Trigger function to prevent changes on paid bookings
CREATE OR REPLACE FUNCTION prevent_changes_on_paid_bookings() 
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.payment_status = 'paid' THEN
        RAISE EXCEPTION 'No se pueden realizar modificaciones en reservas pagadas';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Assign trigger to block changes on paid bookings
CREATE TRIGGER block_changes_on_paid_bookings
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION prevent_changes_on_paid_bookings();
