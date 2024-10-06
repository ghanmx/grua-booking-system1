import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### services

| name            | type                     | format    | required |
|-----------------|--------------------------|-----------|----------|
| id              | uuid                     | string    | true     |
| name            | text                     | string    | true     |
| description     | text                     | string    | false    |
| base_price      | numeric                  | number    | true     |
| price_per_km    | numeric                  | number    | true     |
| maneuver_charge | numeric                  | number    | true     |
| tow_truck_type  | public.tow_truck_type    | string    | true     |
| created_at      | timestamp with time zone | string    | true     |
| updated_at      | timestamp with time zone | string    | true     |
*/

export const useService = (id) => useQuery({
    queryKey: ['services', id],
    queryFn: () => fromSupabase(supabase.from('services').select('*').eq('id', id).single()),
});

export const useServices = () => useQuery({
    queryKey: ['services'],
    queryFn: () => fromSupabase(supabase.from('services').select('*')),
});

export const useAddService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newService) => fromSupabase(supabase.from('services').insert([newService])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('services').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('services').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};