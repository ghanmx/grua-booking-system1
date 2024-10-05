-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM types
CREATE TYPE user_role AS ENUM('user', 'admin', 'super_admin');
CREATE TYPE booking_status AS ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM('pending', 'paid', 'failed', 'refunded');
CREATE TYPE vehicle_size AS ENUM('small', 'medium', 'large');
CREATE TYPE tow_truck_type AS ENUM('A', 'C', 'D');

-- Create tables
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT CHECK (LENGTH(phone_number) <= 20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);

-- Triggers
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

-- Updated policy for profiles
CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id
    AND (
        (full_name IS NOT NULL AND full_name != '')
        AND (phone_number IS NOT NULL AND phone_number != '' AND phone_number ~ '^[0-9+()-\s]{10,20}$')
    )
);

-- Updated policy for admin users on profiles
CREATE POLICY "Admin users can manage all profiles" ON public.profiles
FOR ALL TO authenticated
USING ((SELECT auth.jwt()->>'role') IN ('admin', 'super_admin'))
WITH CHECK ((SELECT auth.jwt()->>'role') IN ('admin', 'super_admin'));

-- Combined policy for bookings
CREATE POLICY "Users can manage their own bookings" ON public.bookings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY payment_crud_own ON public.payments USING (
  auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);

INSERT INTO auth.users (email, password_hash, role) VALUES
  ('john.doe@example.com', crypt('password123', gen_salt('bf')), 'user'),
  ('jane.smith@example.com', crypt('adminpass456', gen_salt('bf')), 'admin');

INSERT INTO public.profiles (user_id, full_name, phone_number)
SELECT id, 'John Doe', '123-456-7890' FROM auth.users WHERE email = 'john.doe@example.com'
UNION ALL
SELECT id, 'Jane Smith', '098-765-4321' FROM auth.users WHERE email = 'jane.smith@example.com';

INSERT INTO public.services (name, description, base_price, price_per_km, maneuver_charge, tow_truck_type)
VALUES
  ('Grúa de Plataforma (Vehículo Pequeño)', 'Para vehículos pequeños', 528.69, 18.82, 1219.55, 'A'),
  ('Grúa de Plataforma (Vehículo Grande)', 'Para vehículos grandes', 721.79, 23.47, 1524.21, 'C'),
  ('Grúa para Camiones/Camionetas Pesadas', 'Para vehículos muy pesados', 885.84, 32.35, 2101.65, 'D');

-- Sample bookings
INSERT INTO public.bookings (user_id, service_id, status, payment_status, pickup_location, dropoff_location, vehicle_brand, vehicle_model, vehicle_color, license_plate, vehicle_size, in_neutral, engine_starts, wheels_turn, vehicle_position, requires_maneuver, distance, total_cost, pickup_datetime)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'john.doe@example.com'),
  (SELECT id FROM public.services WHERE name = 'Grúa de Plataforma (Vehículo Pequeño)'),
  'completed', 'paid', '123 Main St', '456 Elm St', 'Honda', 'Civic', 'Blue', 'ABC123', 'small', true, true, true, 'Upright', false, 10.5, 726.30, NOW() - INTERVAL '2 days'
UNION ALL
SELECT
  (SELECT id FROM auth.users WHERE email = 'jane.smith@example.com'),
  (SELECT id FROM public.services WHERE name = 'Grúa de Plataforma (Vehículo Grande)'),
  'pending', 'pending', '789 Oak St', '101 Pine St', 'Toyota', 'Corolla', 'Red', 'XYZ789', 'medium', false, false, true, 'Tilted', true, 15.3, 1304.80, NOW() + INTERVAL '1 day';

-- Sample payments
INSERT INTO public.payments (booking_id, amount, payment_method, transaction_id, status)
SELECT 
  id, total_cost, 'Credit Card', 'TXN123456', 'paid'
FROM public.bookings 
WHERE status = 'completed'
UNION ALL
SELECT 
  id, total_cost, 'PayPal', NULL, 'pending'
FROM public.bookings 
WHERE status = 'pending';
