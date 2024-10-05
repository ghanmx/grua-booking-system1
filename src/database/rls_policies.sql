-- Drop existing policies for public.profiles
DROP POLICY IF EXISTS "Admin users can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their full name" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their full name if not empty" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their phone number" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their phone number if it matches" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their phone number if not empty" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their role" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a single comprehensive policy for authenticated users
CREATE POLICY "Authenticated users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id
    AND (
        (full_name IS NOT NULL AND full_name != '')
        AND (phone_number IS NOT NULL AND phone_number != '' AND phone_number ~ '^[0-9+()-\s]{10,20}$')
    )
);

-- Create a separate policy for admin users
CREATE POLICY "Admin users can update all profiles" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.jwt()->>'role' = 'admin')
WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Ensure RLS is enabled on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ... keep existing code