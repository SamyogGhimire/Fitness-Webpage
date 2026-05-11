# FitnessHub Fitness Center

A full-stack gym management website built with React, Node.js, MongoDB, and Socket.IO.

---

## Tech Stack

- Frontend: React.js, Tailwind CSS, Vite
- Backend: Node.js, Express.js
- Database: MongoDB Atlas + Mongoose
- Real-Time: Socket.IO
- Payment: Mock Payment System
- Map: Leaflet.js + OpenStreetMap
- Hosting: Vercel (frontend), Railway (backend)

---

## Live Links

- Website: https://fitness-webpage-nine.vercel.app
- Admin Panel: https://fitness-webpage-nine.vercel.app/admin
- Backend API: https://fitness-webpage-production.up.railway.app/api/health

---

## Features

- Online membership booking with 3-step flow (Details, Payment, QR Code)
- Mock payment system with simulated payment flow
- Unique QR code generated for every member after payment
- Admin QR scanner to check members in and out at gym entrance
- Password protected admin panel
- Real-time gym crowd tracking using Socket.IO with polling fallback
- Only valid paying members can check in (booking validation)
- Hourly crowd traffic chart for the day
- Hire trainers at gym, home, or via video call
- Filter trainers by specialization
- Conditional address field shown only for personal training bookings
- Dynamic membership prices fetched from database
- Gym location on interactive map with directions
- Contact form with issue type saved to MongoDB
- Fully responsive across mobile, tablet, and desktop

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/plans | Get all membership plans |
| POST | /api/bookings | Create a booking |
| GET | /api/bookings/qr/:token | Get booking by QR token |
| GET | /api/trainers | Get all trainers |
| POST | /api/trainer-bookings | Book a trainer |
| GET | /api/crowd/live | Get live crowd count |
| POST | /api/crowd/checkin | Manual check in |
| POST | /api/crowd/checkout | Manual check out |
| POST | /api/crowd/scan | Scan QR to check in or out |
| GET | /api/crowd/hourly | Get today's hourly stats |
| GET | /api/crowd/history | Get attendance history |
| POST | /api/payments/create-order | Create payment order |
| POST | /api/payments/verify | Verify payment |
| GET | /api/payments/status/:bookingId | Get payment status |
| POST | /api/contact | Submit contact message |

---

## Database Collections

- membershipplans - Plan name, price, benefits
- membershippbookings - Member details, payment status, QR token
- trainers - Trainer info, specialization, available modes
- trainerbookings - Trainer booking details
- visittrackings - Gym check in and check out records
- contactmessages - Contact form submissions

---

## Admin Panel

The admin panel is accessible at /admin on the live website.
It requires a password to access and provides a QR code scanner
for checking members in and out of the gym. The scanner works
via phone camera on mobile devices. Each scan updates the live
crowd count in real time for all users on the website.

---

Built with React, Node.js, and MongoDB.