const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes 
app.use('/api/plans',            require('./routes/plan'));
app.use('/api/bookings',         require('./routes/bookings'));
app.use('/api/trainers',         require('./routes/trainers'));
app.use('/api/trainer-bookings', require('./routes/trainerBookings'));
app.use('/api/crowd',            require('./routes/crowd'));
app.use('/api/contact',          require('./routes/contact'));
app.use('/api/payments',         require('./routes/payments')); 
app.use('/api/auth', require('./routes/auth'));

// Health Check 
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Gym API is running!' });
});

// 404 Handler 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.IO 
io.on('connection', (socket) => {
  console.log(' Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});