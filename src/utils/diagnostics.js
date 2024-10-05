import { supabase } from '../config/supabase.config';

export const runDiagnostics = async () => {
  const diagnosticResults = {
    databaseConnection: false,
    bookingsTable: false,
    usersTable: false,
    servicesTable: false,
    relationships: {
      bookings_users: false,
      bookings_services: false
    },
    paymentIntegration: false
  };

  try {
    // Test database connection
    const { data, error } = await supabase.from('bookings').select('count').single();
    diagnosticResults.databaseConnection = !error;

    // Check bookings table
    const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('id').limit(1);
    diagnosticResults.bookingsTable = !bookingsError && bookingsData;

    // Check users table
    const { data: usersData, error: usersError } = await supabase.from('users').select('id').limit(1);
    diagnosticResults.usersTable = !usersError && usersData;

    // Check services table
    const { data: servicesData, error: servicesError } = await supabase.from('services').select('id').limit(1);
    diagnosticResults.servicesTable = !servicesError && servicesData;

    // Check relationships
    const { data: bookingUserData, error: bookingUserError } = await supabase
      .from('bookings')
      .select('id, user_id (id)')
      .limit(1);
    diagnosticResults.relationships.bookings_users = !bookingUserError && bookingUserData && bookingUserData[0]?.user_id;

    const { data: bookingServiceData, error: bookingServiceError } = await supabase
      .from('bookings')
      .select('id, service_id (id)')
      .limit(1);
    diagnosticResults.relationships.bookings_services = !bookingServiceError && bookingServiceData && bookingServiceData[0]?.service_id;

    // Check payment integration (this is a mock check, replace with actual integration test if available)
    diagnosticResults.paymentIntegration = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  } catch (error) {
    console.error('Diagnostic error:', error);
  }

  return diagnosticResults;
};