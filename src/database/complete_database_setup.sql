-- Enable necessary extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM types for roles, statuses, vehicle categories
CREATE TYPE user_role AS ENUM('user', 'admin', 'super_admin');
CREATE TYPE booking_status AS ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM('pending', 'paid', 'failed', 'refunded');
CREATE TYPE vehicle_size AS ENUM('small', 'medium', 'large');
CREATE TYPE tow_truck_type AS ENUM('A', 'C', 'D');

-- Create users table with roles and timestamps
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create profiles table with references to users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT CHECK (LENGTH(phone_number) <= 20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create services table for defining various tow services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  price_per_km NUMERIC(10, 2) NOT NULL,
  maneuver_charge NUMERIC(10, 2) NOT NULL,
  tow_truck_type tow_truck_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create bookings table to track service bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  vehicle_size vehicle_size NOT NULL,
  in_neutral BOOLEAN NOT NULL,
  engine_starts BOOLEAN NOT NULL,
  wheels_turn BOOLEAN NOT NULL,
  vehicle_position TEXT NOT NULL,
  requires_maneuver BOOLEAN NOT NULL,
  distance NUMERIC(10, 2) NOT NULL CHECK (distance > 0),
  total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost > 0),
  pickup_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  additional_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for faster access
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_timestamp BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_timestamp BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_timestamp BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-level security (RLS) and policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_crud_own ON auth.users USING (auth.uid() = id);
CREATE POLICY profile_crud_own ON public.profiles USING (auth.uid() = user_id);
CREATE POLICY booking_crud_own ON public.bookings USING (auth.uid() = user_id);
CREATE POLICY payment_crud_own ON public.payments USING (
  auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);

-- Sample data for services
INSERT INTO public.services (name, description, base_price, price_per_km, maneuver_charge, tow_truck_type)
VALUES
  ('Grúa de Plataforma (Vehículo Pequeño)', 'Para vehículos pequeños', 528.69, 18.82, 1219.55, 'A'),
  ('Grúa de Plataforma (Vehículo Grande)', 'Para vehículos grandes', 721.79, 23.47, 1524.21, 'C'),
  ('Grúa para Camiones/Camionetas Pesadas', 'Para vehículos muy pesados', 885.84, 32.35, 2101.65, 'D');
