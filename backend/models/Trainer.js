const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // years
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    availableModes: [{ type: String, enum: ['At Gym', 'Personal Training', 'Video Call'] }],
    bio: { type: String },
    clients: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', TrainerSchema);