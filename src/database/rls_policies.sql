-- Enable RLS on the services table (if not already enabled)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policy to allow all users to read services
CREATE POLICY "Allow read access for all users" ON public.services
    FOR SELECT
    USING (true);

-- Policy to allow only admins to insert new services
CREATE POLICY "Allow insert for admins only" ON public.services
    FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy to allow only admins to update services
CREATE POLICY "Allow update for admins only" ON public.services
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Policy to allow only admins to delete services
CREATE POLICY "Allow delete for admins only" ON public.services
    FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');