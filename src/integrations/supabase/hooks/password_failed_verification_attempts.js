import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### password_failed_verification_attempts

| name           | type                     | format | required |
|----------------|--------------------------|--------|----------|
| user_id        | uuid                     | string | true     |
| last_failed_at | timestamp with time zone | string | true     |

Note: user_id is the Primary Key.
*/

export const usePasswordFailedVerificationAttempt = (userId) => useQuery({
    queryKey: ['password_failed_verification_attempts', userId],
    queryFn: () => fromSupabase(supabase.from('password_failed_verification_attempts').select('*').eq('user_id', userId).single()),
});

export const usePasswordFailedVerificationAttempts = () => useQuery({
    queryKey: ['password_failed_verification_attempts'],
    queryFn: () => fromSupabase(supabase.from('password_failed_verification_attempts').select('*')),
});

export const useAddPasswordFailedVerificationAttempt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAttempt) => fromSupabase(supabase.from('password_failed_verification_attempts').insert([newAttempt])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['password_failed_verification_attempts'] });
        },
    });
};

export const useUpdatePasswordFailedVerificationAttempt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ user_id, ...updateData }) => fromSupabase(supabase.from('password_failed_verification_attempts').update(updateData).eq('user_id', user_id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['password_failed_verification_attempts'] });
        },
    });
};

export const useDeletePasswordFailedVerificationAttempt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user_id) => fromSupabase(supabase.from('password_failed_verification_attempts').delete().eq('user_id', user_id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['password_failed_verification_attempts'] });
        },
    });
};