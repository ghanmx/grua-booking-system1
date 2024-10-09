// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useProfile, useProfiles, useAddProfile, useUpdateProfile, useDeleteProfile } from './hooks/profiles';
import { useService, useServices, useAddService, useUpdateService, useDeleteService } from './hooks/services';
import { useBooking, useBookings, useAddBooking, useUpdateBooking, useDeleteBooking } from './hooks/bookings';
import { useSmtpSetting, useSmtpSettings, useAddSmtpSetting, useUpdateSmtpSetting, useDeleteSmtpSetting } from './hooks/smtp_settings';
import { useUser, useUsers, useAddUser, useUpdateUser, useDeleteUser } from './hooks/users';
import {
  usePasswordFailedVerificationAttempt,
  usePasswordFailedVerificationAttempts,
  useAddPasswordFailedVerificationAttempt,
  useUpdatePasswordFailedVerificationAttempt,
  useDeletePasswordFailedVerificationAttempt
} from './hooks/password_failed_verification_attempts';
import { SupabaseProvider } from './SupabaseProvider.jsx'; // Add this line

// Export all the imported functions and objects
export {
  supabase,
  SupabaseProvider, // Add this line
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
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
  usePasswordFailedVerificationAttempt,
  usePasswordFailedVerificationAttempts,
  useAddPasswordFailedVerificationAttempt,
  useUpdatePasswordFailedVerificationAttempt,
  useDeletePasswordFailedVerificationAttempt
};