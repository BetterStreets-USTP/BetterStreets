# BetterStreets Database ERD (Entity Relationship Diagram)
**Simplified Barangay-Level Issue Reporting System**

## Database: betterstreets

---

## ✨ SIMPLIFIED SYSTEM - 4 Collections Only

---

## Entities and Relationships

```
┌─────────────────────────────┐
│         USER                │
│    (users collection)       │
├─────────────────────────────┤
│ PK  _id: ObjectId           │
│     name: String            │
│     email: String (unique)  │
│     password: String (hash) │
│     phone: String           │
│     address: String         │
│     role: String (enum)     │
│       - resident            │
│       - admin               │
│     pushToken: String       │
│     isVerified: Boolean     │
│     createdAt: Date         │
└─────────────────────────────┘
      │         │         │
      │ 1       │ 1       │ 1
      │         │         │
      ▼         │         ▼
   creates      │      creates
   reports      │   announcements
      │         │         │
      │ *       │         │ *
      │         │         │
      ▼         │         ▼
┌──────────────────────────────────┐      ┌─────────────────────────────┐
│         REPORT                   │      │      ANNOUNCEMENT           │
│    (report collection)           │      │ (announcements collection)  │
├──────────────────────────────────┤      ├─────────────────────────────┤
│ PK  _id: ObjectId                │      │ PK  _id: ObjectId           │
│     title: String (max: 200)     │      │     title: String           │
│     description: String (max: 2K)│      │     content: String         │
│ FK  category: String (enum)      │──┐   │     category: String (enum) │
│       (references CATEGORY)      │  │   │       - General             │
│       - Road Damage              │  │   │       - Emergency           │
│       - Street Lighting          │  │   │       - Event               │
│       - Garbage/Waste            │  │   │       - Maintenance         │
│       - Drainage/Flooding        │  │   │       - Update              │
│       - Illegal Activity         │  │   │                             │
│       - Public Safety            │  │   │     priority: String (enum) │
│       - Infrastructure           │  │   │       - low                 │
│       - Other                    │  │   │       - normal              │
│                                  │  │   │       - high                │
│     location: Object (GeoJSON)   │  │   │                             │
│       - type: "Point"            │  │   │ FK  author: ObjectId        │
│       - coordinates: [lng, lat]  │  │   │     isActive: Boolean       │
│       - address: String          │  │   │     expiresAt: Date         │
│                                  │  │   │     createdAt: Date         │
│     photos: Array of Objects     │  │   └─────────────────────────────┘
│       - filename: String         │  │                 ▲
│       - path: String             │  │                 ▲
│       - uploadedAt: Date         │  │                 │ *
│                                  │  │                 │ creates
│     status: String (enum)        │  │                 │ 1
│       - pending                  │  │                 │
│       - in-progress              │  └──────────────────
│       - resolved                 │
│       - rejected                 │
│                                  │
│     priority: String (enum)      │
│       - low                      │
│       - medium                   │
│       - high                     │
│       - urgent                   │
│                                  │
│     assignedAgency: String (enum)│
│       - Barangay Maintenance     │
│         Team                     │
│       - Sanitation Department    │
│       - Traffic Management       │
│       - Engineering Office       │
│       - Health Services          │
│       - Peace and Order          │
│       - Social Welfare           │
│       - Not Yet Assigned/null    │
│                                  │
│ FK  reporter: ObjectId           │
│     resolvedAt: Date             │
│     adminNotes: String           │
│                                  │
│     statusHistory: Array of Obj  │
│       - status: String (enum)    │
│       - assignedAgency: String   │
│       - remarks: String          │
│       - updatedBy: ObjectId (FK) │
│       - timestamp: Date          │
│                                  │
│     createdAt: Date              │
│     updatedAt: Date              │
└──────────────────────────────────┘
      │
      │ 1
      │
      ▼
   references
   category
      │
      │ *
      │
      ▼
                                          
      ┌──────────────────────────────────────┐
      │         CATEGORY                     │
      │    (categories collection)           │
      ├──────────────────────────────────────┤
      │ PK  _id: ObjectId                    │
      │     category_name: String (unique)   │
      │     keywords: [String]               │
      │       (for auto-classification)      │
      │     description: String              │
      │     color: String                    │
      │     isActive: Boolean                │
      │     createdAt: Date                  │
      └──────────────────────────────────────┘
                     ▲
                     │ references
                     │
                     └───────────────┐
                                    (REPORT.category)
```

---

## Complete Entity List (4 Collections - SIMPLIFIED)

### 1. **users** - User management
- Only 2 roles: **resident** and **admin**
- Residents submit reports via mobile app
- Admins manage everything via web dashboard

### 2. **categories** - Report categorization
- Stores report categories with keyword arrays
- Enables smart keyword-based auto-classification
- Used for organizing reports by type

