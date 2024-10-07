const config = {
  port: import.meta.env.PORT || 5000,
  supabaseUrl: import.meta.env.VITE_SUPABASE_PROJECT_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_API_KEY,
  stripeSecretKey: import.meta.env.STRIPE_SECRET_KEY,
  tollguruApiKey: import.meta.env.VITE_TOLLGURU_API_KEY,
  nodeEnv: import.meta.env.NODE_ENV || 'development',
  jwtSecret: import.meta.env.JWT_SECRET,
};

export default config;