# BetterStreets Backend API

Backend server for the BetterStreets Barangay Community Reporting System for Camaman-an, Cagayan de Oro City.

## Features

- User authentication (register, login, JWT tokens)
- Report submission with photos and GPS location
- Report status management (pending, in-progress, resolved, rejected)
- Community upvoting system
- Announcements from barangay officials
- Heatmap data for issue visualization
- Role-based access control (resident, barangay_staff, admin)
- File upload for report photos

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcrypt for password hashing

## Installation

1. Install MongoDB locally or use MongoDB Atlas
2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string
   - Update `ALLOWED_ORIGINS` with your mobile app URLs

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create new report (protected, with photo upload)
- `GET /api/reports/user/my-reports` - Get user's reports (protected)
- `PUT /api/reports/:id/status` - Update report status (staff/admin)
- `PUT /api/reports/:id/assign` - Assign report to staff (admin)
- `PUT /api/reports/:id/upvote` - Upvote/remove upvote (protected)
- `GET /api/reports/heatmap` - Get heatmap data

### Announcements
- `GET /api/announcements` - Get all active announcements
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement (staff/admin)
- `PUT /api/announcements/:id` - Update announcement (staff/admin)
- `DELETE /api/announcements/:id` - Delete announcement (admin)

### Health Check
- `GET /api/health` - Check API status

## Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "09123456789",
  "address": "Camaman-an, CDO"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Create Report (with photos)
```bash
POST /api/reports
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Pothole on Main Street"
description: "Large pothole causing accidents"
category: "Road Damage"
location[latitude]: 8.4833
location[longitude]: 124.6500
address: "Main Street, Camaman-an"
photos: [file1.jpg, file2.jpg]
```

### Update Report Status
```bash
PUT /api/reports/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "high",
  "adminNotes": "Scheduled for repair next week"
}
```

## User Roles

- **resident** - Can create reports, upvote, view announcements
- **barangay_staff** - Can update report status, create announcements
- **admin** - Full access, can assign reports, delete announcements

## File Upload

- Maximum file size: 5MB per file
- Maximum files per report: 5
- Allowed formats: JPG, JPEG, PNG
- Files stored in `/uploads` directory
- Accessible via `/uploads/filename.jpg`

## Database Models

### User
- name, email, password, phone, address
- role (resident/barangay_staff/admin)
- Timestamps

### Report
- title, description, category
- location (GeoJSON Point)
- photos array
- status, priority
- reporter (User ref)
- assignedTo (User ref)
- upvotes array
- Timestamps

### Announcement
- title, content, category
- priority, isActive
- author (User ref)
- expiresAt
- Timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation
- File type validation
- CORS configuration
- Helmet.js security headers
- Request compression

## Error Handling

All endpoints return consistent JSON responses:

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Environment Variables

Required variables in `.env`:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - Token expiration (default: 7d)
- `ALLOWED_ORIGINS` - CORS allowed origins
- `MAX_FILE_SIZE` - Max upload size in bytes
- `UPLOAD_PATH` - Upload directory path

## Development

Install nodemon for development:
```bash
npm install -D nodemon
```

Run with hot-reload:
```bash
npm run dev
```

## License

ISC