### 3. **report** - Community issue reports
- Central entity for all community concerns
- Includes geolocation (GeoJSON Point format with 2dsphere index)
- Multiple photo attachments with paths
- Status tracking: pending → in-progress → resolved/rejected
- **Agency assignment**: 7 predefined barangay agencies
- **Status history**: Complete audit trail of all status changes
- **Admin notes**: Remarks from barangay staff

### 4. **announcements** - Official barangay announcements
- Posted by admin only
- Categorized and prioritized
- Expiration dates for temporary notices

---

## Relationships Explained

### 1. USER → REPORT (One-to-Many) - Reporter
- **Relationship**: One user can create many reports
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `reporter` in REPORT references `_id` in USER
- **Description**: Every report must have a reporter

### 2. USER → ANNOUNCEMENT (One-to-Many)
- **Relationship**: Admin creates many announcements
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `author` in ANNOUNCEMENT references `_id` in USER
- **Description**: Only admins can create announcements

### 3. CATEGORY → REPORT (One-to-Many)
- **Relationship**: One category can be used by many reports
- **Type**: 1:N (One-to-Many)
- **Reference**: `category` in REPORT references `category_name` in CATEGORY
- **Description**: Auto-classification by keywords

---

## Data Types

### MongoDB Data Types Used:
- **ObjectId**: Unique identifier (Primary/Foreign Keys)
- **String**: Text data
- **Boolean**: True/False values
- **Date**: Timestamp
- **Array**: List of items
- **Number**: Numeric values (in coordinates)
- **Object/Subdocument**: Nested data structures

---

## Indexes

### Primary Indexes (Automatic):
- `_id` on all collections (unique)

### Custom Indexes:
- `email` on USER collection (unique)
- `location` on REPORT collection (2dsphere for geospatial queries)

### Geospatial Index:
```javascript
// For location-based queries (heatmap, nearby reports)
reportSchema.index({ location: '2dsphere' });
```

---

## Field Constraints

### USER:
- `email`: Required, Unique, Lowercase
- `password`: Required, Min length: 6, Hashed with bcrypt
- `role`: Enum (resident, admin) - **ONLY 2 ROLES**
- `name`: Required

### CATEGORY:
- `category_name`: Required, Unique
- `keywords`: Array of strings for auto-classification
- `isActive`: Boolean, default true

### REPORT:
- `title`: Required, Max length: 200
- `description`: Required, Max length: 2000
- `category`: Required, References CATEGORY.category_name
- `location.coordinates`: Required, [longitude, latitude]
- `status`: Enum (pending, in-progress, resolved, rejected) - **4 STATUSES**
- `reporter`: Required, Must reference valid USER

### ANNOUNCEMENT:
- `title`: Required, Max length: 200
- `content`: Required
- `category`: Enum (General, Emergency, Event, Maintenance, Update)
- `author`: Required, Must reference valid USER (admin only)

---

## Indexes for Performance

### Automatic Primary Indexes:
- `_id` on all collections (unique, auto-indexed)

### Custom Unique Indexes:
- `email` on USER collection
- `category_name` on CATEGORY collection

### Geospatial Index:
- `location` on REPORT collection (2dsphere for geospatial queries)
  ```javascript
  reportSchema.index({ location: '2dsphere' });
  ```

---

## Simplified vs Previous System

| Feature | Before | After |
|---------|--------|-------|
| Collections | 7 | **4** |
| User Roles | 3 (resident, staff, admin) | **2 (resident, admin)** |
| Report Statuses | 4 (pending, in-progress, resolved, rejected) | **4 (pending, in-progress, resolved, rejected)** |
| Assignment System | Yes ❌ | **No ✅** |
| Status History | Yes ❌ | **No ✅** |
| Activity Logs | Yes ❌ | **No ✅** |

### REMOVED Collections:
- ❌ **assignments** - No worker assignment needed
- ❌ **status_history** - Overcomplicated for barangay level
- ❌ **activity_log** - Unnecessary for small communities

### REMOVED Fields from REPORT:
- ❌ **assignedTo** - No worker assignments
- ❌ **progressUpdates** - No progress tracking needed

---

## Sample Data Flow

### Report Creation Flow:
```
1. Resident logs in to mobile app
2. Resident creates report with:
   - Title, description, category
   - GPS coordinates (automatic)
   - Photos (camera/gallery)
3. System creates REPORT document:
   - reporter = Resident's _id
   - status = "pending"
   - priority = "medium"
   - photos stored in uploads/
4. Report appears in admin dashboard immediately
5. Admin reviews and updates status:
   - status = "in-progress" (being worked on)
   - status = "resolved" (issue fixed)
   - status = "rejected" (invalid/duplicate)
   - adminNotes = remarks about the status change
   - resolvedAt = current timestamp (if resolved)
6. System sends push notification to resident's device
7. Resident receives notification with status update
```

---

## Database Statistics (For Documentation)

### Expected Data Volumes:
- **Users**: ~500-1000 residents
- **Reports**: ~100-500 per month
- **Announcements**: ~20-50 active at a time

