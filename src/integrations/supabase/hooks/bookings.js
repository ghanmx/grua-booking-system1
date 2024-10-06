import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### bookings

| name              | type                     | format    | required |
|-------------------|--------------------------|-----------|----------|
| id                | uuid                     | string    | true     |
| user_id           | uuid                     | string    | true     |
| service_id        | uuid                     | string    | true     |
| status            | public.booking_status    | string    | true     |
| payment_status    | public.payment_status    | string    | true     |
| pickup_location   | text                     | string    | true     |
| dropoff_location  | text                     | string    | true     |
| vehicle_details   | jsonb                    | object    | true     |
| distance          | numeric                  | number    | true     |
| total_cost        | numeric                  | number    | true     |
| pickup_datetime   | timestamp with time zone | string    | true     |
| additional_details| text                     | string    | false    |
| created_at        | timestamp with time zone | string    | true     |
| updated_at        | timestamp with time zone | string    | true     |

Foreign Key Relationships:
- user_id references users.id
- service_id references services.id
*/

export const useBooking = (id) => useQuery({
    queryKey: ['bookings', id],
    queryFn: () => fromSupabase(supabase.from('bookings').select('*').eq('id', id).single()),
});

export const useBookings = () => useQuery({
    queryKey: ['bookings'],
    queryFn: () => fromSupabase(supabase.from('bookings').select('*')),
});

export const useAddBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBooking) => fromSupabase(supabase.from('bookings').insert([newBooking])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('bookings').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('bookings').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};