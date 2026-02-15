const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/esewa-config', paymentController.getEsewaConfig);

module.exports = router;
