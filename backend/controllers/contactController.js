const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, data: msg, message: 'Message submitted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};