const express = require('express');
const router = express.Router();

const {
  scanQR,             
  checkIn,
  checkOut,
  getLiveCrowd,
  getAttendanceHistory,
  getHourlyStats,
} = require('../controllers/crowdController');

router.get('/live', getLiveCrowd);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/history', getAttendanceHistory);
router.get('/hourly', getHourlyStats);
router.post('/scan', scanQR);                  

module.exports = router;