const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBookingInput } = require('../middleware/inputValidation');

router.post('/create', validateBookingInput, bookingController.createBooking);
router.get('/all', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', validateBookingInput, bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;