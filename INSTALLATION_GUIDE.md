# Complete Installation Guide - BetterStreets Backend
## Step-by-Step Tutorial for Thesis/Capstone Project

---

## 📋 What You'll Install

1. **MongoDB** - Database system
2. **MongoDB Compass** - Database visual tool (optional but recommended)
3. **Postman** - API testing tool
4. **Node.js** - Already installed ✓

---

## STEP 1: Install MongoDB Database

### Windows Installation:

#### 1.1 Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (7.0 or higher)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

#### 1.2 Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **Complete** installation
3. **IMPORTANT**: Check the box "Install MongoDB as a Service"
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
4. **OPTIONAL**: Install MongoDB Compass (recommended) - Check the box
5. Click **Next** → **Install**
6. Wait for installation to complete

#### 1.3 Verify MongoDB Installation
Open PowerShell as Administrator:
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Should show:
# Status: Running
# Name: MongoDB
```

If not running, start it:
```powershell
Start-Service MongoDB
```

#### 1.4 Add MongoDB to System PATH (if needed)
1. Press `Win + X` → Select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find `Path`
5. Click "Edit" → "New"
6. Add: `C:\Program Files\MongoDB\Server\7.0\bin`
7. Click OK

#### 1.5 Test MongoDB Connection
```powershell
# Open PowerShell
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017
# Using MongoDB: 7.0.x

# Type to exit:
exit
```

---

## STEP 2: Install MongoDB Compass (Visual Database Tool)

### If you didn't install it with MongoDB:

1. Go to: https://www.mongodb.com/try/download/compass
2. Download **MongoDB Compass** (not Community Edition)
3. Install with default settings
4. Open MongoDB Compass
5. Connection string should be: `mongodb://localhost:27017`
6. Click **Connect**

You should now see your MongoDB server with no databases yet.

---

## STEP 3: Install Postman (API Testing Tool)

### Why Postman?
- Test your API endpoints
- Verify registration, login, and report creation
- Required for development and testing

### Installation:
1. Go to: https://www.postman.com/downloads/
2. Download **Postman for Windows**
3. Install with default settings
4. Create a free account (or skip)
5. Close the startup tutorial

---

## STEP 4: Prepare Backend Environment

### 4.1 Navigate to Backend Directory
```powershell
cd C:\BetterStreets\backend
```

### 4.2 Verify Dependencies Installed
```powershell
# Should already be done, but verify:
npm list --depth=0

# You should see:
# - express
# - mongoose
# - bcryptjs
# - jsonwebtoken
# - etc.
```

### 4.3 Verify .env Configuration
Check that `C:\BetterStreets\backend\.env` exists and contains:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/betterstreets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.91:8081
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## STEP 5: Start the Backend Server

### 5.1 First Time Setup
```powershell
# Make sure you're in the backend directory
cd C:\BetterStreets\backend

# Verify uploads directory exists
Test-Path uploads
# Should return: True
```

### 5.2 Start the Server
```powershell
# Option 1: Development mode (auto-restart on code changes)
npm run dev

# Option 2: Production mode
npm start
```

### 5.3 Verify Server is Running
You should see:
```
Server running in development mode on port 3000
MongoDB Connected: 127.0.0.1
```

### 5.4 Test Health Check
Open browser and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "BetterStreets API is running"
}
```

✅ **Backend is now running!**

---

## STEP 6: Update Mobile App Configuration

### 6.1 Find Your Computer's IP Address
```powershell
# In PowerShell, run:
ipconfig

# Look for "Wireless LAN adapter Wi-Fi:" or "Ethernet adapter"
# Find "IPv4 Address": 192.168.1.XX (example)
```

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.91
```

**Your IP**: `192.168.1.91` (use your actual IP)

### 6.2 Update constants.js File

Open: `C:\BetterStreets\src\utils\constants.js`

Find the line:
```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
```

Replace with YOUR IP:
```javascript
export const API_BASE_URL = 'http://192.168.1.91:3000/api';
```

**IMPORTANT**: 
- Use YOUR computer's IP (not 192.168.1.91)
- Keep the `:3000/api` part
- Don't use `localhost` - it won't work on your phone

### 6.3 Update .env in Backend
Open: `C:\BetterStreets\backend\.env`

Update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.91:8081,http://192.168.1.91:3000
```

### 6.4 Restart Backend Server
```powershell
# Stop the server: Ctrl + C
# Start again:
npm run dev
```

---

## STEP 7: Test API with Postman

### 7.1 Create New Request Collection

1. Open Postman
2. Click **New** → **Collection**
3. Name it: `BetterStreets API`
4. Click **Create**

### 7.2 Test 1: Health Check

1. Click **Add Request**
2. Name: `Health Check`
3. Method: **GET**
4. URL: `http://localhost:3000/api/health`
5. Click **Send**

**Expected Response:**
```json
{
  "status": "OK",
  "message": "BetterStreets API is running"
}
```

### 7.3 Test 2: Register User

