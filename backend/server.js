const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

//DB connection
const connectDB = require('./config/db');
connectDB();

const app = express();
const httpServer = http.createServer(app);

//Setup socket.io
const io = new Server (httpServer, {
  cors: {
    origin: process.env.Frontend_URL,
    methods: ['GET', 'POST'],
  },
});

//io available to all controllers
app.set('io',io);

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


//Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});