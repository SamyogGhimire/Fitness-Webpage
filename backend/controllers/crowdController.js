const VisitTracking = require('../models/VisitTracking');
const MembershipBooking = require('../models/MembershipBooking');

const getCrowdStatus = (count) => {
  if (count > 30) return 'Busy';
  if (count > 15) return 'Moderate Crowd';
  return 'Low Crowd';
};


const emitCrowdUpdate = async (io) => {
  const count = await VisitTracking.countDocuments({
    status: 'inside',
  });
  io.emit('crowdUpdate', {
    count,
    status: getCrowdStatus(count),
    timestamp: new Date(),
  });
};

const scanQR = async (req, res) => {
  try {
    const { qrToken, mode } = req.body;


    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: 'QR token is required',
      });
    }

    if (!mode || !['checkin', 'checkout'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Mode must be checkin or checkout',
      });
    }

    // Find booking using qrToken
    const booking = await MembershipBooking.findOne({ qrToken });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code — no booking found',
      });
    }

    const io = req.app.get('io');

    if (mode === 'checkin') {
      // Check if already inside
      const alreadyInside = await VisitTracking.findOne({
        qrToken,
        status: 'inside',
      });

      if (alreadyInside) {
        return res.status(400).json({
          success: false,
          message: `${booking.fullName} is already inside the gym`,
          data: {
            fullName: booking.fullName,
            selectedPlan: booking.selectedPlan,
            status: 'already_inside',
          },
        });
      }

      const visit = await VisitTracking.create({
        userName: booking.fullName,
        qrToken: qrToken,
        bookingId: booking.bookingId,
        checkInTime: new Date(),
        status: 'inside',
      });

      // Emit real-time update
      if (io) await emitCrowdUpdate(io);

      return res.status(201).json({
        success: true,
        message: `✅ Welcome, ${booking.fullName}!`,
        data: {
          fullName: booking.fullName,
          selectedPlan: booking.selectedPlan,
          bookingId: booking.bookingId,
          checkInTime: visit.checkInTime,
          status: 'checked_in',
          visitId: visit._id,
        },
      });
    }

    // ─── CHECK OUT ───────────────────────────
    if (mode === 'checkout') {
      // Find their active visit
      const activeVisit = await VisitTracking.findOne({
        qrToken,
        status: 'inside',
      });

      if (!activeVisit) {
        return res.status(400).json({
          success: false,
          message: `${booking.fullName} has not checked in yet`,
          data: {
            fullName: booking.fullName,
            status: 'not_inside',
          },
        });
      }

      // Update visit to checked out
      activeVisit.checkOutTime = new Date();
      activeVisit.status = 'left';
      await activeVisit.save();

      // Emit real-time update
      if (io) await emitCrowdUpdate(io);

      // Calculate time spent
      const timeSpent = Math.round(
        (activeVisit.checkOutTime - activeVisit.checkInTime) / 60000
      );

      return res.status(200).json({
        success: true,
        message: `👋 Goodbye, ${booking.fullName}!`,
        data: {
          fullName: booking.fullName,
          selectedPlan: booking.selectedPlan,
          checkInTime: activeVisit.checkInTime,
          checkOutTime: activeVisit.checkOutTime,
          timeSpentMinutes: timeSpent,
          status: 'checked_out',
        },
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkIn = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to check in',
      });
    }

   const booking = await MembershipBooking.findOne({
      fullName: { $regex: new RegExp(`^${userName}$`, 'i') },
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: `No membership found for "${userName}". Please book a membership first or use your QR code.`,
      });
    }

    // Check if already inside
    const alreadyInside = await VisitTracking.findOne({
      bookingId: booking.bookingId,
      status: 'inside',
    });

    if (alreadyInside) {
      return res.status(400).json({
        success: false,
        message: `${booking.fullName} is already inside the gym`,
      });
    }
  

    const visit = await VisitTracking.create({
      userName: booking.fullName,
      qrToken: booking.qrToken,
      bookingId: booking.bookingId,
      checkInTime: new Date(),
      status: 'inside',
    });

    const io = req.app.get('io');
    if (io) await emitCrowdUpdate(io);

    res.status(201).json({
      success: true,
      message: `${booking.fullName} checked in successfully`,
      data: visit,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const { visitId } = req.body;

    if (!visitId) {
      return res.status(400).json({
        success: false,
        message: 'Visit ID is required to check out',
      });
    }

    const visit = await VisitTracking.findByIdAndUpdate(
      visitId,
      {
        checkOutTime: new Date(),
        status: 'left',
      },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit record not found',
      });
    }

    const io = req.app.get('io');
    if (io) await emitCrowdUpdate(io);

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: visit,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLiveCrowd = async (req, res) => {
  try {
    const count = await VisitTracking.countDocuments({
      status: 'inside',
    });

    const recentVisits = await VisitTracking.find({ status: 'inside' })
      .sort({ checkInTime: -1 })
      .limit(10)
      .select('userName checkInTime');

    const capacity = 50;
    const occupancyPercent = Math.min(
      Math.round((count / capacity) * 100),
      100
    );

    res.status(200).json({
      success: true,
      data: {
        count,
        status: getCrowdStatus(count),
        recentVisits,
        capacity,
        occupancyPercent,
        lastUpdated: new Date(),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
    const history = await VisitTracking.find()
      .sort({ checkInTime: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHourlyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await VisitTracking.find({
      checkInTime: { $gte: today },
    });

    const hourlyMap = {};
    for (let h = 6; h <= 22; h++) {
      hourlyMap[h] = 0;
    }

    visits.forEach((visit) => {
      const hour = new Date(visit.checkInTime).getHours();
      if (hourlyMap[hour] !== undefined) {
        hourlyMap[hour]++;
      }
    });

    const hourlyData = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour: parseInt(hour),
      label: `${hour}:00`,
      count,
    }));

    res.status(200).json({
      success: true,
      data: hourlyData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  scanQR,           
  checkIn,
  checkOut,
  getLiveCrowd,
  getAttendanceHistory,
  getHourlyStats,
};