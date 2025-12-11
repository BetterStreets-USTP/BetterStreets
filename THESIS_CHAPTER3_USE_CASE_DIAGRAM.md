# Chapter III - Use Case Diagram
## Section 3.1.4

---

### 3.1.4. Use Case Diagram

---

#### 3.1.4.1. Use Case Diagram Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│                              BETTERSTREETS USE CASE DIAGRAM                             │
│                                                                                         │
│                                                                                         │
│                                                                                         │
│   ┌──────────┐                                                        ┌──────────┐     │
│   │          │                                                        │          │     │
│   │ RESIDENT │                                                        │  ADMIN   │     │
│   │  (User)  │                                                        │ (Staff)  │     │
│   │          │                                                        │          │     │
│   └─────┬────┘                                                        └────┬─────┘     │
│         │                                                                  │           │
│         │                                                                  │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│   0. Register Account    │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │   0.1 Validate           │                     │           │
│         │                │   Credentials            │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │   0.2 Hash Password      │                     │           │
│         │                │   (bcryptjs)             │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │   0.3 Create User        │                     │           │
│         │                │   Record                 │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│      1. Login            │◄────────────────────┘           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │   1.5 Authenticate       │                     │           │
│         │                │   (JWT Verification)     │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│   2. Submit Report       │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │  2.1 Attach Photos       │                     │           │
│         │                │  (Up to 5 images)        │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │  2.2 Capture GPS         │                     │           │
│         │                │  Location                │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │  2.3 Auto-Categorize     │                     │           │
│         │                │  (Keyword-based)         │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│  3. Track Report Status  │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │  3.1 View Status         │                     │           │
│         │                │  Timeline/History        │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│  4. View Notifications   │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                            │                                    │           │
│         │                            ▼ <<include>>                        │           │
│         │                ┌──────────────────────────┐                     │           │
│         │                │  4.1 Receive Push        │                     │           │
│         │                │  Notifications           │                     │           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│  5. View Announcements   │◄────────────────────┘           │
│         │                └──────────────────────────┘                     │           │
│         │                                                                 │           │
│         │                                                                 │           │
│         │                ┌──────────────────────────┐                     │           │
│         └───────────────►│  6. Manage Profile       │                     │           │
│                          └──────────────────────────┘                     │           │
│                                      │                                    │           │
│                                      ▼ <<include>>                        │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  6.1 Update Personal     │                     │           │
│                          │  Information             │                     │           │
│                          └──────────────────────────┘                     │           │
│                                                                            │           │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  7. Review Reports       │◄────────────────────┘           │
│                          └──────────────────────────┘                     │           │
│                                      │                                    │           │
│                                      ▼ <<include>>                        │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  7.1 Filter Reports      │                     │           │
│                          │  (Status/Category/Date)  │                     │           │
│                          └──────────────────────────┘                     │           │
│                                                                            │           │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  8. Update Report Status │◄────────────────────┘           │
│                          └──────────────────────────┘                     │           │
│                                      │                                    │           │
│                                      ▼ <<include>>                        │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  8.1 Add Remarks/Notes   │                     │           │
│                          └──────────────────────────┘                     │           │
│                                      │                                    │           │
│                                      ▼ <<include>>                        │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  8.2 Trigger Push        │                     │           │
│                          │  Notification to User    │                     │           │
│                          └──────────────────────────┘                     │           │
│                                                                            │           │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  9. Assign to Barangay   │◄────────────────────┘           │
│                          │  Unit (7 Departments)    │                                 │
│                          └──────────────────────────┘                                 │
│                                                                                        │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  10. Manage              │◄────────────────────┘           │
│                          │  Announcements           │                                 │
│                          └──────────────────────────┘                                 │
│                                      │                                                │
│                                      ▼ <<include>>                                    │
│                          ┌──────────────────────────┐                                 │
│                          │  10.1 Create             │                                 │
│                          │  Announcement            │                                 │
│                          └──────────────────────────┘                                 │
│                                      │                                                │
│                                      ▼ <<include>>                                    │
│                          ┌──────────────────────────┐                                 │
│                          │  10.2 Set Category &     │                                 │
│                          │  Priority                │                                 │
│                          └──────────────────────────┘                                 │
│                                                                                        │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  11. View Analytics      │◄────────────────────┘           │
│                          │  Dashboard               │                                 │
│                          └──────────────────────────┘                                 │
│                                      │                                                │
│                                      ▼ <<include>>                                    │
│                          ┌──────────────────────────┐                                 │
│                          │  11.1 View Report        │                                 │
│                          │  Statistics              │                                 │
│                          └──────────────────────────┘                                 │
│                                      │                                                │
│                                      ▼ <<include>>                                    │
│                          ┌──────────────────────────┐                                 │
│                          │  11.2 View Category      │                                 │
│                          │  Distribution            │                                 │
│                          └──────────────────────────┘                                 │
│                                                                                        │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  12. View Heatmap        │◄────────────────────┘           │
│                          │  (Geographic Reports)    │                                 │
│                          └──────────────────────────┘                                 │
│                                      │                                                │
│                                      ▼ <<include>>                                    │
│                          ┌──────────────────────────┐                                 │
│                          │  12.1 Filter by Status   │                                 │
│                          │  or Category             │                                 │
│                          └──────────────────────────┘                                 │
│                                                                                        │
│                                                                            │           │
│                          ┌──────────────────────────┐                     │           │
│                          │  13. Logout              │◄────────────────────┴───────────┘
│                          └──────────────────────────┘                                 
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Figure 3.2: BetterStreets Use Case Diagram**

---

#### 3.1.4.2. Use Case Summary Table

| **Use Case #** | **Use Case Name** | **Actor(s)** | **Description** |
|---|---|---|---|
| 0 | Register Account | Resident | New user creates an account to access the system |
| 0.1 | Validate Credentials | System | Checks if email/phone already exists in database |
| 0.2 | Hash Password | System | Securely hashes password using bcryptjs with 10 salt rounds |
| 0.3 | Create User Record | System | Saves new user account to MongoDB users collection with role "resident" |
| 1 | Login | Resident, Admin | User enters credentials to access the system |
| 1.5 | Authenticate (JWT Verification) | System | Validates credentials and generates JWT token for session |
| 2 | Submit Report | Resident | User creates and submits a community issue report |
| 2.1 | Attach Photos | Resident | User adds up to 5 photos to the report using device camera or gallery |
| 2.2 | Capture GPS Location | Resident | System automatically captures device location coordinates |
| 2.3 | Auto-Categorize | System | System suggests category based on keyword matching algorithm |
| 3 | Track Report Status | Resident | User views current status of submitted reports |
| 3.1 | View Status Timeline/History | Resident | User views complete history of status changes with timestamps and remarks |
| 4 | View Notifications | Resident | User accesses notification center to see status updates and announcements |
| 4.1 | Receive Push Notifications | Resident | User receives real-time push notifications on device when report status changes |
| 5 | View Announcements | Resident, Admin | User views official barangay announcements and updates |
| 6 | Manage Profile | Resident | User updates personal information and preferences |
| 6.1 | Update Personal Information | Resident | User edits name, phone number, address, and notification settings |
| 7 | Review Reports | Admin | Admin views all submitted reports with filtering and search capabilities |
| 7.1 | Filter Reports | Admin | Admin applies filters by status, category, priority, date range, or barangay unit |
| 8 | Update Report Status | Admin | Admin changes report status and documents actions taken |
| 8.1 | Add Remarks/Notes | Admin | Admin provides detailed explanation of status change or resolution |
| 8.2 | Trigger Push Notification | System | System automatically sends notification to reporter when status is updated |
| 9 | Assign to Barangay Unit | Admin | Admin assigns report to one of 7 designated barangay departments |
| 10 | Manage Announcements | Admin | Admin creates, edits, or deactivates barangay announcements |
| 10.1 | Create Announcement | Admin | Admin publishes new announcement with title, content, category, and priority |
| 10.2 | Set Category & Priority | Admin | Admin selects announcement category (General, Emergency, Event, Maintenance, Update) and priority level (low, normal, high) |
| 11 | View Analytics Dashboard | Admin | Admin accesses comprehensive statistics and performance metrics |
| 11.1 | View Report Statistics | Admin | Admin views total reports, status breakdown, and trend analysis |
| 11.2 | View Category Distribution | Admin | Admin analyzes report distribution across 8 categories |
| 12 | View Heatmap | Admin | Admin visualizes geographic distribution of reports on OpenStreetMap |
| 12.1 | Filter by Status or Category | Admin | Admin applies filters to focus on specific report types on heatmap |
| 13 | Logout | Resident, Admin | User terminates session and clears authentication token |

---

#### 3.1.4.3. Numbered Use Case Connection Guide

**For understanding the diagram connections:**

- **Number only (e.g., 1, 2, 3)**: Main use case directly accessible by actor
- **Decimal number (e.g., 1.5, 2.1, 8.2)**: Sub-use case or included functionality that is part of the parent use case
- **<<include>>**: Indicates mandatory relationship where the included use case must be executed as part of the base use case

