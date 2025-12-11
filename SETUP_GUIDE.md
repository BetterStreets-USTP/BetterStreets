# BetterStreets - Setup & Installation Guide

## Prerequisites Installation

### 1. Install Node.js and npm

**Windows:**
1. Download Node.js LTS from https://nodejs.org/ (v18 or higher recommended)
2. Run the installer
3. Follow the installation wizard (keep default settings)
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

**Alternative - Using Chocolatey (if installed):**
```powershell
choco install nodejs-lts
```

### 2. Install Expo CLI

After Node.js is installed:
```powershell
npm install -g expo-cli
```

Verify installation:
```powershell
expo --version
```

### 3. Install Expo Go on Your Mobile Device

**For Testing:**
- **Android**: Download "Expo Go" from Google Play Store
- **iOS**: Download "Expo Go" from Apple App Store

## Project Setup

### Step 1: Install Dependencies

Navigate to the project directory and install all required packages:

```powershell
cd "c:\Users\jetrw\OneDrive\Desktop\BetterStreets"
npm install
```

This will install:
- React Native and Expo packages
- Navigation libraries
- AsyncStorage for offline storage
- Location and camera modules
- Maps components
- Network detection
- API communication tools

### Step 2: Configure the Application

#### A. Update API Endpoint

Edit `src/utils/constants.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3000/api', // Replace with your backend URL
  TIMEOUT: 10000,
};
```

**Note:** Use your computer's local IP address if testing with backend on same network.

#### B. Update Map Coordinates (Optional)

Ensure the coordinates in `src/utils/constants.js` match Camaman-an area:

```javascript
export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 8.4542,    // Camaman-an, CDO
    longitude: 124.6319,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
};
```

#### C. Add App Icons (Optional)

Replace placeholder files in `assets/` folder:
- `icon.png` - 1024x1024px app icon
- `splash.png` - 1284x2778px splash screen
- `adaptive-icon.png` - 1024x1024px (Android)
- `favicon.png` - 48x48px (Web)

### Step 3: Start Development Server

```powershell
npm start
```

Or:
```powershell
expo start
```

This will:
1. Start the Metro bundler
2. Open Expo Dev Tools in your browser
3. Display a QR code in the terminal

### Step 4: Run on Device

#### Option A: Using Expo Go (Recommended for Testing)

1. Open Expo Go app on your phone
2. Scan the QR code displayed in the terminal or browser
3. Wait for the app to load

**Ensure phone and computer are on the same Wi-Fi network!**

#### Option B: Using Emulator

**Android Emulator:**
```powershell
npm run android
```

**iOS Simulator (Mac only):**
```powershell
npm run ios
```

## Testing the App

### Test Offline Functionality

1. Enable Airplane Mode or disable Wi-Fi on your device
2. Try submitting a report
3. Report should be saved locally
4. Disable Airplane Mode
5. App should auto-sync the offline report

### Test Location Services

1. Grant location permissions when prompted
2. Create a new report
3. Tap "Get Location" button
4. Verify coordinates are captured
5. Check the heatmap to see the marker

### Test All Features

- ✅ User Registration
- ✅ User Login
- ✅ Create Report with photo
- ✅ Create Report without photo
- ✅ View My Reports
- ✅ View Announcements
- ✅ View Heatmap
- ✅ Offline mode
- ✅ Profile management
- ✅ Logout

## Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH. Install Node.js from https://nodejs.org/

### Issue 2: "expo is not recognized"
**Solution:** Install Expo CLI globally:
```powershell
npm install -g expo-cli
```

### Issue 3: Can't connect to development server
**Solution:** 
- Ensure phone and computer are on same Wi-Fi
- Check firewall settings
- Try using tunnel mode: `expo start --tunnel`

### Issue 4: Metro bundler errors
**Solution:** Clear cache and restart:
```powershell
npm start -- --reset-cache
```

### Issue 5: Module not found errors
**Solution:** Reinstall dependencies:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 6: Location not working
**Solution:**
- Grant location permissions in device settings
- Enable location services
- For Android emulator, set location in emulator settings

### Issue 7: Camera not working
**Solution:**
- Grant camera permissions
- Use physical device (camera doesn't work in some emulators)

## Development Workflow

### Making Changes

1. Edit files in `src/` folder
2. Save changes
3. App will automatically reload (Fast Refresh)
4. Check for errors in terminal or on device

### Project Structure Reference

```
src/
├── components/        → Reusable UI elements
├── contexts/         → Global state (Auth, Offline)
├── navigation/       → Screen navigation setup
├── screens/          → Main app screens
├── services/         → API calls and storage
└── utils/            → Helpers and constants
```

### Adding New Features

1. Create screen in `src/screens/`
2. Create components in `src/components/`
3. Add navigation in `src/navigation/`
4. Update services if API integration needed
5. Test thoroughly

## Building for Production

### Generate APK (Android)

```powershell
expo build:android
```

Choose options:
- Build type: apk
- Keystore: Generate new or use existing

Download APK when build completes.

### Generate IPA (iOS)

```powershell
expo build:ios
```

**Note:** Requires Apple Developer account

### Alternative: Using EAS Build

```powershell
npm install -g eas-cli
eas build --platform android
```

## Backend Requirements

The app expects a REST API with these endpoints:

**Authentication:**
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`

**Reports:**
- GET `/api/reports` - Get all reports
- POST `/api/reports` - Create report (multipart/form-data)
- GET `/api/reports/:id` - Get single report
- GET `/api/reports/my-reports` - Get user's reports

**Announcements:**
- GET `/api/announcements` - Get all announcements

**User Profile:**
- GET `/api/users/profile` - Get profile
- PUT `/api/users/profile` - Update profile

### Sample API Response Formats

**Login Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com",
    "phone": "09123456789",
    "address": "Camaman-an, CDO"
  }
}
```

**Report Response:**
```json
{
  "id": 1,
  "category": "waste",
  "description": "Improper garbage disposal",
  "image": "http://backend.com/uploads/report1.jpg",
  "latitude": 8.4542,
  "longitude": 124.6319,
  "location": "Camaman-an, Cagayan de Oro City",
  "status": "PENDING",
  "createdAt": "2025-12-08T10:30:00Z"
}
```

## Next Steps

1. ✅ Install Node.js and npm
2. ✅ Install Expo CLI
3. ✅ Install project dependencies
4. ✅ Configure API endpoint
5. ✅ Start development server
6. ✅ Test on physical device
7. ✅ Connect to backend API
8. ✅ Test all features
9. ✅ Build production APK/IPA

## Support

For help with setup:
- Check Expo documentation: https://docs.expo.dev
- React Native docs: https://reactnative.dev/docs/getting-started
- Contact: [Your Contact Info]

---

**Good luck with your capstone project!** 🚀
