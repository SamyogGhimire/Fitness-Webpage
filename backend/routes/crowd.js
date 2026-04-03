const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getLiveCrowd, getAttendanceHistory, getHourlyStats } = require('../controllers/crowdController');

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/live', getLiveCrowd);
router.get('/history', getAttendanceHistory);
router.get('/hourly', getHourlyStats);

module.exports = router;