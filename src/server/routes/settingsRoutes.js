const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/smtp', settingsController.getSMTPSettings);
router.post('/smtp', settingsController.updateSMTPSettings);

module.exports = router;