const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/esewa-config', paymentController.getEsewaConfig);
router.post('/verify-esewa', paymentController.verifyEsewaPay);

module.exports = router;
