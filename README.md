# 🏋️ Fitness Center — Full-Stack Gym Management Website

A production-grade, full-stack gym management website built with **React**, **Node.js/Express**, **MongoDB**, and **Socket.IO**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 Hero & Landing | Immersive full-screen hero with animated stats |
| ℹ️ About | Mission/vision, image gallery, why-choose-us |
| 🏋️ Services | 6 service cards with hover-reveal animations |
| 💳 Membership Plans | Dynamic pricing from DB, booking with confirmation ID |
| 👨‍🏫 Hire a Trainer | 6 trainers, filter by specialty, conditional form (address only for personal training) |
| 📊 Live Crowd Tracker | Real-time via Socket.IO + polling fallback, hourly chart, check-in simulation |
| 🗺️ Gym Location | Leaflet + OpenStreetMap, custom marker, directions button |
| 💬 Testimonials | Auto-cycling carousel with aggregate stats |
| 📬 Contact | Issue-type form stored in MongoDB, social links |
| 🦶 Footer | Full links, hours, CTA banner |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (custom dark gym theme)
- Leaflet + react-leaflet (maps)
- Socket.IO client (real-time crowd)
- Axios (API calls)
- Google Fonts: Bebas Neue + DM Sans

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO (real-time crowd events)
- dotenv, cors

---

## 📁 Project Structure

```
gym-website/
├── backend/
│   ├── config/
│   │   └── seed.js              # DB seeder (plans + trainers)
│   ├── controllers/
│   │   ├── plansController.js
│   │   ├── bookingsController.js
│   │   ├── trainersController.js
│   │   ├── trainerBookingsController.js
│   │   ├── crowdController.js   # Socket.IO emit on check-in/out
│   │   └── contactController.js
│   ├── models/
│   │   ├── MembershipPlan.js
│   │   ├── MembershipBooking.js
│   │   ├── Trainer.js
│   │   ├── TrainerBooking.js
│   │   ├── VisitTracking.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── plans.js
│   │   ├── bookings.js
│   │   ├── trainers.js
│   │   ├── trainerBookings.js
│   │   ├── crowd.js
│   │   └── contact.js
│   ├── server.js                # Express + Socket.IO entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Sticky, responsive, hamburger menu
    │   │   ├── Modal.jsx        # Reusable dark modal overlay
    │   │   └── Footer.jsx       # Full footer with CTA banner
    │   ├── sections/
    │   │   ├── Hero.jsx         # Full-screen landing
    │   │   ├── About.jsx        # Image grid + mission/vision
    │   │   ├── Services.jsx     # 6-card hover grid
    │   │   ├── Membership.jsx   # Plan cards + booking modal
    │   │   ├── Trainers.jsx     # Trainer cards + hire modal
    │   │   ├── LiveCrowd.jsx    # Real-time crowd + hourly chart
    │   │   ├── Location.jsx     # Leaflet map + info card
    │   │   ├── Testimonials.jsx # Auto-carousel + stats
    │   │   └── Contact.jsx      # Contact form + social links
    │   ├── services/
    │   │   └── api.js           # Axios API calls (all endpoints)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css            # Tailwind + custom CSS
    ├── index.html
    ├── vite.config.js           # Proxy to backend :5000
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd gym-website
```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gymdb
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Seed the database** (adds 3 plans + 6 trainers):
```bash
npm run seed
```

**Start backend:**
```bash
npm run dev     # with nodemon (development)
# or
npm start       # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

> The Vite dev server proxies `/api` and `/socket.io` requests to `localhost:5000` — no CORS issues.

---

## 📡 API Endpoints

### Membership Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | Fetch all active plans |
| POST | `/api/plans` | Create a plan (admin) |
| PUT | `/api/plans/:id` | Update a plan (admin) |
| DELETE | `/api/plans/:id` | Deactivate a plan |

### Membership Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Book a membership |
| GET | `/api/bookings` | Get all bookings (admin) |
| GET | `/api/bookings/:id` | Get booking by ID |

### Trainers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trainers` | Fetch all active trainers |
| POST | `/api/trainers` | Add trainer (admin) |
| PUT | `/api/trainers/:id` | Update trainer (admin) |
| DELETE | `/api/trainers/:id` | Deactivate trainer |

### Trainer Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trainer-bookings` | Book a trainer |
| GET | `/api/trainer-bookings` | Get all trainer bookings |

### Live Crowd
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crowd/live` | Current count + status + recent |
| POST | `/api/crowd/checkin` | Check a user in |
| POST | `/api/crowd/checkout` | Check a user out |
| GET | `/api/crowd/hourly` | Today's hourly stats |
| GET | `/api/crowd/history` | Full attendance history |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact message |
| GET | `/api/contact` | Get all messages (admin) |

---

## 🔌 Real-Time (Socket.IO)

The backend emits a `crowdUpdate` event whenever someone checks in or out:

```js
// Client-side listener (already implemented in LiveCrowd.jsx)
socket.on('crowdUpdate', ({ count, timestamp }) => {
  // refresh crowd data
});
```

Falls back to 30-second polling if WebSocket is unavailable.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Red | `#E8192C` |
| Accent Orange | `#FF6B35` |
| Background Dark | `#0A0A0A` |
| Card Background | `#111111` |
| Border | `#1E1E1E` |
| Muted Text | `#666666` |
| Display Font | Bebas Neue |
| Body Font | DM Sans |
| Mono Font | JetBrains Mono |

---

## 🔮 Bonus / Future Enhancements

- [ ] JWT-based user authentication (login/signup)
- [ ] Admin dashboard with analytics charts
- [ ] QR code generation for gym check-in
- [ ] Stripe / Razorpay payment gateway
- [ ] Email confirmations (Nodemailer)
- [ ] Attendance chart with recharts
- [ ] Push notifications for crowd status

---

## 📦 Environment Variables

```env
# Backend .env
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📝 License

MIT — Free to use for personal and commercial projects.

---

Built with ❤️ using React + Node.js + MongoDB