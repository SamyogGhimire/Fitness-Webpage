const ContactMessage = require('../models/ContactMessage');

const submitContact = async (req, res) => {
  try {
    const { fullName, email, subject, issueType, message } = req.body;

    if (!fullName || !email || !subject || !issueType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    const contact = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Message submitted! We will get back to you within 24 hours.',
      data: contact,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  try {

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['unread', 'read', 'resolved'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: message,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getAllMessages,
  updateMessageStatus,
};