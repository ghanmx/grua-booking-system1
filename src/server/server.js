const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const stripe = require('stripe')(config.stripeSecretKey);
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { login, createAccount, authLimiter } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/process-payment', async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/signup', authLimiter, async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const result = await createAccount(email, password, userData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.use(errorHandler);

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for testing purposes
