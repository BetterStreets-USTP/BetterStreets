# Chapter III - System Architecture
## Section 3.1.3

---

### 3.1.3. System Architecture

BetterStreets Camaman-an adopts a three-tier client-server architecture designed for mobile-based community reporting, web-based administrative management, and centralized data persistence. The architecture is structured to support modular development, maintainability, and clear separation of concerns between presentation layers (mobile and web interfaces), application logic (backend API server), and data storage (NoSQL database). This architectural approach facilitates the digital transformation of barangay-level issue reporting by enabling residents to submit georeferenced reports with photographic evidence through a mobile application while providing barangay personnel with centralized tools for verification, categorization, assignment, status tracking, and resolution monitoring through a web-based administrative dashboard.

The system architecture is designed to address key operational requirements specific to community reporting at the barangay level, including offline-capable mobile operation through local caching using AsyncStorage, automatic synchronization when connectivity is restored, real-time push notification delivery for status updates, keyword-based auto-classification of reports into predefined categories, geographic visualization through heatmap integration using OpenStreetMap, and complete audit trail logging through automatic status history tracking. The layered design ensures that changes to one layer (such as user interface updates or database schema modifications) can be implemented without requiring extensive modifications to other layers, supporting iterative development and future system enhancements while maintaining system stability during the capstone prototype phase and potential production deployment.

The architecture follows RESTful API principles for communication between client applications and the backend server, using JSON as the data interchange format and JWT (JSON Web Tokens) for stateless authentication and authorization. This design choice ensures platform independence, allowing the mobile application (Android) and web dashboard to interact with the same backend API endpoints while maintaining consistent business logic enforcement, data validation, and security policies across all access points. The use of MongoDB as the NoSQL database supports flexible schema evolution, efficient geospatial queries for location-based report filtering and heatmap generation, and embedded document structures for status history arrays and photo metadata, reducing the need for complex join operations and improving read performance for frequently accessed data.

---

#### 3.1.3.1. High-Level Architecture Overview

The system architecture is illustrated in Figure 3.1 below, showing the interaction flow between users, client devices, the application server, external services, and the database.

```
┌───────────────────────────┐                 ┌────────────────────────────┐
│                           │                 │                            │
│     Residents (Users)     │                 │   Barangay Personnel       │
│                           │                 │        (Admin)             │
└─────────────┬─────────────┘                 └──────────────┬─────────────┘
              │                                              │
              │                                              │
┌─────────────▼─────────────┐                 ┌──────────────▼─────────────┐
│                           │                 │                            │
│        Mobile App         │                 │       Web Dashboard        │
│      (Android Only)       │                 │        (Admin Panel)       │
│   React Native + Expo     │                 │   React 18 + Vite +        │
│   Offline: AsyncStorage   │                 │   Tailwind CSS             │
│   Photos + GPS Location   │                 │                            │
│   Notifications Center    │                 │   Heatmap + Analytics      │
│                           │                 │   Reports Management       │
└─────────────┬─────────────┘                 └──────────────┬─────────────┘
              │                                              │
              │                                              │
              └───────────────────┬──────────────────────────┘
                                  │
                                  │  INTERNET / Local Network
                                  │  REST API (JWT Authentication)
                                  │
                       ┌──────────▼───────────┐
                       │                      │
                       │  Application Server  │
                       │  Node.js + Express   │
                       │                      │
                       │  • Authentication    │
                       │    (JWT + bcryptjs)  │
                       │  • Reports API       │
                       │  • Status History    │
                       │    (Timeline)        │
                       │  • Assignment to     │
                       │    Barangay Units    │
                       │  • Announcements API │
                       │  • Categories API    │
                       │  • Keyword-based     │
                       │    Classification    │
                       │  • File Uploads      │
                       │    (Multer)          │
                       │  • Push Triggers     │
                       │    (Expo)            │
                       └──────────┬───────────┘
                                  │
                ┌─────────────────┴───────────────────┐
                │                                     │
     ┌──────────▼───────────┐             ┌──────────▼──────────────┐
     │                      │             │                         │
     │   Database           │             │   External / Device     │
     │   MongoDB + Mongoose │             │   Services              │
     │                      │             │                         │
     │ Collections:         │             │  • Expo Push            │
     │  • users             │             │    Notification Service │
     │  • reports           │             │  • OpenStreetMap Tiles  │
     │  • categories        │             │    (Heatmap/Map View)   │
     │  • announcements     │             │  • Device GPS           │
     │                      │             │    (Location Tagging)   │
     └──────────────────────┘             └─────────────────────────┘
```

**Figure 3.1: BetterStreets System Architecture**

The architecture follows a client-server model where:

- **Resident (User)** - Community members who report barangay issues via Android mobile app
- **Barangay Admin** - Barangay staff who manage reports via web dashboard
- **Mobile Device (Android App)** - Built with React Native 0.76.5 and Expo SDK 54, used by residents to submit reports with photos, GPS location, and track status updates
- **Web Browser (Admin Dashboard)** - Built with React 18 and Vite 5, used by admin to review reports, update status, assign barangay units, create announcements, and view analytics
- **Internet** - Provides connectivity between client devices and the application server using REST API with JWT authentication for secure communication
- **Application Server** - Backend built with Node.js 18+ and Express 4 framework, handling all business logic, API endpoints, file uploads with Multer, keyword-based auto-classification, and push notification triggers
- **MongoDB Database** - NoSQL database storing all persistent data in 4 collections: users (residents and admin accounts with pushToken), reports (community issues with photos, location, status, statusHistory), categories (8 predefined types with keywords for auto-classification), and announcements (official barangay updates)
- **External Services** - Third-party integrations including Expo Push Notification Service for delivering status updates to residents, OpenStreetMap for heatmap visualization in admin dashboard, and device GPS hardware accessed via expo-location for automatic geolocation tagging

---

#### 3.1.3.2. Detailed Component Description

**3.1.3.2.0. User Access Layer**

This layer consists of the system users who directly interact with BetterStreets, namely the residents and the barangay staff (administrators). Residents access the system through Android smartphones using Wi-Fi or mobile data, enabling them to report incidents at the point of observation. Barangay staff access the system through a web-based administrative dashboard using a desktop or laptop computer for report processing, assignment, and monitoring. This layer defines the primary actors and their access patterns, ensuring that the system supports convenient community reporting while maintaining administrative control over case handling.

**Residents:** submit reports, attach photo evidence, capture geographic location, use offline-capable caching, and view report status and history.

**Barangay Staff/Admin:** review and validate reports, categorize issues, assign responsible barangay units, update report statuses, publish announcements, and close resolved cases.

**3.1.3.2.1. Mobile Application Layer (Resident Interface)**

The mobile application is developed using React Native 0.76.5 with Expo SDK 54, targeting Android devices running Android 5.0 (Lollipop) or higher. The application serves as the primary interface for residents to submit community issue reports and track their status.

**Key Components:**
- **Authentication Module**: Handles user registration and login using JWT tokens stored in AsyncStorage for persistent sessions.
- **Report Submission Module**: Provides a guided form with validation for title (max 200 characters), description (max 2000 characters), category selection (8 options), photo capture/selection (up to 5 images via expo-image-picker), and automatic GPS coordinate capture (expo-location with permission handling).
- **Offline Storage Module**: Uses AsyncStorage to cache reports locally when internet connectivity is unavailable, preserving drafts and allowing viewing of previously loaded data. Automatic resynchronization occurs when connection is restored.
- **Notification Center**: In-app screen displaying all announcements from admin and report status update history with unread/read tracking, red badge on tab icon showing unread count, and "Mark all as read" functionality.
- **Profile Management**: Allows residents to update personal information (name, phone, address) and manage notification preferences through dedicated settings screen.
- **Navigation**: React Navigation 7 with Stack Navigator for screen transitions and Bottom Tab Navigator with 5 tabs (Home, Reports, Add Report, Notifications, Profile) using floating design with gradient backgrounds.

**3.1.3.2.2. Backend Server Layer (Application Logic)**

The backend server is built using Node.js 18+ runtime with Express 4 framework, implementing RESTful API architecture following REST principles with standard HTTP methods (GET, POST, PUT, DELETE) and JSON data format.

**Key Components:**
- **Authentication Controller**: Manages user registration with bcryptjs password hashing (10 salt rounds), login with JWT token generation (24-hour expiration), token verification middleware for protected routes, and push token registration for notification delivery.
- **Report Controller**: Handles report creation with automatic category suggestion using keyword scoring algorithm, retrieval with filtering options (status, category, priority), status updates with automatic statusHistory logging, assignment to barangay units via dropdown selection, and deletion (admin only).
- **Announcement Controller**: Enables admins to create announcements with categories (General, Emergency, Event, Maintenance, Update) and priority levels (low, normal, high), set expiration dates, retrieve active announcements for mobile app consumption, and manage announcement lifecycle.
- **Category Classifier**: Implements keyword-based auto-classification algorithm that scans report title and description for predefined keywords associated with 8 categories, calculates scores based on keyword matches, and suggests the highest-scoring category or defaults to "Other" if no matches found.
- **File Upload Handler**: Uses Multer middleware to process multipart/form-data requests, validates file types (JPEG/PNG only), enforces size limits (5MB per file, maximum 5 files per report), generates UUID-based filenames to prevent collisions, and stores files in backend/uploads/ directory.
- **Push Notification Service**: Integrates expo-server-sdk to send push notifications via Expo Push Notification Service, triggers notifications automatically when report status changes, includes report details and status in notification payload, and handles token validation and error logging.

**3.1.3.2.3. Database Layer (Data Persistence)**

MongoDB 7.0 is used as the NoSQL database with Mongoose 8 as the Object Data Modeling (ODM) library for schema definition, validation, and query building.

**Four Collections:**

1. **users**: Stores resident and admin account information with role-based access control (resident, admin), hashed passwords for security, optional phone and address fields, pushToken for notification delivery, and timestamps for account creation.

2. **reports**: Central collection for community issue reports containing required fields (title, description, category, location with GeoJSON Point coordinates, photos array, status, reporter reference), optional fields (priority, assignedAgency from 7 barangay units, adminNotes, resolvedAt timestamp), and statusHistory array logging all status transitions with timestamps, assigned barangay unit, remarks, and admin identity for complete audit trail.

3. **categories**: Stores 8 predefined categories with category_name (unique), keywords array for auto-classification matching, description, color code for UI display, isActive flag for soft deletion, and creation timestamp.

4. **announcements**: Contains official barangay updates with title, content, category, priority, author reference (admin user), isActive flag for visibility control, expiresAt timestamp for automatic deactivation, and creation timestamp.

**Indexes:** 
- 2dsphere geospatial index on reports.location.coordinates enables efficient radius queries for heatmap visualization and location-based filtering.

**3.1.3.2.4. Web Dashboard Layer (Administrative Interface)**

The administrative dashboard is developed using React 18 with Vite 5 as the build tool and Tailwind CSS 3 for responsive styling, accessible via web browsers on desktop or laptop computers.

**Key Components:**
- **Report Management Interface**: Displays all reports in tabular or card layout with filtering options (status, category, priority, date range), search functionality, sorting capabilities, and pagination for large datasets. Detail view shows complete report information including photo gallery, location map, status timeline, and action buttons.
- **Status Update Module**: Allows admins to change report status via dropdown (pending, in-progress, resolved, rejected), add remarks explaining the action taken, assign or reassign barangay unit responsible for handling, and trigger automatic push notification to reporter upon submission.
- **Announcement Publisher**: Provides form interface for creating announcements with rich text content, category selection, priority level, expiration date picker, and preview functionality before publishing.
- **Analytics Dashboard**: Displays summary statistics (total reports, status breakdown percentages), category distribution pie chart, priority analysis bar chart, trend visualization line graph over time periods, and barangay unit performance metrics showing resolution rates and average response times.
- **Heatmap Visualization**: Integrates React Leaflet with OpenStreetMap tiles to display geographic distribution of reports using color-coded markers (green for resolved, yellow for in-progress, red for pending, gray for rejected), supports filtering by status and category to focus on specific issue types, enables clicking markers to view report details in popup, and includes geographic clustering to group nearby reports for better visualization at zoomed-out levels.

---

#### 3.1.3.3. Data Flow and Communication Patterns

**3.1.3.3.1. Report Submission Flow (Mobile → Backend → Database)**

