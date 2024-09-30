const { body, validationResult } = require('express-validator');

const validateBookingInput = [
  body('userName').notEmpty().withMessage('User name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
  body('dropOffAddress').notEmpty().withMessage('Drop off address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateBookingInput };