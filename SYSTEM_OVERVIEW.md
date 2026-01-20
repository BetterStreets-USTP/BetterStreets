# BetterStreets System Overview

**Last Updated:** January 13, 2026  
**Version:** 1.0.0  
**Status:** Fully Operational - Capstone Project (Production Ready)

---

## Table of Contents
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## System Architecture

BetterStreets is a three-tier system for barangay-level community issue reporting:

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Residents)                   │
│  React Native + Expo SDK 54 + React Navigation              │
│  - Submit reports with photos & GPS                          │
│  - View community reports & own reports                      │
│  - Notification center with unread badge                     │
│  - Track report timeline & status history                    │
│  - Offline mode with auto-sync                               │
│  - Edit profile & notification settings                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ REST API (JWT Auth)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  BACKEND SERVER (Node.js)                    │
│  Express + MongoDB + Mongoose                                │
│  - REST API endpoints                                        │
│  - JWT authentication                                        │
│  - File uploads (Multer)                                     │
│  - Push notifications (Expo)                                 │
│  - Smart auto-classification                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ REST API (JWT Auth)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│               ADMIN DASHBOARD (Barangay Staff)               │
│  React 18 + Vite + Tailwind CSS                              │
│  - Manage all reports                                        │
│  - Update status with remarks                                │
│  - Assign barangay units                                     │
│  - Create announcements                                      │
│  - View analytics & heatmap                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## User Roles

### 1. Resident (resident)
- Register via mobile app
- Submit community issue reports
- Upload photos with reports (clickable full-screen viewer)
- View all community reports
- View own report history
- Track report status timeline with barangay unit assignment
- Receive and view push notifications in notification center
- Read announcements
- Edit profile (name, email, phone, address)
- Manage notification preferences

### 2. Admin (admin)
- Created manually via backend script
- Access web dashboard
- View all reports with filters
- Update report status
- Assign reports to barangay units
- Add remarks/notes
- Create announcements
- View analytics
- Delete reports (if needed)
- Manage system settings

---

## Core Features

### 1. Smart Report Classification
- **Automatic category suggestion** based on keywords
- 8 categories: Road Damage, Street Lighting, Garbage/Waste, Drainage/Flooding, Illegal Activity, Public Safety, Infrastructure, Other
- Keyword scoring algorithm
- Fallback to "Other" if no match

### 2. Barangay Unit Assignment
- 7 designated barangay units:
  - Barangay Maintenance Team
  - Sanitation Department
  - Traffic Management
  - Engineering Office
  - Health Services
  - Peace and Order
  - Social Welfare
- Visible to residents
- Logged in status history
- Included in notifications

### 3. Status Timeline
- Automatic logging of all status changes
- Each entry includes:
  - Status (pending, in-progress, resolved, rejected)
  - Timestamp
  - Assigned barangay unit
  - Admin remarks
  - Updated by (admin reference)
- Visual display in both mobile and web
- Color-coded progression
- Complete audit trail

### 4. Push Notifications & Notification Center
- Expo Push Notification Service
- In-app notification screen with:
  - All announcements from admin
  - Report status update history
  - Unread/read tracking with visual indicators
  - Red badge on tab icon showing unread count
  - "Mark all as read" functionality
  - Click to view full report or announcement
  - Relative timestamps ("2h ago", "Just now")
  - Pull-to-refresh support
- Triggered automatically on status update
- Works on production builds (EAS)
- Token stored in user model

### 5. Photo Uploads & Viewer
- Multiple photos per report (up to 5)
- Stored in backend/uploads/ directory
- Secure file naming (UUID)
- Image validation (JPEG, PNG)
- Size limit (5MB per file)
- Full-screen photo viewer in mobile app:
  - Tap photo to view full-screen
  - Pinch to zoom
  - Swipe to close
  - Black overlay background
- Display in both platforms

### 6. Offline Mode
- Mobile app works without internet connection
- Reports saved locally via AsyncStorage caching
- Automatic resynchronization when connection restored
- Offline indicator in UI
- Draft reports preserved until sync

### 7. Heatmap Visualization
- OpenStreetMap integration
- Color-coded markers by status
- Filter by status, category, priority
- Interactive marker details
- Geographic clustering

