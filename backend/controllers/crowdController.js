const VisitTracking = require('../models/VisitTracking');

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

const checkIn = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to check in',
      });
    }

    const visit = await VisitTracking.create({
      userName,
      checkInTime: new Date(),
      status: 'inside',
    });

    const io = req.app.get('io');
    if (io) await emitCrowdUpdate(io);

    res.status(201).json({
      success: true,
      message: `${userName} checked in successfully`,
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
  checkIn,
  checkOut,
  getLiveCrowd,
  getAttendanceHistory,
  getHourlyStats,
};