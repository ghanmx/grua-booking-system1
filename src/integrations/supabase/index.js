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

// Hooks for Users table

export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('users').select('*')),
});

export const useUser = (id) => useQuery({
    queryKey: ['users', id],
    queryFn: () => fromSupabase(supabase.from('users').select('*').eq('id', id).single()),
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedUser) => fromSupabase(supabase.from('users').update(updatedUser).eq('id', updatedUser.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('users').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

// Hooks for Service Types table

export const useServiceTypes = () => useQuery({
    queryKey: ['service_types'],
    queryFn: () => fromSupabase(supabase.from('service_types').select('*')),
});

export const useServiceType = (id) => useQuery({
    queryKey: ['service_types', id],
    queryFn: () => fromSupabase(supabase.from('service_types').select('*').eq('id', id).single()),
});

export const useAddServiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newServiceType) => fromSupabase(supabase.from('service_types').insert([newServiceType])),
        onSuccess: () => {
            queryClient.invalidateQueries('service_types');
        },
    });
};

export const useUpdateServiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedServiceType) => fromSupabase(supabase.from('service_types').update(updatedServiceType).eq('id', updatedServiceType.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('service_types');
        },
    });
};

export const useDeleteServiceType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('service_types').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('service_types');
        },
    });
};

// Hooks for Locations table

export const useLocations = () => useQuery({
    queryKey: ['locations'],
    queryFn: () => fromSupabase(supabase.from('locations').select('*')),
});

export const useLocation = (id) => useQuery({
    queryKey: ['locations', id],
    queryFn: () => fromSupabase(supabase.from('locations').select('*').eq('id', id).single()),
});

export const useAddLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newLocation) => fromSupabase(supabase.from('locations').insert([newLocation])),
        onSuccess: () => {
            queryClient.invalidateQueries('locations');
        },
    });
};

export const useUpdateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedLocation) => fromSupabase(supabase.from('locations').update(updatedLocation).eq('id', updatedLocation.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('locations');
        },
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('locations').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('locations');
        },
    });
};

// Hooks for Booking Status table

export const useBookingStatuses = () => useQuery({
    queryKey: ['booking_status'],
    queryFn: () => fromSupabase(supabase.from('booking_status').select('*')),
});

export const useBookingStatus = (id) => useQuery({
    queryKey: ['booking_status', id],
    queryFn: () => fromSupabase(supabase.from('booking_status').select('*').eq('id', id).single()),
});

export const useAddBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBookingStatus) => fromSupabase(supabase.from('booking_status').insert([newBookingStatus])),
        onSuccess: () => {
            queryClient.invalidateQueries('booking_status');
        },
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedBookingStatus) => fromSupabase(supabase.from('booking_status').update(updatedBookingStatus).eq('id', updatedBookingStatus.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('booking_status');
        },
    });
};

export const useDeleteBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('booking_status').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('booking_status');
        },
    });
};

// Hooks for Bookings table

export const useBookings = () => useQuery({
    queryKey: ['bookings'],
    queryFn: () => fromSupabase(supabase.from('bookings').select('*')),
});

export const useBooking = (id) => useQuery({
    queryKey: ['bookings', id],
    queryFn: () => fromSupabase(supabase.from('bookings').select('*').eq('id', id).single()),
});

export const useAddBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newBooking) => fromSupabase(supabase.from('bookings').insert([newBooking])),
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedBooking) => fromSupabase(supabase.from('bookings').update(updatedBooking).eq('id', updatedBooking.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('bookings').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};

// Hooks for Booking Details View

export const useBookingDetails = () => useQuery({
    queryKey: ['booking_details_view'],
    queryFn: () => fromSupabase(supabase.from('booking_details_view').select('*')),
});