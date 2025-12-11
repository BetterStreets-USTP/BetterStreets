# 🌟 BetterStreets - Barangay Community Issue Reporting System

**Production-Ready | Fully Functional | Push Notifications | Status Timeline**

A modern, community-focused system for Barangay Camaman-an, Cagayan de Oro City. Residents report issues via mobile app, barangay staff manage them via web dashboard, with complete transparency through status history and push notifications.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)

---

## 🚀 Quick Links

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation instructions
- **[Features Documentation](./FEATURES.md)** - All features explained
- **[ERD Diagram](./backend/ERD_DIAGRAM.md)** - Database structure
- **[Backend API](./backend/README.md)** - API documentation
- **[Admin Dashboard](./admin-dashboard/README.md)** - Web dashboard guide

---

## ✨ Key Features

### 📱 **Mobile App (Residents)**
- **Report Submission**: Submit community issues with photos, GPS location, and description
- **Smart Auto-Classification**: AI-powered category suggestion based on keywords
- **Dual Reports View**: 
  - All Reports: See all community reports
  - My Reports: Track your own submissions
- **Status Timeline**: Complete audit trail from submission to resolution
- **Notification Center**: 
  - View all announcements & report updates
  - Unread badge on tab icon
  - Mark as read/unread tracking
  - Pull-to-refresh support
- **Push Notifications**: Get notified when barangay updates your report
- **Agency Visibility**: See which barangay department is handling your issue
- **Full-Screen Photo Viewer**: Tap photos to view in full screen with zoom
- **Profile Management**: Edit name, phone, address; manage notification settings
- **Offline Mode**: Submit reports without internet, auto-sync later
- **Modern UI**: Floating tab bar with 5 tabs (Home, Reports, Add, Notifications, Profile)

### 🌐 **Admin Dashboard (Barangay Staff)**
- **Report Management**: View, filter, and update all reports
- **Agency Assignment**: Assign reports to specific barangay departments:
  - Barangay Maintenance Team
  - Sanitation Department
  - Traffic Management
  - Engineering Office
  - Health Services
  - Peace and Order
  - Social Welfare
- **Status Updates**: Change status with remarks (logged in timeline)
- **Visual Timeline**: See complete report history with color-coded progression
- **Announcements**: Create and manage community announcements
- **Analytics Dashboard**: Statistics and trends visualization
- **Heatmap**: Geographic visualization of all reports
- **Photo Gallery**: View all submitted photos

### 🔔 **Push Notifications**
- Sent via Expo Push Notification Service
- Includes report title, new status, assigned agency, and remarks
- Works on production builds (EAS Build)
- Automatic on status changes

### 📖 **Transparency & Accountability**
- **Status History**: Every update logged with timestamp
- **Agency Tracking**: Know exactly who's handling what
- **Admin Remarks**: Read barangay staff comments
- **Timeline Visualization**: Color-coded status progression
- **Complete Audit Trail**: From pending → in-progress → resolved/rejected
- **Notification Feed**: All updates in one place with unread tracking

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework**: React Native 0.76.5 with Expo SDK 54
- **UI**: expo-linear-gradient, Ionicons
- **Navigation**: React Navigation 7 (Tab + Stack)
- **State**: React Context API (AuthContext, OfflineContext)
- **Storage**: AsyncStorage (offline capability)
- **Location**: expo-location (GPS capture)
- **Camera**: expo-image-picker
- **Notifications**: expo-notifications + expo-server-sdk
- **Network**: @react-native-community/netinfo

### Frontend (Admin Dashboard)
- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Maps**: React Leaflet + OpenStreetMap
- **HTTP**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MongoDB 7.0 with Mongoose 8
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Push Notifications**: expo-server-sdk
- **Validation**: express-validator

### Database Collections
1. **users** - User accounts (residents & admins)
2. **report** - Issue reports with status history
3. **categories** - Report categories with keywords
4. **announcements** - Official barangay announcements

