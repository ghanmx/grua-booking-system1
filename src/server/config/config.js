require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.VITE_SUPABASE_PROJECT_URL,
  supabaseKey: process.env.VITE_SUPABASE_API_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};