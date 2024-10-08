import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### smtp_settings

| name           | type                     | format  | required |
|----------------|--------------------------|---------|----------|
| id             | uuid                     | string  | true     |
| user_id        | uuid                     | string  | false    |
| is_custom_smtp | boolean                  | boolean | true     |
| smtp_host      | text                     | string  | false    |
| smtp_port      | integer                  | number  | false    |
| smtp_user      | text                     | string  | false    |
| smtp_password  | text                     | string  | false    |
| from_email     | text                     | string  | false    |
| from_name      | text                     | string  | false    |
| created_at     | timestamp with time zone | string  | true     |
| updated_at     | timestamp with time zone | string  | true     |

Foreign Key Relationships:
- user_id references users.id
*/

export const useSmtpSetting = (id) => useQuery({
    queryKey: ['smtp_settings', id],
    queryFn: () => fromSupabase(supabase.from('smtp_settings').select('*').eq('id', id).single()),
});

export const useSmtpSettings = () => useQuery({
    queryKey: ['smtp_settings'],
    queryFn: () => fromSupabase(supabase.from('smtp_settings').select('*')),
});

export const useAddSmtpSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSmtpSetting) => fromSupabase(supabase.from('smtp_settings').insert([newSmtpSetting])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['smtp_settings'] });
        },
    });
};

export const useUpdateSmtpSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('smtp_settings').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['smtp_settings'] });
        },
    });
};

export const useDeleteSmtpSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('smtp_settings').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['smtp_settings'] });
        },
    });
};