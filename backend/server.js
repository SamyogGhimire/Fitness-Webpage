const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

//Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

//Routes
app.use('/api/plans', require('./routes/plans'));
app.use('/api/bookings',require('./routes/bookings'));
app.use('/api/trainers',require('./routes/trainers'));
app.use('/api/trainer-bookings',require('./routes/trainerBookings'));
app.use('/api/crowd', require('./routes/crowd'));
app.use('/api/contact', require('./routes/contact'));

app.get('/api/health', (req, res) =>{
  res.json({ 
    success: true,
    message: 'Gym API is running',
  timestamp: new Date(),
  });
});

app.use((req,res)=>{
  res.status(404).json({
    success: false,
    message: `Route ${req.originalURL} not found`,
  });
});

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});