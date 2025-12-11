# Quick Start Checklist - BetterStreets Backend Setup

## ✅ Complete This Step-by-Step

### Phase 1: Install Software (One-time setup)

- [ ] **Install MongoDB**
  - Download from: https://www.mongodb.com/try/download/community
  - Choose: Windows MSI, Complete installation
  - ✓ Check "Install MongoDB as a Service"
  - ✓ Check "Install MongoDB Compass" (optional but helpful)
  - Restart computer after installation

- [ ] **Verify MongoDB is Running**
  ```powershell
  Get-Service MongoDB
  # Should show: Status = Running
  ```

- [ ] **Install MongoDB Compass** (if not installed above)
  - Download from: https://www.mongodb.com/try/download/compass
  - Install with defaults

- [ ] **Install Postman**
  - Download from: https://www.postman.com/downloads/
  - Install with defaults
  - Skip account creation (optional)

### Phase 2: Find Your IP Address

- [ ] **Get Your Computer's IP**
  ```powershell
  ipconfig
  # Look for: IPv4 Address. . . . . : 192.168.1.XX
  # Write it down: __________________
  ```

### Phase 3: Configure Backend

- [ ] **Check .env file**
  - Location: `C:\BetterStreets\backend\.env`
  - Should already exist ✓
  - Verify MONGODB_URI: `mongodb://localhost:27017/betterstreets`

- [ ] **Update .env with your IP**
  - Add your IP to ALLOWED_ORIGINS
  - Example: `ALLOWED_ORIGINS=http://localhost:8081,exp://YOUR_IP:8081`

### Phase 4: Start Backend Server

- [ ] **Open PowerShell in backend directory**
  ```powershell
  cd C:\BetterStreets\backend
  ```

- [ ] **Start the server**
  ```powershell
  npm run dev
  ```

- [ ] **Verify server started**
  - Should see: `Server running in development mode on port 3000`
  - Should see: `MongoDB Connected: 127.0.0.1`
  - Keep this terminal open!

- [ ] **Test health endpoint**
  - Open browser: http://localhost:3000/api/health
  - Should see: `{"status":"OK","message":"BetterStreets API is running"}`

### Phase 5: Update Mobile App

- [ ] **Update API URL in mobile app**
  - File: `C:\BetterStreets\src\utils\constants.js`
  - Find: `BASE_URL: 'http://192.168.1.91:3000/api'`
  - Replace `192.168.1.91` with YOUR IP address

- [ ] **Restart mobile app**
  - Open new PowerShell terminal
  ```powershell
  cd C:\BetterStreets
  npx expo start --clear
  ```

### Phase 6: Test with Postman

- [ ] **Import Postman Collection**
  - Open Postman
  - Click "Import"
  - Select file: `C:\BetterStreets\backend\BetterStreets_Postman_Collection.json`
  - Click "Import"

- [ ] **Test 1: Health Check**
  - Select: "Health Check" request
  - Click "Send"
  - Should get: `{"status":"OK",...}`

- [ ] **Test 2: Register User**
  - Select: "Register User" request
  - Click "Send"
  - Copy the `token` from response
  - Save this token!

- [ ] **Test 3: Get Profile (with token)**
  - Select: "Get My Profile" request
  - Replace `YOUR_TOKEN_HERE` with actual token
  - Click "Send"
  - Should see your user data

### Phase 7: Verify Database

- [ ] **Open MongoDB Compass**
  - Connect to: `mongodb://localhost:27017`
  - Should see database: `betterstreets`
  - Should see collection: `users`
  - Click users → Should see 1 document (your registered user)

### Phase 8: Test Mobile App

- [ ] **Scan QR Code on phone**
  - Open Expo Go app
  - Scan QR code from terminal
  - App should load

- [ ] **Test Registration**
  - Go to Register screen
  - Fill in details
  - Click Register
  - Should redirect to home screen

- [ ] **Test Creating Report**
  - Go to New Report tab
  - Fill in title, description, category
  - Add photo (optional)
  - Click Submit
  - Check backend terminal for API request

---

## 🎉 Success Checklist

If you completed all steps above, you should have:

✅ MongoDB running
✅ Backend server running on port 3000
✅ Mobile app connected to backend
✅ Successfully registered a user
✅ Successfully tested API with Postman
✅ Verified data in MongoDB Compass
✅ Mobile app working on your phone

---

## 🚨 Troubleshooting

### MongoDB won't start
```powershell
Start-Service MongoDB
```

### Port 3000 already in use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000
# Kill the process
taskkill /PID XXXX /F
```

### Can't connect from phone
- Check WiFi: Phone and computer on same network?
- Check IP: Did you use correct IP in constants.js?
- Check Firewall: Try temporarily disabling Windows Firewall

### "Cannot find module" error
```powershell
cd C:\BetterStreets\backend
npm install
```

---

## 📝 Daily Startup Routine

Every time you want to work on the project:

1. **Start MongoDB** (if not running):
   ```powershell
   Start-Service MongoDB
   ```

2. **Start Backend** (Terminal 1):
   ```powershell
   cd C:\BetterStreets\backend
   npm run dev
   ```

3. **Start Mobile App** (Terminal 2):
   ```powershell
   cd C:\BetterStreets
   npx expo start
   ```

4. **Scan QR code** on your phone with Expo Go

---

## 📚 Important Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Configuration (MongoDB URI, JWT secret) |
| `src/utils/constants.js` | Mobile app API URL |
| `backend/ERD_DIAGRAM.md` | Database structure for thesis |
| `INSTALLATION_GUIDE.md` | Detailed setup instructions |
| `THESIS_DOCUMENTATION.md` | Complete thesis guide |
| `BetterStreets_Postman_Collection.json` | API test collection |

---

## 🎓 For Your Thesis Defense

Prepare to demonstrate:
1. User registration via mobile app
2. Report submission with photo and GPS
3. Report viewing and upvoting
4. Admin updating report status
5. Database showing stored data
6. Postman showing API responses

Take screenshots of everything!

---

Need help? Check:
- INSTALLATION_GUIDE.md (step-by-step detailed guide)
- backend/README.md (API documentation)
- THESIS_DOCUMENTATION.md (academic writing guide)