---

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your mobile device (for testing)

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd BetterStreets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update the API base URL in `src/utils/constants.js`:
   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'http://your-backend-url.com/api', // Replace with your backend URL
     TIMEOUT: 10000,
   };
   ```

4. **Configure map region**
   
   Update the initial map region for Camaman-an in `src/utils/constants.js`:
   ```javascript
   export const MAP_CONFIG = {
     INITIAL_REGION: {
       latitude: 8.4542,    // Camaman-an coordinates
       longitude: 124.6319,
       latitudeDelta: 0.05,
       longitudeDelta: 0.05,
     },
   };
   ```

## Running the App

### Development Mode

1. **Start the Expo development server**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Run on device or emulator**
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app (iOS only)
   - **Web**: Press `w` to open in web browser

### Build for Production

#### Android APK
```bash
expo build:android
```

#### iOS IPA
```bash
expo build:ios
```

## Project Structure

```
BetterStreets/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── ReportCard.js
│   │   └── LoadingScreen.js
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.js
│   │   └── OfflineContext.js
│   ├── navigation/        # Navigation configuration
│   │   ├── MainNavigator.js
│   │   ├── TabNavigator.js
│   │   └── ReportNavigator.js
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── NewReportScreen.js
│   │   ├── MyReportsScreen.js
│   │   ├── AnnouncementsScreen.js
│   │   ├── HeatmapScreen.js
│   │   └── ProfileScreen.js
│   ├── services/          # API and storage services
│   │   ├── apiService.js
│   │   └── storageService.js
│   └── utils/             # Helper functions and constants
│       ├── constants.js
│       ├── helpers.js
│       └── locationHelper.js
├── assets/                # Images, fonts, icons
├── App.js                 # Root component
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## Key Features Explanation

### Offline Capability
The app automatically detects network status and:
- Saves reports locally when offline
- Shows sync indicator when pending reports exist
- Automatically syncs reports when connection is restored
- Caches reports and announcements for offline viewing

### Smart Categorization
Reports are categorized into predefined types with:
- Color-coded visual indicators
- Category-specific icons
- Easy selection interface

### Location Services
- Automatic GPS location capture
- Reverse geocoding for readable addresses
- Location displayed on heatmap
- Permission handling

### Real-time Updates
- Report status tracking
- Push notifications for status changes (when backend supports)
- Announcement notifications

## Configuration

### Permissions Required

The app requires the following permissions:
- **Location**: To tag reports with GPS coordinates
- **Camera**: To capture issue photos
- **Storage**: To save photos and offline data

Permissions are requested at runtime when features are used.

### Environment Variables

Create a `.env` file in the root directory:
```env
API_BASE_URL=http://your-backend-url.com/api
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npm start -- --reset-cache
   ```

2. **Module not found errors**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Location not working**
   - Ensure location permissions are granted
   - Check device location services are enabled
   - For iOS simulator, use Debug → Location → Custom Location

4. **Maps not displaying**
   - Verify Google Maps API key is configured
   - Ensure proper permissions in app.json

## Backend Integration

This mobile app requires a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Submit new report
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/my-reports` - Get user's reports

### Announcements
- `GET /api/announcements` - Get all announcements

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Testing

### Test Accounts
For testing purposes, you can use:
- Email: `test@camamanan.com`
- Password: `password123`

(Update with actual test credentials)

## Deployment

### For Testing (Internal)
1. Build APK/IPA using Expo
2. Distribute to test users via TestFlight (iOS) or direct APK (Android)

### For Production
1. Configure production API endpoints
2. Update app version in `app.json`
3. Build release versions
4. Submit to App Store / Play Store

## Support

For issues or questions:
- **Email**: support@betterstreets.com
- **Phone**: (Barangay Contact Number)

## Contributors

**Capstone Project Team**
- [Your Names Here]

**Barangay Camaman-an**
Cagayan de Oro City

## License

This project is developed for Barangay Camaman-an as part of a capstone project.

---

**Version**: 1.0.0
**Last Updated**: December 2025
