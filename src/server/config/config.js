require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.VITE_SUPABASE_PROJECT_URL,
  supabaseKey: process.env.VITE_SUPABASE_API_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  tollguruApiKey: process.env.VITE_TOLLGURU_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
};

export default config;