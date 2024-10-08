const { body, validationResult } = require('express-validator');

const addressValidation = (fieldName) => 
  body(fieldName)
    .notEmpty().withMessage(`${fieldName} is required`)
    .isLength({ min: 5 }).withMessage(`${fieldName} must be at least 5 characters`);

const validateBookingInput = [
  body('userName').notEmpty().withMessage('User name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phoneNumber').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  addressValidation('pickupAddress'),
  addressValidation('dropOffAddress'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateBookingInput };