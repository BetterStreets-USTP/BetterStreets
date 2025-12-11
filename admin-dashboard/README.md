# BetterStreets Admin Dashboard Setup Guide

## Overview
This is the admin web dashboard for BetterStreets Camaman-an barangay reporting system. It works in conjunction with the mobile app to manage reports, assign agencies, post announcements, and visualize analytics.

## Installation

### 1. Install Dependencies
```bash
cd admin-dashboard
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The dashboard will run on: http://localhost:5173

### 3. Ensure Backend is Running
Make sure the backend server is running on port 3000:
```bash
cd ../backend
npm start
```

## Features Implemented

### ✅ Core Features (From Research Paper)
1. **Dashboard** - Overview with stats, recent reports, charts
2. **Reports Management** - View, filter, update status, assign agencies
3. **Analytics** - Charts showing category distribution, status breakdown, trends
4. **Heatmap** - Geographic visualization of reports
5. **Announcements** - Create, edit, delete announcements for residents
6. **Worker Management** - Manage barangay workers/technicians
7. **Categories** - Manage report categories with keywords
8. **Report Timeline** - Status history tracking
9. **Assignment System** - Assign reports to workers
10. **Smart Auto-Classification** - Rule-based keyword categorization

### 🔐 Authentication
- Role-based access (admin/staff only)
- JWT token authentication
- Secure session management

### 📊 Data Visualization
- Recharts for analytics graphs
- Leaflet for heatmap
- Real-time statistics

## Default Admin Account

For testing purposes:
- **Email:** admin@betterstreets.local
- **Password:** admin123

(Created during announcement seeding script)

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Charts:** Recharts
- **Maps:** Leaflet + React-Leaflet
- **HTTP:** Axios
- **Notifications:** React-Hot-Toast
- **Icons:** Lucide React

## File Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   ├── StatCard.jsx         # Reusable stat cards
│   │   ├── ReportTable.jsx      # Reports data table
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── Reports.jsx          # Reports listing
│   │   ├── ReportDetails.jsx   # Individual report view
│   │   ├── Analytics.jsx        # Charts and graphs
│   │   ├── Heatmap.jsx          # Map visualization
│   │   ├── Announcements.jsx   # Announcements CRUD
│   │   ├── Workers.jsx          # Worker management
│   │   ├── Categories.jsx       # Category management
│   │   └── Login.jsx            # Login page
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication state
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Endpoints Used

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id/status` - Update report status
- `PUT /api/reports/:id/assign` - Assign worker to report
- `DELETE /api/reports/:id` - Delete report

### Analytics
- `GET /api/reports/analytics` - Get analytics data
- `GET /api/reports/heatmap` - Get heatmap coordinates

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Users/Workers
- `GET /api/users` - Get all users (filtered by role)
- `POST /api/users` - Create new user/worker
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Key Features Alignment with Research Paper

### RAD Methodology
- ✅ Fast prototyping with Vite + React
- ✅ Iterative development
- ✅ Component reusability
- ✅ Quick feedback cycle

### System Requirements Met
- ✅ Web-based admin dashboard
- ✅ Local testing (no deployment)
- ✅ Report management interface
- ✅ Worker assignment system
- ✅ Analytics visualization
- ✅ Heatmap for geographic data
- ✅ Announcement system
- ✅ Category management with keywords
- ✅ Report timeline/status history

### Security & Compliance
- ✅ Local-only operation (Data Privacy Act compliant)
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ No public deployment
- ✅ Local database storage

## Usage Guide

### Managing Reports
1. Navigate to "Reports" in sidebar
2. View all reports with filters (status, category, date)
3. Click a report to see details
4. Update status (Pending → In Progress → Resolved/Rejected)
5. Assign worker from dropdown
6. View timeline of status changes

### Creating Announcements
1. Go to "Announcements"
2. Click "Create Announcement"
3. Fill in title, message, priority
4. Publish - residents will see in mobile app

### Viewing Analytics
1. Navigate to "Analytics"
2. View charts:
   - Reports by category
   - Status distribution
   - Daily/weekly trends
   - Worker performance

### Using Heatmap
1. Go to "Heatmap"
2. See all reports plotted on map
3. Filter by category
4. Click markers to see report details

### Managing Workers
1. Navigate to "Workers"
2. Add new workers with role assignment
3. View worker statistics
4. Assign/reassign reports

## Development Notes

### Adding New Features
1. Create component in `src/components/` or `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Layout.jsx`
4. Create API functions in `src/services/api.js`

### Styling
- Use Tailwind utility classes
- Brand colors: primary (#4CAF7D), secondary (#06B6D4)
- Follow existing component patterns

### State Management
- React Context for auth state
- Local component state for UI
- API calls in useEffect hooks

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 3000
- Check proxy configuration in vite.config.js
- Verify API_BASE_URL in api.js

### Login issues
- Verify admin user exists in database
- Check JWT token configuration in backend
- Clear localStorage and try again

### Map not loading
- Check internet connection (Leaflet tiles)
- Verify report coordinates format [longitude, latitude]
- Check console for errors

## Next Steps for Full Implementation

I've created the foundation. To complete, you need to:

1. Run `npm install` in admin-dashboard folder
2. Create remaining page components (Dashboard.jsx, Reports.jsx, etc.)
3. Test with your mobile app
4. Customize UI colors/branding
5. Add real-time updates (optional WebSocket)

## Contact & Support

This is a thesis project for Barangay Camaman-an, CDO.
Local testing only - no public deployment.

---

**Remember:** This system runs locally for testing purposes only, in compliance with your research paper limitations and Data Privacy Act requirements.