### 8. Announcements
- Official barangay updates from admin dashboard
- Categories: General, Emergency, Event, Maintenance, Update
- Priority levels: Low, Normal, High
- Optional expiration dates
- Rich content support with textarea editor
- Automatic push to mobile app
- Create/Edit/Delete functionality in admin panel
- Category and priority badges in mobile display
- Timestamp and author information displayed

### 9. Profile Management
- Edit profile screen in mobile app:
  - Update name
  - Update email (disabled in form)
  - Add/edit phone number
  - Add/edit address
  - Form validation
- Notification settings screen:
  - Check permission status
  - Request notification permissions
  - Register/update push token
  - Toggle notification preferences
  - Visual status indicators

### 10. Analytics Dashboard
- Total reports statistics
- Status breakdown
- Category distribution
- Priority analysis
- Trend visualization
- Barangay unit performance

---

## Technology Stack

### Mobile App
| Component | Technology |
|-----------|------------|
| Framework | React Native 0.76.5 |
| Build Tool | Expo SDK 54 |
| Platform | Android only (iOS not implemented) |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| State Management | React Context API (AuthContext, OfflineContext) |
| Storage | AsyncStorage |
| UI Components | expo-linear-gradient, Ionicons |
| Location | expo-location |
| Camera | expo-image-picker |
| Notifications | expo-notifications |
| Network Detection | @react-native-community/netinfo |
| HTTP Client | fetch API |

### Admin Dashboard
| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Maps | React Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Notifications | React Hot Toast |

### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB 7.0 |
| ODM | Mongoose 8 |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| Push Notifications | expo-server-sdk |
| Validation | express-validator |
| CORS | cors |
| Compression | compression |

---

## Database Schema

### Collections (4 Total)

