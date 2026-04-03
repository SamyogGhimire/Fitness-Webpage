const MembershipPlan = require('../models/MembershipPlan');

exports.getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await MembershipPlan.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Plan deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};