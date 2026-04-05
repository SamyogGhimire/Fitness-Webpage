const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    issueType: {
      type: String,
      enum: ['Complaint', 'Suggestion', 'Inquiry', 'Technical Issue'],
      required: [true, 'Issue type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'resolved'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);