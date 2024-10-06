import { supabase } from '../config/supabase.config';

export const runDiagnostics = async () => {
  const diagnosticResults = {
    databaseConnection: false,
    tables: {
      users: { exists: false, count: 0 },
      profiles: { exists: false, count: 0 },
      services: { exists: false, count: 0 },
      bookings: { exists: false, count: 0 },
    },
    relationships: {
      bookings_users: false,
      bookings_services: false,
      profiles_users: false,
    },
    paymentIntegration: false
  };

  try {
    // Test database connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
    diagnosticResults.databaseConnection = !error;

    if (diagnosticResults.databaseConnection) {
      // Check tables
      for (const table of ['users', 'profiles', 'services', 'bookings']) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        diagnosticResults.tables[table].exists = !error;
        diagnosticResults.tables[table].count = count || 0;
      }

      // Check relationships
      const { data: bookingUserData, error: bookingUserError } = await supabase
        .from('bookings')
        .select('id, user_id')
        .limit(1);
      diagnosticResults.relationships.bookings_users = !bookingUserError && bookingUserData && bookingUserData.length > 0;

      const { data: bookingServiceData, error: bookingServiceError } = await supabase
        .from('bookings')
        .select('id, service_id')
        .limit(1);
      diagnosticResults.relationships.bookings_services = !bookingServiceError && bookingServiceData && bookingServiceData.length > 0;

      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profiles')
        .select('id, user_id')
        .limit(1);
      diagnosticResults.relationships.profiles_users = !profileUserError && profileUserData && profileUserData.length > 0;
    }

    // Check payment integration (this is a mock check, replace with actual integration test if available)
    diagnosticResults.paymentIntegration = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  } catch (error) {
    console.error('Diagnostic error:', error);
  }

  return diagnosticResults;
};