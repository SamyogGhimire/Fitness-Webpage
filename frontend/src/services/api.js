import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getPlans = () => API.get('/plans');
export const bookMembership = (data) => API.post('/bookings', data);
export const getBookingByToken = (token) => API.get(`/bookings/qr/${token}`);
export const getTrainers = () => API.get('/trainers');
export const bookTrainer = (data) => API.post('/trainer-bookings', data);
export const getLiveCrowd = () => API.get('/crowd/live');
export const getHourlyStats = () => API.get('/crowd/hourly');
export const checkIn = (userName) => API.post('/crowd/checkin', { userName });
export const checkOut = (visitId) => API.post('/crowd/checkout', { visitId });
export const scanQR = (qrToken, mode) => API.post('/crowd/scan', { qrToken, mode });
export const createPaymentOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);
export const getPaymentStatus = (bookingId) => API.get(`/payments/status/${bookingId}`);
export const submitContact = (data) => API.post('/contact', data);

export default API;