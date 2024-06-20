import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
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

// Example hook for models

export const useFoo = ()=> useQuery({
    queryKey: ['foos'],
    queryFn: fromSupabase(supabase.from('foos')),
})
export const useAddFoo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFoo)=> fromSupabase(supabase.from('foos').insert([{ title: newFoo.title }])),
        onSuccess: ()=> {
            queryClient.invalidateQueries('foos');
        },
    });
};

export const useBar = ()=> useQuery({
    queryKey: ['bars'],
    queryFn: fromSupabase(supabase.from('bars')),
})
export const useAddBar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBar)=> fromSupabase(supabase.from('bars').insert([{ foo_id: newBar.foo_id }])),
        onSuccess: ()=> {
            queryClient.invalidateQueries('bars');
        },
    });
};

export const useTOWs = () => useQuery({
    queryKey: ['TOWs'],
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
            queryClient.invalidateQueries('TOWs');
        },
    });
};

export const useUpdateTOW = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedTOW) => fromSupabase(supabase.from('TOW').update(updatedTOW).eq('id', updatedTOW.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('TOWs');
            queryClient.invalidateQueries(['TOW', updatedTOW.id]);
        },
    });
};

export const useDeleteTOW = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('TOW').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('TOWs');
        },
    });
};