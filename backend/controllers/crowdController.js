const VisitTracking = require('../models/VisitTracking');

const emitCrowdUpdate = async (io) => {
  const count = await VisitTracking.countDocuments({ status: 'inside' });
  io.emit('crowdUpdate', { count, timestamp: new Date() });
};

exports.checkIn = async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) return res.status(400).json({ success: false, message: 'userName is required' });

    const visit = await VisitTracking.create({ userName, checkInTime: new Date(), status: 'inside' });
    const io = req.app.get('io');
    await emitCrowdUpdate(io);

    res.status(201).json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { visitId } = req.body;
    const visit = await VisitTracking.findByIdAndUpdate(
      visitId,
      { checkOutTime: new Date(), status: 'left' },
      { new: true }
    );
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });

    const io = req.app.get('io');
    await emitCrowdUpdate(io);

    res.json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLiveCrowd = async (req, res) => {
  try {
    const count = await VisitTracking.countDocuments({ status: 'inside' });
    const recentVisits = await VisitTracking.find({ status: 'inside' })
      .sort({ checkInTime: -1 })
      .limit(10)
      .select('userName checkInTime');

    let status = 'Low Crowd';
    if (count > 30) status = 'Busy';
    else if (count > 15) status = 'Moderate Crowd';

    res.json({
      success: true,
      data: {
        count,
        status,
        recentVisits,
        lastUpdated: new Date(),
        capacity: 50,
        occupancyPercent: Math.min(Math.round((count / 50) * 100), 100),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const history = await VisitTracking.find().sort({ checkInTime: -1 }).limit(50);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHourlyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await VisitTracking.find({ checkInTime: { $gte: today } });

    const hourlyMap = {};
    for (let h = 6; h <= 22; h++) {
      hourlyMap[h] = 0;
    }

    visits.forEach((v) => {
      const hour = new Date(v.checkInTime).getHours();
      if (hourlyMap[hour] !== undefined) hourlyMap[hour]++;
    });

    const hourlyData = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour: parseInt(hour),
      label: `${hour}:00`,
      count,
    }));

    res.json({ success: true, data: hourlyData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};