# BetterStreets - Barangay Community Issue Reporting System

A mobile-based community issue reporting system for Barangay Camaman-an, Cagayan de Oro City, enabling residents to report community concerns with photos, GPS location, and real-time status tracking.

## 📱 Features

- **Mobile App (React Native + Expo)**
  - User registration with email verification (OTP)
  - Report submission with photo capture and GPS location
  - Offline report storage with automatic synchronization
  - Real-time report status tracking
  - Community announcements
  - Interactive heatmap visualization
  - Forgot password functionality

- **Admin Dashboard (React + Vite)**
  - Secure admin/worker authentication
  - Real-time dashboard statistics
  - Report management with status updates
  - Announcement broadcasting
  - Interactive heatmap for issue analysis
  - Category and status filtering

- **Backend API (Node.js + Express)**
  - RESTful API with JWT authentication
  - MongoDB database integration
  - Email notifications (OTP, verification, password reset)
  - File upload handling
  - Role-based access control (resident, worker, admin)
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

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BetterStreets-USTP/BetterStreets.git
cd BetterStreets
```

2. **Setup Backend**
```bash
cd backend
npm install
# Create .env file (see backend/.env.example)
node src/scripts/createNewAdmin.js  # Create admin account
npm run dev  # Starts on port 3000
```

3. **Setup Mobile App**
```bash
cd ..
npm install
npm start  # Opens Expo Developer Tools
```

4. **Setup Admin Dashboard**
```bash
cd admin-dashboard
npm install
npm run dev  # Starts on port 5173
```

## 📚 Documentation

- **[Installation Instructions](INSTALLATION_INSTRUCTIONS.md)** - Comprehensive setup guide
- **[Features Documentation](FEATURES.md)** - Detailed feature descriptions
- **[Backend API Documentation](backend/README.md)** - API endpoints and usage
- **[Postman Collection](backend/BetterStreets_Postman_Collection.json)** - API testing

## 🛠️ Tech Stack

**Mobile App:**
- React Native + Expo SDK 54
- React Navigation
- Expo Camera, Location, Image Picker
- AsyncStorage for offline capability

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT authentication
- Nodemailer (Gmail SMTP for OTP)
- Multer (file uploads)

**Admin Dashboard:**
- React 18 + Vite
- Tailwind CSS
- React Router
- Axios for API calls
- Lucide React icons

## 📂 Project Structure

```
BetterStreets/
├── src/                    # Mobile app source code
├── backend/                # Node.js API server
├── admin-dashboard/        # React admin panel
├── assets/                 # App images and icons
└── INSTALLATION_INSTRUCTIONS.md
```

## 🔑 Default Credentials

**Admin Dashboard:**
- Email: `betterstreetschatgpt@gmail.com`
- Password: `admin123`

## 🌐 Running the Complete System

You need 3 terminals running simultaneously:

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

## 📱 Testing the Mobile App

- **Android/iOS:** Install Expo Go app, scan QR code
- **Web:** Press `w` in terminal
- **Emulator:** Press `a` (Android) or `i` (iOS)

## 👥 User Roles

- **Resident:** Submit and track community issue reports
- **Barangay Worker:** Update report status and manage assigned issues
- **Admin:** Full system access, manage all reports and announcements

## 📧 Contact

For issues or questions, please refer to the documentation files or check the thesis documentation.

## 📄 License

This project is developed for Barangay Camaman-an, Cagayan de Oro City.

---

**Built with ❤️ for better communities**

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
