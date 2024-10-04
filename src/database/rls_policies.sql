-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create the new policy
CREATE POLICY "Users can insert own data when authenticated and paid" ON public.users
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE bookings.user_id = auth.uid() AND bookings.payment_status = 'paid'
  )
);