1. User opens mobile app and navigates to "Add Report" screen via bottom tab navigation.
2. User fills out form fields: title, description, category (manual selection or auto-suggested), and taps "Add Photos" to select up to 5 images using expo-image-picker.
3. App requests location permission via expo-location; if granted, captures current GPS coordinates (latitude, longitude) and performs reverse geocoding to display human-readable address.
4. User reviews form and taps "Submit Report" button.
5. App validates all required fields locally; if validation passes, proceeds to submission.
6. If internet connection is available, app sends POST request to /api/reports endpoint with multipart/form-data including form fields, photo files, and location coordinates, along with JWT token in Authorization header.
7. Backend receives request, verifies JWT token via auth middleware, validates input using express-validator, processes photo uploads via Multer saving to backend/uploads/ directory, runs keyword-based auto-classification algorithm on title and description, creates new report document in MongoDB reports collection with status set to "pending", creates initial statusHistory entry, and returns success response with report ID.
8. App receives success response, clears form fields, displays success message, and navigates user to "My Reports" screen showing newly submitted report.
9. Backend triggers push notification to admin panel notifying of new report submission.

**Offline Scenario:**
- If no internet connection detected, app saves report data to AsyncStorage with "draft" flag.
- User sees "Report saved locally. Will sync when online." message.
- When connection is restored (detected by @react-native-community/netinfo), app automatically attempts to submit all pending drafts.
- Upon successful submission, draft is removed from AsyncStorage.

**3.1.3.3.2. Status Update Flow (Admin Dashboard → Backend → Mobile)**

1. Admin logs into web dashboard, navigates to "Reports" page, and applies filters or uses search to locate specific report.
2. Admin clicks on report row to open detailed view showing all report information, photo gallery, location map, and current status timeline.
3. Admin clicks "Update Status" button, which opens modal dialog.
4. Admin selects new status from dropdown (in-progress, resolved, or rejected), selects or changes assigned barangay unit from dropdown of 7 options, enters remarks in text area explaining action taken or resolution details, and clicks "Save Changes" button.
5. Dashboard sends PUT request to /api/reports/:id/status endpoint with updated status, assignedAgency, and remarks in request body, along with admin JWT token in Authorization header.
6. Backend receives request, verifies admin role from JWT token, validates input fields, updates report document in MongoDB setting new status and adding entry to statusHistory array with timestamp, new status, assigned barangay unit, remarks, and admin user reference.
7. Backend retrieves reporter's pushToken from users collection, constructs push notification message including report title, new status, and remarks, and sends notification via expo-server-sdk to Expo Push Notification Service.
8. Expo Push Notification Service delivers notification to resident's Android device.
9. Backend returns success response to admin dashboard.
10. Dashboard displays success toast message and updates report detail view to reflect new status in timeline.
11. Resident receives push notification on device; tapping notification opens mobile app and navigates to report detail screen showing updated status timeline with new entry containing timestamp, assigned barangay unit, and admin remarks.

**3.1.3.3.3. Heatmap Visualization Flow (Admin Dashboard → Backend → OpenStreetMap)**

1. Admin navigates to "Heatmap" page in web dashboard.
2. Dashboard sends GET request to /api/reports/heatmap endpoint with optional query parameters for filtering (status, category, dateRange).
3. Backend queries MongoDB reports collection with geospatial index, retrieves all reports matching filter criteria with location coordinates, status, category, and title, and returns array of report objects with minimal fields needed for map display.
4. Dashboard receives response and processes data for React Leaflet rendering.
5. React Leaflet component initializes OpenStreetMap tile layer (no API key required), plots markers on map using latitude/longitude coordinates from each report, colors markers based on status (green/yellow/red/gray), and applies MarkerClusterGroup for geographic clustering at zoomed-out levels.
6. Admin interacts with map: zooming, panning, applying filters via UI controls (status checkboxes, category dropdown), and clicking markers to view report details in popup showing title, category, status, and "View Details" link.
7. Clicking "View Details" navigates admin to full report detail page for that specific report.

---

#### 3.1.3.4. Security Architecture