**Resident Use Cases:**
- 0 → 0.1, 0.2, 0.3 (Register Account includes Validate Credentials, Hash Password, Create User Record)
- 1 → 1.5 (Login includes Authentication)
- 2 → 2.1, 2.2, 2.3 (Submit Report includes Attach Photos, Capture GPS, Auto-Categorize)
- 3 → 3.1 (Track Report Status includes View Status Timeline)
- 4 → 4.1 (View Notifications includes Receive Push Notifications)
- 5 (View Announcements - shared with Admin)
- 6 → 6.1 (Manage Profile includes Update Personal Information)

**Admin Use Cases:**
- 1 → 1.5 (Login includes Authentication - shared with Resident)
- 5 (View Announcements - shared with Resident)
- 7 → 7.1 (Review Reports includes Filter Reports)
- 8 → 8.1, 8.2 (Update Report Status includes Add Remarks, Trigger Push Notification)
- 9 (Assign to Barangay Unit)
- 10 → 10.1, 10.2 (Manage Announcements includes Create Announcement, Set Category & Priority)
- 11 → 11.1, 11.2 (View Analytics includes View Report Statistics, View Category Distribution)
- 12 → 12.1 (View Heatmap includes Filter by Status or Category)
- 13 (Logout - shared with Resident)

---

#### 3.1.4.4. Actors and Use Cases

**Resident (User)**

The Resident represents community members of Barangay Camaman-an who use the BetterStreets Android mobile application to report local issues and monitor their progress. This actor interacts with the system to submit georeferenced reports with photographic evidence, receive real-time status updates, and track report resolution through a transparent status timeline. Residents must register and authenticate to access the system, ensuring accountability and enabling personalized report tracking.

**Key Use Cases:**

- **Register Account (Use Case 0)** – Create a personal user account with name, email, phone, and address to access the reporting system. The system validates credentials, hashes passwords using bcryptjs with 10 salt rounds, and stores the user record in MongoDB with role "resident".

- **Login (Use Case 1)** – Authenticate credentials to securely access the mobile application. The system verifies credentials and generates a JWT token with 24-hour expiration for session management.

- **Submit Report (Use Case 2)** – Create and submit a community issue report with title (max 200 characters), description (max 2000 characters), and category selection. Includes mandatory attachment of photos (up to 5 images via expo-image-picker), automatic GPS location capture (expo-location with permission handling), and keyword-based auto-categorization that suggests the most appropriate category from 8 predefined options.

- **Track Report Status (Use Case 3)** – Monitor the current status (pending, in-progress, resolved, rejected) of submitted reports and view the complete status timeline showing all status changes with timestamps, assigned barangay unit, admin remarks, and resolution details for full transparency.

- **View Notifications (Use Case 4)** – Access the in-app notification center to see all status updates and announcements with unread/read tracking. Includes receiving real-time push notifications via Expo Push Notification Service when report status changes, delivering updates even when the app is closed.

- **View Announcements (Use Case 5)** – Read official barangay announcements including general updates, emergency alerts, event notifications, maintenance schedules, and system updates categorized by type and priority level (low, normal, high).

- **Manage Profile (Use Case 6)** – Update personal information including name, phone number, address, and notification preferences through a dedicated settings screen.

- **Logout (Use Case 13)** – Securely exit the system by clearing the JWT token from AsyncStorage to prevent unauthorized access and protect user data.

---

**Barangay Staff/Admin**

The Barangay Staff/Admin represents authorized barangay personnel who use the web-based administrative dashboard to manage reports, oversee resolution workflows, publish announcements, and monitor community issue patterns. This actor is responsible for validating submitted reports, updating status with detailed remarks, assigning reports to appropriate barangay units, and ensuring timely resolution. Admin accounts are created by the system administrator (not through self-registration) to maintain security and control over administrative access.

**Key Use Cases:**

- **Login (Use Case 1)** – Authenticate admin credentials to securely access the web-based administrative dashboard using JWT token-based authentication.

- **Review Reports (Use Case 7)** – View all submitted community issues in tabular or card layout with comprehensive details including title, description, category, priority, status, reporter information, submission date, photo gallery, and location map. Includes filtering reports by status (pending, in-progress, resolved, rejected), category (8 options), priority level, date range, or assigned barangay unit to quickly locate specific reports.

- **Update Report Status (Use Case 8)** – Change report status via dropdown selection (pending → in-progress → resolved, or pending → rejected) and add mandatory remarks explaining the action taken, work performed, or resolution details. Status updates are automatically logged in the statusHistory array with timestamp, admin identity, assigned barangay unit, and remarks. The system automatically triggers a push notification to the reporter informing them of the status change.

- **Assign to Barangay Unit (Use Case 9)** – Designate the responsible barangay department from 7 predefined units (Health Services, Infrastructure, Public Safety, Environment, Social Services, Education, Administrative Services) to handle the specific report based on category and required expertise.