1. Click **Add Request**
2. Name: `Register User`
3. Method: **POST**
4. URL: `http://localhost:3000/api/auth/register`
5. Go to **Body** tab
6. Select **raw** and **JSON**
7. Enter:
```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "09123456789",
  "address": "Camaman-an, Cagayan de Oro City"
}
```
8. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "Juan Dela Cruz",
    "email": "juan@example.com",
    "phone": "09123456789",
    "address": "Camaman-an, Cagayan de Oro City",
    "role": "resident",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ Copy the token** - you'll need it for authenticated requests!

### 7.4 Test 3: Login User

1. Click **Add Request**
2. Name: `Login User`
3. Method: **POST**
4. URL: `http://localhost:3000/api/auth/login`
5. Body (JSON):
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```
6. Click **Send**

**Expected Response:** Same as registration with token

### 7.5 Test 4: Get Current User (Protected Route)

1. Click **Add Request**
2. Name: `Get My Profile`
3. Method: **GET**
4. URL: `http://localhost:3000/api/auth/me`
5. Go to **Headers** tab
6. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE` (paste the token from registration)
7. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "Juan Dela Cruz",
    "email": "juan@example.com",
    ...
  }
}
```

---

## STEP 8: Verify Database in MongoDB Compass

1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. You should see database: **betterstreets**
4. Click on it to expand
5. You should see collections:
   - `users` (1 document - the user you created)
   - (Other collections will appear when you create reports/announcements)

6. Click on `users` collection
7. You should see your registered user with hashed password

---

## STEP 9: Test Creating a Report (Optional)

### 9.1 Create Report with Postman

1. Click **Add Request**
2. Name: `Create Report`
3. Method: **POST**
4. URL: `http://localhost:3000/api/reports`
5. Go to **Headers**:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
6. Go to **Body** → **form-data**
7. Add fields:
   - Key: `title` | Value: `Pothole on Main Street`
   - Key: `description` | Value: `Large pothole causing traffic issues`
   - Key: `category` | Value: `Road Damage`
   - Key: `location[latitude]` | Value: `8.4833`
   - Key: `location[longitude]` | Value: `124.6500`
   - Key: `address` | Value: `Main Street, Camaman-an`
8. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Pothole on Main Street",
    "status": "pending",
    "reporter": {
      "name": "Juan Dela Cruz",
      ...
    },
    ...
  }
}
```

---

## STEP 10: Test from Mobile App

### 10.1 Make Sure Both Are Running

**Terminal 1 - Backend:**
```powershell
cd C:\BetterStreets\backend
npm run dev
```

**Terminal 2 - Mobile App:**
```powershell
cd C:\BetterStreets
npx expo start --clear
```

### 10.2 Test Registration from Phone

1. Scan QR code with Expo Go
2. App should load
3. Go to Register screen
4. Enter details
5. Click Register

**If successful:**
- You'll be redirected to home screen
- Check backend terminal - you'll see the API request

**If error:**
- Check that API_BASE_URL uses your IP address
- Check that backend is running
- Check that phone is on same WiFi network

---

## STEP 11: Create Admin User (For Testing Admin Features)

### Option 1: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to database
3. Go to `betterstreets` → `users`
4. Find your user document
5. Click **Edit Document**
6. Change `role: "resident"` to `role: "admin"`
7. Click **Update**

### Option 2: Using mongosh (Command Line)

```powershell
# Open mongosh
mongosh

# Switch to database
use betterstreets

# Update user role
db.users.updateOne(
  { email: "juan@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "juan@example.com" })

# Exit
exit
```

---

## Troubleshooting Guide

### Problem: MongoDB won't start
```powershell
# Check service status
Get-Service MongoDB

# Start service
Start-Service MongoDB

# If still not working, restart computer
```

### Problem: Port 3000 already in use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Or change PORT in .env to 3001
```

### Problem: Can't connect from phone
- Verify IP address is correct
- Make sure phone is on same WiFi network
- Check Windows Firewall (allow port 3000)
- Try temporarily disabling firewall for testing

### Problem: "Cannot find module" error
```powershell
cd C:\BetterStreets\backend
npm install
```

### Problem: MongoDB connection refused
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Check connection string in .env
# Should be: mongodb://localhost:27017/betterstreets
```

---

## Quick Reference Commands

### Start Backend (Development):
```powershell
cd C:\BetterStreets\backend
npm run dev
```

### Start Mobile App:
```powershell
cd C:\BetterStreets
npx expo start
```

### Check MongoDB Status:
```powershell
Get-Service MongoDB
```

### View MongoDB Data:
```powershell
mongosh
use betterstreets
db.users.find()
db.reports.find()
exit
```

---

## For Your Thesis Documentation

### Include These Sections:

1. **System Requirements**
   - Node.js v18+
   - MongoDB 7.0+
   - Expo Go mobile app

2. **Installation Steps** (summarize this guide)

3. **Configuration** 
   - Environment variables explanation
   - API endpoints list

4. **Testing Procedures**
   - Postman test cases
   - Expected vs actual results

5. **Screenshots to Include:**
   - MongoDB Compass showing database structure
   - Postman request/response examples
   - Mobile app screens
   - Backend server running in terminal

---

## Need Help?

If you encounter any issues:
1. Check the Troubleshooting section above
2. Verify all services are running
3. Check the backend terminal for error messages
4. Try restarting both backend and MongoDB

Good luck with your thesis! 🎓
