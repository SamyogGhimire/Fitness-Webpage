import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

//  Membership Plans 
export const getPlans = () => API.get('/plans');
export const bookMembership = (data) => API.post('/bookings', data);
export const getBookingByToken = (token) =>
  API.get(`/bookings/qr/${token}`);

//  Trainers 
export const getTrainers = () => API.get('/trainers');
export const bookTrainer = (data) => API.post('/trainer-bookings', data);

// Live Crowd 
export const getLiveCrowd = () => API.get('/crowd/live');
export const getHourlyStats = () => API.get('/crowd/hourly');
export const checkIn = (userName) =>
  API.post('/crowd/checkin', { userName });
export const checkOut = (visitId) =>
  API.post('/crowd/checkout', { visitId });
export const scanQR = (qrToken, mode) =>
  API.post('/crowd/scan', { qrToken, mode });

//  Payments 
export const createPaymentOrder = (data) =>
  API.post('/payments/create-order', data);          // ← NEW

export const verifyPayment = (data) =>
  API.post('/payments/verify', data);                // ← NEW

export const getPaymentStatus = (bookingId) =>
  API.get(`/payments/status/${bookingId}`);          // ← NEW

//  Contact 
export const submitContact = (data) => API.post('/contact', data);

export default API;