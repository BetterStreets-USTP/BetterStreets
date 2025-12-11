# BetterStreets Backend Setup Guide

## Prerequisites

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   
2. **Install Node.js** (already installed)

## Setup Steps

### 1. Install MongoDB (Choose one option)

**Option A: Local MongoDB**
- Download and install MongoDB Community Edition
- Start MongoDB service:
```powershell
# Windows - Start MongoDB service
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `.env` file with Atlas connection string

### 2. Configure Environment

The `.env` file is already created. Update if needed:
```
MONGODB_URI=mongodb://localhost:27017/betterstreets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Start the Backend Server

From the `backend` directory:

```powershell
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

Server will start on http://localhost:3000

### 4. Test the API

Open browser or use Postman to test:
- Health check: http://localhost:3000/api/health

### 5. Update Mobile App API URL

Update the mobile app to point to your backend:

In `src/utils/constants.js`:
```javascript
export const API_BASE_URL = 'http://192.168.1.91:3000/api';
```

Replace `192.168.1.91` with your computer's IP address.

## Testing the API

### Register a User
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "09123456789",
  "address": "Camaman-an, CDO"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `token` from the response to use in protected endpoints.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `net start MongoDB`
- Check if port 27017 is available
- Verify MONGODB_URI in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3000

### File Upload Issues
- Ensure `uploads` directory exists
- Check MAX_FILE_SIZE in `.env`

## Next Steps

1. Start MongoDB service
2. Run `npm run dev` in backend directory
3. Update mobile app API URL
4. Test registration and login from mobile app
5. Create an admin user for testing report management

## Creating an Admin User

After registering a regular user, you can manually update their role in MongoDB:

```javascript
// Using MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Documentation

See `backend/README.md` for complete API documentation and request examples.
