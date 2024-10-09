-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ENUM types
do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM('user', 'admin', 'super_admin');
    END IF;
END $$;

do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM(
            'pending',
            'confirmed',
            'in_progress',
            'completed',
            'cancelled'
        );
    END IF;
END $$;

do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM('pending', 'paid', 'failed', 'refunded');
    END IF;
END $$;

do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_size') THEN
        CREATE TYPE vehicle_size AS ENUM('small', 'medium', 'large');
    END IF;
END $$;

do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tow_truck_type') THEN
        CREATE TYPE tow_truck_type AS ENUM(
            'flatbed',
            'wheel_lift',
            'integrated',
            'heavy_duty'
        );
    END IF;
END $$;

-- Drop existing tables and their dependencies
drop table if exists public.bookings cascade;
drop table if exists public.profiles cascade;
drop table if exists public.services cascade;
drop table if exists public.smtp_settings cascade;
drop table if exists public.users cascade;

-- Create tables
create table if not exists
  public.users (
    id uuid primary key default uuid_generate_v4 (),
    email text unique not null,
    encrypted_password text not null,
    role user_role not null default 'user',
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint email_format check (
      email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
    )
  );

create table if not exists
  public.services (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    base_price numeric(10, 2) not null check (base_price >= 0),
    price_per_km numeric(10, 2) not null check (price_per_km >= 0),
    maneuver_charge numeric(10, 2) not null check (maneuver_charge >= 0),
    tow_truck_type public.tow_truck_type not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
  );

create table if not exists
  public.bookings (
    id uuid primary key default uuid_generate_v4 (),
    user_id uuid not null references public.users (id) on delete cascade,
    service_id uuid not null references public.services (id) on delete restrict,
    status booking_status not null default 'pending',
    payment_status payment_status not null default 'pending',
    pickup_location text not null,
    dropoff_location text not null,
    vehicle_details jsonb not null,
    distance numeric(10, 2) not null check (distance > 0),
    total_cost numeric(10, 2) not null check (total_cost > 0),
    pickup_datetime timestamp with time zone not null,
    additional_details text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
  );

create table if not exists
  public.profiles (
    id uuid primary key default uuid_generate_v4 (),
    user_id uuid not null references public.users (id) on delete cascade,
    full_name text not null,
    phone_number text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint unique_user_profile unique (user_id),
    constraint phone_number_format check (phone_number ~ '^\+?[1-9]\d{1,14}$')
  );

create table if not exists
  public.smtp_settings (
    id uuid primary key default uuid_generate_v4 (),
    user_id uuid not null references public.users (id) on delete cascade,
    host text not null,
    port integer not null,
    username text not null,
    password text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
  );