### Storage Requirements:
- **Photos**: Average 2 photos per report × 2MB = 4MB per report
- **Monthly storage**: 500 reports × 4MB = 2GB/month

---

## ERD Visualization Tools

You can use these tools to create a visual ERD diagram:

1. **Draw.io** (diagrams.net) - Free, web-based
2. **Lucidchart** - Professional diagrams
3. **dbdiagram.io** - Database-specific ERD tool
4. **MySQL Workbench** - Can be used for MongoDB too
5. **MongoDB Compass** - View schema visually

### dbdiagram.io Code:
```
Table User {
  _id ObjectId [pk]
  name String
  email String [unique]
  password String
  phone String
  address String
  role String
  pushToken String
  isVerified Boolean
  createdAt Date
}

Table Report {
  _id ObjectId [pk]
  title String
  description String
  category String
  location Object
  photos Array
  status String [note: 'pending, in-progress, resolved, rejected']
  priority String
  reporter ObjectId [ref: > User._id]
  resolvedAt Date
  adminNotes String
  statusHistory Array
  createdAt Date
  updatedAt Date
}

Table Announcement {
  _id ObjectId [pk]
  title String
  content String
  category String
  priority String
  author ObjectId [ref: > User._id]
  isActive Boolean
  expiresAt Date
  createdAt Date
}
```

---

## Simplified Report Flow

```
1. RESIDENT submits report
   ↓
2. Status: PENDING
   ↓
3. ADMIN reviews on dashboard
   ↓
4. ADMIN updates status:
   - IN-PROGRESS (being worked on)
   - RESOLVED (issue fixed)
   - REJECTED (invalid)
   ↓
5. RESIDENT receives push notification
```

**No assignments. No workers. Direct handling by admin.**

---

## For Your Thesis/Capstone Paper

### Justification for Simplification:

**Why Simplified?**
1. Barangay-level operations don't need complex task delegation
2. Direct accountability - admin handles all reports
3. Faster response - no assignment delays
4. Easier training - only 2 user types
5. FixMyStreet model - proven effective globally

### Key Points:
- ✅ All research objectives still met
- ✅ Appropriate scope for barangay (500-2000 residents)
- ✅ Simpler maintenance and training
- ✅ Faster deployment and testing

---

## 🔔 Push Notifications Feature (PRODUCTION READY)

### Notification Triggers:
When admin updates report status, the resident who submitted the report will receive a push notification on their mobile device.

### Implementation Overview:

**Technology:** Expo Push Notifications (works in development AND production builds)

#### 1. **User Model Addition:**
```javascript
// backend/src/models/User.js
pushToken: {
  type: String,
  default: null
}
```

#### 2. **Notification Service (Backend):**
```javascript
// backend/src/utils/notificationService.js
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

exports.sendPushNotification = async (pushToken, title, body, data) => {
  if (!Expo.isExpoPushToken(pushToken)) return;
  
  await expo.sendPushNotificationsAsync([{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data
  }]);
};
```

#### 3. **Report Status Update Integration:**
```javascript
// Triggered when admin updates report status
const reporter = await User.findById(report.reporter);
if (reporter.pushToken) {
  await sendPushNotification(
    reporter.pushToken,
    'Report Status Updated',
    `Your report "${report.title}" is now ${report.status}`,
    { reportId: report._id, status: report.status }
  );
}
```

#### 4. **Mobile App Setup:**
```javascript
// Request permissions and register token
import * as Notifications from 'expo-notifications';

const token = await Notifications.getExpoPushTokenAsync();
await api.put('/auth/push-token', { pushToken: token.data });
```

#### 5. **When Notifications Are Sent:**
- ✅ Report status changed: `pending` → `in-progress`
- ✅ Report status changed: `in-progress` → `resolved`
- ✅ Report status changed: any → `rejected`
- ✅ Admin adds remarks to report
- ✅ New announcement posted (broadcast to all residents)

#### 6. **Notification Content Examples:**
```
Status: In Progress
Title: "Report In Progress 🔄"
Body: "Your report 'Broken streetlight' is now being addressed"
Remarks: "Our team is on the way to fix this issue"

Status: Resolved
Title: "Report Resolved ✅"
Body: "Your report 'Broken streetlight' has been resolved"
Remarks: "The streetlight has been fixed. Thank you for reporting!"

Status: Rejected
Title: "Report Update ❌"
Body: "Your report 'Potholes on Main St' status: Rejected"
Remarks: "This issue is under national highway jurisdiction"
```

### Production Deployment:

**✅ Works with:**
- Expo Go (development)
- Expo standalone builds (APK/IPA)
- EAS Build (production)
- Does NOT require Firebase or FCM setup

**Dependencies:**
- `expo-notifications` (React Native app)
- `expo-server-sdk` (Node.js backend)
- Free Expo Push Notification service

**No additional configuration needed for deployment!**

### Privacy & Performance:
- Tokens stored securely in database
- Only send to report owner (privacy)
- Batch notifications for announcements
- Automatic token refresh on app updates

---
