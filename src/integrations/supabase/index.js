import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth.jsx';
import { SupabaseProvider, useSupabase } from './SupabaseProvider.jsx';

// Import hooks
import {
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile,
} from './hooks/profiles';

import {
  useService,
  useServices,
  useAddService,
  useUpdateService,
  useDeleteService,
} from './hooks/services';

import {
  useBooking,
  useBookings,
  useAddBooking,
  useUpdateBooking,
  useDeleteBooking,
} from './hooks/bookings';

import {
  useSmtpSetting,
  useSmtpSettings,
  useAddSmtpSetting,
  useUpdateSmtpSetting,
  useDeleteSmtpSetting,
} from './hooks/smtp_settings';

import {
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from './hooks/users';

export {
  supabase,
  SupabaseProvider,
  SupabaseAuthProvider,
  useSupabaseAuth,
  useSupabase,
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
  useSmtpSetting,
  useSmtpSettings,
  useAddSmtpSetting,
  useUpdateSmtpSetting,
  useDeleteSmtpSetting,
  useUser,
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
};