- **Manage Announcements (Use Case 10)** – Create and publish official barangay announcements visible to all residents in the mobile app. Includes setting announcement title, rich text content, category (General, Emergency, Event, Maintenance, Update), priority level (low, normal, high), and optional expiration date for automatic deactivation.

- **View Analytics Dashboard (Use Case 11)** – Access comprehensive statistics and performance metrics including total report count, status breakdown percentages, category distribution pie chart, priority analysis, trend visualization over time periods, and barangay unit performance metrics showing resolution rates and average response times for data-driven decision-making.

- **View Heatmap (Use Case 12)** – Visualize the geographic distribution of reports on an interactive OpenStreetMap using React Leaflet with color-coded markers (green for resolved, yellow for in-progress, red for pending, gray for rejected). Supports filtering by status and category to identify problem areas, applying geographic clustering for better visualization at zoomed-out levels, and clicking markers to view report details in popup windows.

- **Manage Profile** – Update admin account information and preferences through the settings interface.

- **Logout (Use Case 13)** – Securely exit the administrative dashboard by clearing the JWT token from sessionStorage to prevent unauthorized access.

---

**System (Automated Processes)**

The System represents automated background operations that support the BetterStreets platform without direct user interaction. These processes ensure secure authentication, accurate data classification, seamless offline functionality, comprehensive audit tracking, and real-time communication between residents and barangay staff.

**Key Use Cases:**

- **Authenticate Users (Use Case 1.5)** – Validate login credentials against MongoDB users collection, verify password hash using bcryptjs comparison, generate JWT token with 24-hour expiration containing user ID and role, and return authentication token for secure session management.

- **Validate Credentials (Use Case 0.1)** – During registration, check if the provided email or phone number already exists in the database to prevent duplicate accounts and ensure unique user identification.

- **Hash Password (Use Case 0.2)** – Securely hash user passwords using bcryptjs with 10 salt rounds before storing in the database, protecting user credentials from unauthorized access even if database is compromised.

- **Create User Record (Use Case 0.3)** – Save new user account to MongoDB users collection with role set to "resident", timestamps for account creation, and optional fields for phone and address.

- **Auto-Categorize Reports (Use Case 2.3)** – Implement keyword-based classification algorithm that scans report title and description for predefined keywords associated with 8 categories (Roads, Drainage, Street Lights, Waste Management, Public Safety, Health, Utilities, Other), calculates scores based on keyword matches, and suggests the highest-scoring category or defaults to "Other" if no matches found.

- **Capture GPS Location (Use Case 2.2)** – Automatically request location permission via expo-location, capture current device coordinates (latitude, longitude) with accuracy metadata, format as GeoJSON Point for MongoDB 2dsphere geospatial indexing, and perform reverse geocoding to display human-readable address to user.

- **Store Offline Reports** – Use AsyncStorage to cache report data locally when internet connectivity is unavailable, preserving form fields, photo file paths, and location coordinates. Automatically detect connection restoration and synchronize pending drafts to backend server, removing from local storage upon successful submission.

- **Log Status History (Use Case 8.2 component)** – Automatically create statusHistory array entries in the reports collection whenever status changes occur, logging timestamp, new status value, assigned barangay unit, admin remarks, and admin user reference for complete audit trail and transparency.

- **Trigger Push Notifications (Use Case 8.2)** – Retrieve reporter's pushToken from users collection, construct notification message including report title, new status, and admin remarks, send notification via expo-server-sdk to Expo Push Notification Service, handle delivery receipts, and log errors for failed deliveries.

- **Support Heatmap Data Processing (Use Case 12.1 component)** – Execute geospatial queries using MongoDB 2dsphere index on report locations, retrieve coordinates and status for filtered reports, format data for React Leaflet rendering, and enable efficient radius-based queries for geographic clustering.

---

BetterStreets integrates a complete community issue reporting and resolution workflow within a unified platform. The system employs a numbered use case structure (0-13) where main use cases are directly accessible by actors (represented by whole numbers) and sub-use cases represent included functionalities (represented by decimal numbers such as 0.1, 2.3, 8.2) that are automatically executed as part of parent use cases. Residents handle georeferenced reporting and real-time monitoring through the Android mobile application, while Barangay Staff manage validation, assignment to appropriate barangay units, status updates, and resolution tracking through the web-based dashboard. Automated system functions ensure secure JWT-based authentication, bcryptjs password hashing, keyword-based auto-categorization, AsyncStorage offline caching, comprehensive statusHistory audit logging, and real-time push notification delivery, supporting transparent and efficient barangay-level community issue management with full accountability and traceability.

---

**End of Section 3.1.4**
