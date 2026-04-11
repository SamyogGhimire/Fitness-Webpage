import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

//MEMBERSHIP PLANS
export const getPlans = () => API.get('/plans');
export const bookMembership = (data) => API.post('/bookings', data);

//BOOKING BY QR TOKEN
export const getBookingByToken = (token) =>
  API.get(`/bookings/qr/${token}`);                      // ← NEW

//TRAINERS
export const getTrainers = () => API.get('/trainers');
export const bookTrainer = (data) => API.post('/trainer-bookings', data);

//LIVE CROWD
export const getLiveCrowd = () => API.get('/crowd/live');
export const getHourlyStats = () => API.get('/crowd/hourly');
export const checkIn = (userName) =>
  API.post('/crowd/checkin', { userName });
export const checkOut = (visitId) =>
  API.post('/crowd/checkout', { visitId });

//QR SCAN
export const scanQR = (qrToken, mode) =>
  API.post('/crowd/scan', { qrToken, mode });            // ← NEW

//CONTACT
export const submitContact = (data) => API.post('/contact', data);

export default API;