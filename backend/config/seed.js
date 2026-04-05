const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const MembershipPlan = require('../models/MembershipPlan');
const Trainer = require('../models/Trainer');

const plans = [
  {
    name: 'Day Pass',
    duration: '1 Day',
    price: 299,
    description: 'Perfect for a one-time gym experience or trying us out.',
    benefits: [
      'Full gym access',
      'Locker room',
      'Free WiFi',
      'Water station',
    ],
    badge: '',
  },
  {
    name: 'Monthly Membership',
    duration: '1 Month',
    price: 1999,
    description: 'Ideal for building a consistent fitness routine.',
    benefits: [
      'Unlimited gym access',
      'Group classes',
      'Locker room',
      'Nutrition guide',
      'Free WiFi',
    ],
    badge: 'Popular',
  },
  {
    name: 'Yearly Membership',
    duration: '1 Year',
    price: 14999,
    description: 'Best value for serious athletes committed to their goals.',
    benefits: [
      'Unlimited gym access',
      'All group classes',
      'Personal trainer session (2/month)',
      'Locker & towel service',
      'Diet consultation',
      'Priority booking',
      'Guest passes (2)',
    ],
    badge: 'Best Value',
  },
];


const trainers = [
  {
    name: 'Rahul Sharma',
    specialization: 'Strength & Powerlifting',
    experience: 8,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.9,
    availableModes: ['At Gym', 'Video Call'],
    bio: 'National-level powerlifter with 8 years of coaching experience.',
    clients: 120,
  },
  {
    name: 'Priya Nair',
    specialization: 'Yoga & Flexibility',
    experience: 6,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    availableModes: ['At Gym', 'Personal Training', 'Video Call'],
    bio: 'Certified yoga instructor and flexibility coach.',
    clients: 95,
  },
  {
    name: 'Arjun Mehta',
    specialization: 'Weight Loss & Cardio',
    experience: 5,
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    rating: 4.7,
    availableModes: ['At Gym', 'Personal Training', 'Video Call'],
    bio: 'Certified nutrition and cardio specialist.',
    clients: 200,
  },
  {
    name: 'Sneha Kapoor',
    specialization: 'Bodybuilding & Aesthetics',
    experience: 7,
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.9,
    availableModes: ['At Gym', 'Video Call'],
    bio: 'IFBB-certified bodybuilding coach.',
    clients: 80,
  },
  {
    name: 'Vikram Rao',
    specialization: 'Functional Training & HIIT',
    experience: 4,
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    rating: 4.6,
    availableModes: ['At Gym', 'Personal Training'],
    bio: 'CrossFit Level 2 coach.',
    clients: 65,
  },
  {
    name: 'Meera Iyer',
    specialization: 'Zumba & Dance Fitness',
    experience: 5,
    image: 'https://randomuser.me/api/portraits/women/90.jpg',
    rating: 4.8,
    availableModes: ['At Gym', 'Video Call'],
    bio: 'Licensed Zumba instructor.',
    clients: 150,
  },
];


const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await MembershipPlan.deleteMany({});
    await Trainer.deleteMany({});
    console.log('Cleared existing data');

    // Insert fresh data
    await MembershipPlan.insertMany(plans);
    console.log(`Seeded ${plans.length} membership plans`);

    await Trainer.insertMany(trainers);
    console.log(`Seeded ${trainers.length} trainers`);

    console.log('');
    console.log('Database seeded successfully!');
    console.log('');
    console.log('You can now test these endpoints:');
    console.log('→ http://localhost:5000/api/plans');
    console.log('→ http://localhost:5000/api/trainers');

    await mongoose.disconnect();
    console.log('');
    console.log('MongoDB disconnected');
    process.exit(0);

  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();