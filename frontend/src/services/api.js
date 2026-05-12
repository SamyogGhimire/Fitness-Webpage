import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const getMyBookings = () => API.get('/auth/my-bookings');

// Plans
export const getPlans = () => API.get('/plans');
export const bookMembership = (data) => API.post('/bookings', data);
export const getBookingByToken = (token) => API.get(`/bookings/qr/${token}`);

// Trainers
export const getTrainers = () => API.get('/trainers');
export const bookTrainer = (data) => API.post('/trainer-bookings', data);

// Crowd
export const getLiveCrowd = () => API.get('/crowd/live');
export const getHourlyStats = () => API.get('/crowd/hourly');
export const checkIn = (userName) => API.post('/crowd/checkin', { userName });
export const checkOut = (visitId) => API.post('/crowd/checkout', { visitId });
export const scanQR = (qrToken, mode) => API.post('/crowd/scan', { qrToken, mode });

// Payments
export const createPaymentOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);
export const getPaymentStatus = (bookingId) => API.get(`/payments/status/${bookingId}`);

// Contact
export const submitContact = (data) => API.post('/contact', data);

export default API;