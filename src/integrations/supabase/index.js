import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = 'https://gjwhxrajesykwmomorhw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqd2h4cmFqZXN5a3dtb21vcmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4NTYzOTIsImV4cCI6MjAzNDQzMjM5Mn0.fDk88E2zfp64VhiEYL7KCh7KSEF1mNioaII7IaRwRgQ';
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### TOW

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| created_at | timestamptz | string | true     |

*/

// Hooks for TOW table

export const useTOWs = () => useQuery({
    queryKey: ['TOW'],
    queryFn: () => fromSupabase(supabase.from('TOW').select('*')),
});

export const useTOW = (id) => useQuery({
    queryKey: ['TOW', id],
    queryFn: () => fromSupabase(supabase.from('TOW').select('*').eq('id', id).single()),
});

export const useAddTOW = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTOW) => fromSupabase(supabase.from('TOW').insert([newTOW])),
        onSuccess: () => {
            queryClient.invalidateQueries('TOW');
        },
    });
};

export const useUpdateTOW = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTOW) => fromSupabase(supabase.from('TOW').update(updatedTOW).eq('id', updatedTOW.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('TOW');
        },
    });
};

export const useDeleteTOW = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('TOW').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('TOW');
        },
    });
};