#### 1. users
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  address: String,
  role: String (enum: ['resident', 'admin']),
  pushToken: String (Expo token),
  isVerified: Boolean,
  createdAt: Date
}
```

#### 2. report
```javascript
{
  _id: ObjectId,
  title: String (required, max: 200),
  description: String (required, max: 2000),
  category: String (enum: 8 categories),
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: String
  },
  photos: [{
    filename: String,
    path: String,
    uploadedAt: Date
  }],
  status: String (enum: ['pending', 'in-progress', 'resolved', 'rejected']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  assignedAgency: String (enum: 7 barangay units or null),
  reporter: ObjectId (ref: User),
  resolvedAt: Date,
  adminNotes: String,
  statusHistory: [{
    status: String,
    assignedAgency: String (barangay unit name),
    remarks: String,
    updatedBy: ObjectId (ref: User),
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Indexes: 2dsphere on location
```

#### 3. categories
```javascript
{
  _id: ObjectId,
  category_name: String (unique, required),
  keywords: [String] (for auto-classification),
  description: String,
  color: String,
  isActive: Boolean,
  createdAt: Date
}
```

#### 4. announcements
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  category: String (enum: ['General', 'Emergency', 'Event', 'Maintenance', 'Update']),
  priority: String (enum: ['low', 'normal', 'high']),
  author: ObjectId (ref: User),
  isActive: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile           - Update user profile
PUT    /api/auth/push-token        - Update push token
```

### Reports
```
POST   /api/reports                - Create report
GET    /api/reports                - Get all reports (filters: status, category, priority)
GET    /api/reports/:id            - Get single report
GET    /api/reports/user           - Get current user's reports
GET    /api/reports/heatmap        - Get heatmap data
POST   /api/reports/suggest-category - Get category suggestion
PUT    /api/reports/:id/status     - Update status (admin only)
DELETE /api/reports/:id            - Delete report (admin only)
```

### Announcements
```
GET    /api/announcements          - Get active announcements
POST   /api/announcements          - Create announcement (admin)
PUT    /api/announcements/:id      - Update announcement (admin)
DELETE /api/announcements/:id      - Delete announcement (admin)
```

### Categories
```
GET    /api/categories             - Get all categories
POST   /api/categories             - Create category (admin)
```
Deployment & Testing Environment

### Current Production Setup
1. **Backend API**: Running on port 3000 with nodemon
   - MongoDB service running on localhost:27017
   - Database: `betterstreets` (fully seeded)
   - Email service: Gmail SMTP (betterstreetsph@gmail.com)
   - OTP verification: Fully functional
   
2. **Admin Dashboard**: Running on port 5173 (Vite dev server)
   - CORS configured for all platforms
   - Admin login: betterstreetschatgpt@gmail.com / admin123
   
3. **Mobile App**: Expo development server
   - Android Emulator: Uses 10.0.2.2:3000/api
   - Physical Devices: Uses 192.168.1.91:3000/api
   - Expo Go or standalone builds supported

### Database Status
- **Collections**: users (1), categories (8), announcements (5), reports (variable)
- **Admin Account**: Created and verified
- **Sample Data**: Categories and announcements seeded
- **Email Service**: Gmail SMTP configured with app password
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/betterstreets

# JWT Authentication
JWT_SECRET=your-secret-key-change-this-in-production-2026
JWT_EXPIRE=7d

# Email Configurconstants.js)
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000/api', // For Android Emulator
  // BASE_URL: 'http://192.168.1.91:3000/api', // For Physical Device
  TIMEOUT: 10000,
};
```

**Note**: Switch between emulator (10.0.2.2) and physical device (192.168.1.91) URLs as needed.ongoDB: localhost:27017/betterstreets

### Testing Platforms
- Android Emulator: Medium_Phone_API_36 (fully tested)
- Expo Go: Supports both emulator and physical devices
- Admin Dashboard: Chrome/Edge browser on localhost:5173
- API Testing: Postman collection available
- Android device/emulator via Expo Go
- No public deployment or cloud hosting
- Suitable for capstone evaluation and demonstration

---

## Environment Variables

### Backend (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/betterstreets
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Admin Dashboard (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Mobile App (app.json)
```json
{**Simplified Roles**: Only resident and admin (no separate worker role)
2. **Barangay Unit Assignment**: Simple dropdown selection with 7 designated units
3. **Status History**: Automatic logging for complete transparency and audit trail
4. **Push Notifications**: Using Expo Push Notification Service for cross-platform support
5. **Offline First**: Mobile app works without internet via AsyncStorage caching
6. **Open Source Maps**: OpenStreetMap (no API keys required)
7. **File Storage**: Local uploads directory (backend/uploads/) for local testing
8. **Authentication**: JWT tokens for stateless API with 7-day expiration
9. **Platform**: Android focus (tested on Android Emulator API 36)
10. **Email Service**: Gmail SMTP with app passwords for OTP verification
11. **Network Architecture**: Supports both emulator (10.0.2.2) and physical devices (local IP)
12. **Database**: MongoDB running as Windows service for auto-start capability
```System Status

### ✅ Fully Implemented Features
- User registration with OTP email verification
- User login with JWT authentication
- Report submission with photo uploads and GPS
- Smart category auto-classification
- Report status management (pending, in-progress, resolved, rejected)
- Barangay unit assignment system
- Status history tracking with timestamps
- Push notifications for status updates
- Announcement creation and management
- Admin dashboard with full CRUD operations
- Mobile app with offline support
- Profile management
- MongoDB database with all collections
- Email service (OTP and notifications)
- Android emulator support
- CORS configuration for all platforms

### 🚀 Future Enhancements
- iOS mobile application support
- Cloud deployment (Railway, Render, or AWS)
- MongoDB Atlas for cloud database
- Google Play Store distribution
- SMS notifications via Twilio
- Enhanced email templates with HTML
- Export reports to PDF
- Advanced analytics dashboard with charts
- Machine learning for priority prediction
- Multi-language support (Bisaya, Tagalog, English)
- Social media integration for viral reports
- Public report tracking (guest access)
- Dark mode for mobile and web
- Report templates for common issues
- Real-time chat between residents and barangay staff
- Geofencing for location-based notification
---

## Future Enhancements

### Proposed for Future Work
- iOS mobile application support
- Cloud deployment (Railway, Render, or DigitalOcean)
- MongoDB Atlas for production database
- Google Play Store distribution
- SMS notifications via Twilio
- Email notifications
- Export reports to PDF
- Advanced analytics with machine learning
- Multi-language support (Bisaya, Tagalog)
- Social media integration
- Public report tracking (no login required)
- Dark mode
- Report templates

---

## Support & Documentation

- **Setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Features**: See [FEATURES.md](./FEATURES.md)
- **ERD**: See [backend/ERD_DIAGRAM.md](./backend/ERD_DIAGRAM.md)
- **API**: See [backend/README.md](./backend/README.md)
- **Dashboard**: See [admin-dashboard/README.md](./admin-dashboard/README.md)

---

Developed for Barangay Camaman-an, Cagayan de Oro City
