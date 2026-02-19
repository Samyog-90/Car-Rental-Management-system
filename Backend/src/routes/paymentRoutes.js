const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/esewa-config', paymentController.getEsewaConfig);
router.post('/mock-card-pay', paymentController.mockCardPay);

module.exports = router;
