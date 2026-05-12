const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createAdmin = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI ? 'URI found' : 'URI NOT FOUND');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const ADMIN_EMAIL = 'admin@fitnesshub.in';
    const ADMIN_PASSWORD = 'fitnesshub2026';

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = await User.create({
      fullName: 'FitnessHub Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('Admin created successfully');
    console.log('Email   :', admin.email);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Role    :', admin.role);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();