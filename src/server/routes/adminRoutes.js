const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/create', adminController.createAdmin);
router.get('/services', adminController.getPaidServices);
router.put('/services/:id', adminController.updateService);

module.exports = router;