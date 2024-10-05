const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const stripe = require('stripe')(config.stripeSecretKey);
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

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

app.use(errorHandler);

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));