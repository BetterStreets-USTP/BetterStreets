# BetterStreets - Complete Installation Guide

This guide will help you set up BetterStreets on a new computer from scratch.

## Prerequisites

Before you begin, install the following software:

### 1. **Node.js** (v18 or higher)
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Verify installation: `node --version` and `npm --version`

### 2. **MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Make sure MongoDB is running as a service
- Default connection: `mongodb://localhost:27017`

### 3. **Git** (for cloning the repository)
- Download from: https://git-scm.com/
- Verify installation: `git --version`

### 4. **Code Editor** (Recommended)
- Visual Studio Code: https://code.visualstudio.com/

---

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/BetterStreets-USTP/BetterStreets.git
cd BetterStreets
```

---

## Backend Setup

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` folder with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/betterstreets

# JWT Secret (use a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_USER=jetrwu@gmail.com
EMAIL_APP_PASSWORD=qywmpeuncrtsvhzu

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Important Notes:**
- Change `JWT_SECRET` to a secure random string
- For email functionality, use your own Gmail credentials or keep the existing ones
- To get Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

### Step 4: Create Admin Account

```bash
node src/scripts/createNewAdmin.js
```

This will create an admin account:
- **Email:** betterstreetschatgpt@gmail.com
- **Password:** admin123

### Step 5: Start Backend Server

```bash
npm run dev
```

Backend will run on: `http://localhost:3000`

---

## Mobile App Setup

### Step 6: Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
```

### Step 7: Install Mobile App Dependencies

Open a new terminal:

```bash
cd BetterStreets
npm install
```

### Step 8: Configure API URL

The app is already configured to use `http://localhost:3000` for development.

If you need to test on a physical device, update the API URL in:
- `src/services/apiService.js` - change `baseURL` to your computer's IP address (e.g., `http://192.168.1.100:3000`)

### Step 9: Start Mobile App

```bash
npm start
```

This will:
1. Open Expo Developer Tools in your browser
2. Show a QR code

**To run the app:**
- **Android:** Install Expo Go app, scan QR code
- **iOS:** Install Expo Go app, scan QR code
- **Web:** Press `w` in terminal
- **Android Emulator:** Press `a` in terminal (requires Android Studio)
- **iOS Simulator:** Press `i` in terminal (requires Xcode - Mac only)

---

## Admin Dashboard Setup

### Step 10: Install Admin Dashboard Dependencies

Open another terminal:

```bash
cd BetterStreets/admin-dashboard
npm install
```

### Step 11: Configure Dashboard API URL

The dashboard is already configured to connect to `http://localhost:3000`.

If your backend runs on a different URL, update:
- `admin-dashboard/src/services/api.js` - change `baseURL`

### Step 12: Start Admin Dashboard

```bash
npm run dev
```

Dashboard will run on: `http://localhost:5173`

---

## Testing the Complete System

### 1. **Backend API** (Port 3000)
- Verify: Open `http://localhost:3000` - should see "BetterStreets API is running"
- Test endpoints using Postman (collection available in `backend/BetterStreets_Postman_Collection.json`)

### 2. **Admin Dashboard** (Port 5173)
- Open: `http://localhost:5173`
- Login with:
  - Email: `betterstreetschatgpt@gmail.com`
  - Password: `admin123`

### 3. **Mobile App**
- Scan QR code with Expo Go app
- Register a new user account
- Verify email with OTP code sent to your email
- Submit test reports
- Check dashboard to see reports appear

---

## Running All Services

You need **3 terminal windows** running simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Mobile App:**
```bash
npm start
```

**Terminal 3 - Admin Dashboard:**
```bash
cd admin-dashboard
npm run dev
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Ensure MongoDB service is running
- Windows: Check Services → MongoDB Server
- Verify connection string in `.env` file

### Issue: Port Already in Use
**Solution:**
- Backend: Change `PORT` in `.env`
- Dashboard: Change port in `vite.config.js`
- Or stop the process using that port

### Issue: Email OTP Not Sending
**Solution:**
- Verify Gmail credentials in `.env`
- Check if 2-Step Verification is enabled
- Generate new App Password if needed

### Issue: Cannot Access from Physical Device
**Solution:**
- Make sure your computer and phone are on the same WiFi network
- Update API baseURL to your computer's IP address
- Disable firewall or allow port 3000

### Issue: Module Not Found Errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
BetterStreets/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, upload, etc.
│   │   ├── utils/             # Email, helpers
│   │   └── server.js          # Entry point
│   ├── uploads/               # User uploaded files
│   └── .env                   # Environment variables
│
├── admin-dashboard/           # React + Vite Admin Panel
│   ├── src/
│   │   ├── pages/             # Dashboard pages
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # State management
│   │   └── services/          # API calls
│   └── public/                # Static assets
│
├── src/                       # React Native Mobile App
│   ├── screens/               # App screens
│   ├── components/            # Reusable components
│   ├── navigation/            # Navigation setup
│   ├── services/              # API & storage
│   ├── contexts/              # Auth & offline
│   └── utils/                 # Helpers & constants
│
├── assets/                    # App assets (logo, images)
├── App.js                     # Mobile app entry
└── package.json               # Mobile app dependencies
```

---

## Key Features Implemented

### Mobile App Features:
- ✅ User registration with email verification (OTP)
- ✅ Forgot password functionality
- ✅ Report submission with photo and GPS location
- ✅ Offline report storage and auto-sync
- ✅ Real-time report status tracking
- ✅ Announcements from barangay
- ✅ Heatmap visualization
- ✅ Push notifications
- ✅ Profile management

### Admin Dashboard Features:
- ✅ Secure admin/worker login
- ✅ Real-time dashboard statistics
- ✅ Reports management (view, update status, filter)
- ✅ Announcement broadcasting
- ✅ Interactive heatmap
- ✅ Analytics and reporting
- ✅ User management

### Backend Features:
- ✅ RESTful API with JWT authentication
- ✅ MongoDB database with Mongoose ODM
- ✅ Email notifications (OTP, welcome, password reset)
- ✅ File upload handling
- ✅ Role-based access control
- ✅ CORS enabled for dashboard access

---

## Development Tips

### Hot Reload
- Backend: Uses `nodemon` - auto-restarts on file changes
- Dashboard: Uses Vite - instant hot module replacement
- Mobile: Expo - instant refresh on save

### Debugging
- Backend: Check terminal logs for API errors
- Mobile: Use Expo Developer Tools or React Native Debugger
- Dashboard: Use browser DevTools (F12)

### Database Management
- Use MongoDB Compass to view/edit database: https://www.mongodb.com/products/compass
- Connection string: `mongodb://localhost:27017`
- Database name: `betterstreets`

---

## Deployment (Future)

For production deployment, consider:

### Backend:
- Deploy to Railway, Heroku, or DigitalOcean
- Use MongoDB Atlas for cloud database
- Set proper environment variables
- Enable HTTPS

### Mobile App:
- Build APK for Android: `expo build:android`
- Build for iOS: `expo build:ios` (requires Mac + Apple Developer Account)
- Or use Expo EAS Build

### Admin Dashboard:
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update API URL to production backend

---

## Support

For issues or questions:
- Check documentation in `/backend/README.md`
- Review API endpoints in Postman collection
- Check thesis documentation: `THESIS_DOCUMENTATION.md`

---

## License

This project is developed for Barangay Camaman-an, Cagayan de Oro City.

---

**Installation Complete!** 🎉

You should now have:
- ✅ Backend API running on http://localhost:3000
- ✅ Admin Dashboard running on http://localhost:5173
- ✅ Mobile App accessible via Expo

Start developing and improving the community! 🌟
