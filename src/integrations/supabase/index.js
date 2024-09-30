import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabaseUrl, supabaseKey } from '../../config/supabase.config';

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

export const useTOW = () => useQuery({
    queryKey: ['TOW'],
    queryFn: () => fromSupabase(supabase.from('TOW').select('*')),
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