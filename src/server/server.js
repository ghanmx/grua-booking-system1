const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createBooking } = require('./controllers/bookingController');
const { createAdminUser, getPaidServices, updateService } = require('./controllers/adminController');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/bookings', createBooking);
app.post('/api/admin/create', createAdminUser);
app.get('/api/admin/paid-services', getPaidServices);
app.put('/api/admin/services/:id', updateService);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
