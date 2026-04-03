const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    issueType: {
      type: String,
      enum: ['Complaint', 'Suggestion', 'Inquiry', 'Technical Issue'],
      required: true,
    },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'resolved'], default: 'unread' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);