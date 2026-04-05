const Trainer = require('../models/Trainer');

const getTrainers = async (req, res) => {
  try {

    const filter = { isActive: true };

    if (req.query.specialization) {

      filter.specialization = {
        $regex: req.query.specialization,
        $options: 'i',
      };
    }

    const trainers = await Trainer.find(filter)
      .sort({ rating: -1 }); 

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trainer,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Trainer added successfully',
      data: trainer,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully',
      data: trainer,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer deactivated successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};