**Authentication & Authorization:**
- JWT (JSON Web Tokens) with 24-hour expiration for stateless authentication
- bcryptjs password hashing with 10 salt rounds for secure password storage
- Role-based access control (RBAC) with two roles: resident (submit reports, view own reports, manage profile) and admin (all resident permissions plus update status, assign barangay units, create announcements, delete reports)
- Protected routes require valid JWT token in Authorization header (Bearer scheme)
- Middleware validates token signature and expiration before allowing access to protected endpoints

**Data Validation:**
- express-validator sanitizes and validates all incoming request data on backend
- Mobile app implements client-side validation for immediate user feedback
- File upload validation enforces file type (JPEG/PNG only), size limits (5MB per file), and quantity limits (maximum 5 photos per report)
- Location validation ensures coordinates are within valid latitude (-90 to 90) and longitude (-180 to 180) ranges

**Communication Security:**
- CORS middleware configured to allow requests only from authorized origins (mobile app and admin dashboard)
- HTTPS recommended for production deployment to encrypt data in transit
- JWT tokens stored securely in AsyncStorage (mobile) and sessionStorage (web dashboard), not in plain text localStorage

**File Security:**
- UUID-based filename generation prevents predictable filenames and directory traversal attacks
- Uploaded files stored outside of web root in backend/uploads/ directory
- Static file serving restricted to authenticated requests for sensitive photos

---

#### 3.1.3.5. Scalability and Performance Considerations

**Mobile Application Performance:**
- AsyncStorage caching reduces unnecessary API calls by storing frequently accessed data locally
- Image compression before upload reduces network bandwidth usage
- Lazy loading of report lists with pagination prevents loading all reports at once
- Optimized re-renders using React.memo and useMemo hooks

**Backend Performance:**
- MongoDB indexing on frequently queried fields (status, category, createdAt, location) speeds up query execution
- Geospatial 2dsphere index enables efficient radius queries for heatmap data retrieval
- Connection pooling in Mongoose maintains persistent database connections
- Compression middleware (compression) reduces response payload size for API endpoints

**Database Design:**
- NoSQL document-oriented structure (MongoDB) allows flexible schema evolution without migrations
- Embedded arrays (photos, statusHistory) reduce need for joins and improve read performance
- Reference fields (reporter, author) maintain data integrity while allowing independent updates

**Limitations for Prototype:**
- Local file storage (backend/uploads/) not suitable for horizontal scaling; cloud storage (S3) recommended for production
- Single MongoDB instance on localhost lacks replication and high availability; MongoDB Atlas cluster recommended for production
- No caching layer (Redis) for frequently accessed data; acceptable for prototype testing with limited users
- No load balancing or multiple backend server instances; suitable for local testing environment only

---

#### 3.1.3.6. Deployment Architecture (Local Testing Environment)

**Development Setup for Capstone Evaluation:**

**Mobile App:**
- Runs on Android device or emulator via Expo Go development client
- Connects to backend API via local network IP address (e.g., http://192.168.1.100:3000)
- Hot reloading enabled for rapid development and testing

**Backend Server:**
- Runs on developer machine (localhost) via npm run dev command using nodemon
- Listens on port 3000 for HTTP requests
- Accesses MongoDB on localhost:27017
- Serves uploaded files from backend/uploads/ directory via Express static middleware

**Admin Dashboard:**
- Runs on developer machine via npm run dev command using Vite dev server
- Listens on port 5174 for HTTP requests
- Connects to backend API via http://localhost:3000/api configured in .env file
- Hot module replacement (HMR) enabled for rapid development

**Database:**
- MongoDB 7.0 running locally via mongod process or MongoDB Compass
- Database name: betterstreets
- No authentication required for local testing (default MongoDB setup)
- Data persists in local MongoDB data directory

**Network Configuration:**
- All three components (mobile, backend, dashboard) must be on same local network for testing
- Firewall rules allow inbound connections on ports 3000 (backend) and 5174 (dashboard)
- Mobile app accesses backend via local IP address, not localhost (Android emulator networking limitation)

**No Production Deployment:**
- System intended for local testing and capstone evaluation only
- No cloud hosting (Railway, Render, DigitalOcean)
- No MongoDB Atlas cloud database
- No Google Play Store distribution
- No domain name or public DNS configuration
- No SSL/TLS certificates for HTTPS

---

**End of Section 3.1.3**
