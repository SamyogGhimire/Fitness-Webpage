const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

console.log('Payment controller:', paymentController);

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/status/:bookingId', paymentController.getPaymentStatus);

module.exports = router;