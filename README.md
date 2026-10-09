# 🚨 PulseNews - Real-Time News Alert System

A full-stack **MERN** real-time news alert system delivering breaking news updates, customizable alert preferences, and automated email notifications. Built with **React**, **Node.js**, **Express**, **MongoDB** (with automated zero-config in-memory fallback), **Socket.io**, **Nodemailer**, and **TailwindCSS**.

---

## ✨ Features

- ⚡ **Real-Time WebSockets**: Instant breaking news alert broadcasts delivered to connected browsers via `Socket.io`.
- 📩 **Email Notification Service**: Automated email dispatches using `Nodemailer` with Ethereal test accounts and live rendered HTML preview links.
- ⚙️ **Customizable Preferences**:
  - **Categories**: Technology, Politics, Sports, Business, Entertainment, Health, Science.
  - **Frequency**: *Immediate*, *Hourly Digest*, *Daily Briefing*.
  - **Channels**: Email, Browser Push, and In-App Toast alerts.
- 📊 **Interactive Dashboard**: Real-time stats, subscribed categories, active breaking news highlights, and notification delivery history logs.
- 📻 **Real-Time Event Simulator**: Control panel allowing users to simulate breaking news events, customize headlines, and trigger instant Socket.io & Nodemailer notifications.
- 🌙 **Dark & Light Mode**: Sleek glassmorphism UI with seamless theme toggling.
- 💾 **Zero-Config Database**: Automatic failover to `mongodb-memory-server` if local MongoDB is not installed.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS v4, Lucide React Icons, Socket.io-client, Axios
- **Backend**: Node.js, Express.js, MongoDB / Mongoose (`mongodb-memory-server` fallback)
- **Real-Time**: Socket.io (WebSockets)
- **Email Service**: Nodemailer
- **Scheduler**: Node-cron

---

## 📁 Project Structure

```
realtime-news-app/
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB handler (Auto MongoMemoryServer fallback)
│   ├── models/
│   │   ├── User.js              # User schema & preference storage
│   │   ├── NewsArticle.js       # Aggregated news article schema
│   │   └── NotificationLog.js   # History of sent notifications
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication & guest login
│   │   ├── newsRoutes.js        # Headlines, search, category feeds, trigger alert
│   │   ├── preferenceRoutes.js  # Category & frequency preference management
│   │   └── notificationRoutes.js# History logs & test email triggers
│   ├── services/
│   │   ├── emailService.js      # Nodemailer service with Ethereal preview links
│   │   ├── newsAggregator.js    # News aggregation & breaking news engine
│   │   └── socketService.js     # Socket.io real-time event broadcasting
│   ├── package.json
│   └── server.js                # Express server entry point
│
└── client/                      # React + Vite + TailwindCSS Frontend
    ├── public/
    │   └── _redirects           # Netlify single-page application routing rules
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # App navigation with connection indicator & theme toggle
    │   │   ├── BreakingTicker.jsx# Real-time animated ticker bar for breaking news
    │   │   ├── ToastAlert.jsx   # Live toast & audio notification on WebSocket alert
    │   │   ├── NewsCard.jsx     # Modern news article card
    │   │   └── TestEmailModal.jsx# Interactive modal to send & preview Nodemailer emails
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Overview of breaking news & alert statistics
    │   │   ├── NewsFeed.jsx     # Filterable news stream with search and category pills
    │   │   ├── Preferences.jsx  # Category selection, alert frequency, and channels
    │   │   ├── AlertHistory.jsx # History logs of all delivered notifications
    │   │   └── Simulator.jsx    # Breaking news trigger control panel
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Authentication state & preferences management
    │   │   ├── SocketContext.jsx# Socket.io connection & real-time events listener
    │   │   └── ThemeContext.jsx # Light & Dark mode glassmorphic theme controller
    │   ├── App.jsx
    │   ├── index.css            # Tailwind CSS styling & animations
    │   └── main.jsx
    ├── netlify.toml             # Netlify deployment configuration
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm`

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanjussa17/real-time-news.git
   cd real-time-news
   ```

2. **Start the Backend Server**:
   ```bash
   cd server
   npm install
   npm start
   ```
   *The server runs on `http://localhost:5000` and automatically starts an in-memory MongoDB server if local MongoDB is not running.*

3. **Start the Frontend Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 🌐 Deployment Instructions

### Host Backend Server on Render / Hugging Face
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Root Directory**: `server`

### Host Frontend Client on Netlify
- **Base Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` = `https://your-backend-service.onrender.com`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
