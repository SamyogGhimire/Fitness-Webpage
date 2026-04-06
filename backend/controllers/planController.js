const MembershipPlan = require('../models/MembershipPlan');

const getPlans =async (req,res) => {
  try{
    const plans = await MembershipPlan.find({ isActive: true})
    .sort({ price: 1});

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  
  }catch (error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlanById = async (req,res)=>{
  try{
    const plan = await MembershipPlan.findById(req.params.id);

    if(!plan){
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });

  }catch (error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan deactivated successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePlan = (req, res) => {
  res.send("Updated");
};


module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};