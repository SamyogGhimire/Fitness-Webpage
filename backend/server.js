const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/plans', require('./routes/plans'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/trainer-bookings', require('./routes/trainerBookings'));
app.use('/api/crowd', require('./routes/crowd'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Gym API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { app, io };