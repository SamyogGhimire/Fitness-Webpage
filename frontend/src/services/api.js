import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Membership Plans ────────────────────────────────────────────────────────
export const getPlans = () => API.get('/plans');
export const bookMembership = (data) => API.post('/bookings', data);

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const getTrainers = () => API.get('/trainers');
export const bookTrainer = (data) => API.post('/trainer-bookings', data);

// ─── Live Crowd ───────────────────────────────────────────────────────────────
export const getLiveCrowd = () => API.get('/crowd/live');
export const getHourlyStats = () => API.get('/crowd/hourly');
export const checkIn = (userName) => API.post('/crowd/checkin', { userName });
export const checkOut = (visitId) => API.post('/crowd/checkout', { visitId });

// ─── Contact ──────────────────────────────────────────────────────────────────
export const submitContact = (data) => API.post('/contact', data);

export default API;