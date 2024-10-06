// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth.jsx';
import { SupabaseProvider } from './index.jsx';

// Import hooks
import {
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile
} from './hooks/profiles';

import {
  useService,
  useServices,
  useAddService,
  useUpdateService,
  useDeleteService
} from './hooks/services';

import {
  useBooking,
  useBookings,
  useAddBooking,
  useUpdateBooking,
  useDeleteBooking
} from './hooks/bookings';

import {
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser
} from './hooks/users';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseProvider,
  SupabaseAuthProvider,
  useSupabaseAuth,
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile,
  useService,
  useServices,
  useAddService,
  useUpdateService,
  useDeleteService,
  useBooking,
  useBookings,
  useAddBooking,
  useUpdateBooking,
  useDeleteBooking,
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser
};