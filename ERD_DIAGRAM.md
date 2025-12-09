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
┌─────────────────────────────┐      ┌─────────────────────────────┐
│         REPORT              │      │      ANNOUNCEMENT           │
│    (report collection)      │      │ (announcements collection)  │
├─────────────────────────────┤      ├─────────────────────────────┤
│ PK  _id: ObjectId           │      │ PK  _id: ObjectId           │
│     title: String           │      │     title: String           │
│     description: String     │      │     content: String         │
│ FK  category: String        │──┐   │     category: String (enum) │
│       (references CATEGORY) │  │   │       - General             │
│                             │  │   │       - Emergency           │
│     location: Object        │  │   │       - Event               │
│       - type: "Point"       │  │   │       - Maintenance         │
│       - coordinates: [lng,lat] │   │       - Update              │
│       - address: String     │  │   │                             │
│                             │  │   │     priority: String (enum) │
│     photos: Array of Object │  │   │       - low                 │
│       - filename: String    │  │   │       - normal              │
│       - path: String        │  │   │       - high                │
│       - uploadedAt: Date    │  │   │                             │
│                             │  │   │ FK  author: ObjectId        │
│     status: String (enum)   │  │   │     isActive: Boolean       │
│       - pending             │  │   │     expiresAt: Date         │
│       - in-progress         │  │   │     createdAt: Date         │
│       - resolved            │  │   └─────────────────────────────┘
│       - rejected            │  │                 ▲
│                             │  │                 │ *
│     priority: String (enum) │  │                 │ creates
│       - low                 │  │                 │ 1
│       - medium              │  │                 │
│       - high                │  └──────────────────
│       - urgent              │
│                             │
│ FK  reporter: ObjectId      │
│ FK  assignedTo: ObjectId    │───────────┐
│     resolvedAt: Date        │           │
│     adminNotes: String      │           │
│     upvotes: [ObjectId]     │           │
│     createdAt: Date         │           │
│     updatedAt: Date         │           │
└─────────────────────────────┘           │
      │         │                          │
      │ 1       │ 1                        │ 1
      │         │                          │
      ▼         ▼                          ▼
   has many  tracked by            creates assignment
   status    status                       │
   history   history                      │ *
      │         │                          │
      │ *       │ *                        ▼
      │         │                 ┌─────────────────────────────┐
      ▼         ▼                 │      ASSIGNMENT             │
┌─────────────────────────────┐  │  (assignments collection)   │
│    STATUS_HISTORY           │  ├─────────────────────────────┤
│ (status_history collection) │  │ PK  _id: ObjectId           │
├─────────────────────────────┤  │ FK  report_id: ObjectId     │
│ PK  _id: ObjectId           │  │ FK  worker_id: ObjectId     │
│ FK  report_id: ObjectId     │  │ FK  assigned_by: ObjectId   │
│     status: String (enum)   │  │     assigned_at: Date       │
│       - pending             │  │     completed_at: Date      │
│       - in-progress         │  │     notes: String           │
│       - resolved            │  │     status: String (enum)   │
│       - rejected            │  │       - assigned            │
│ FK  updated_by: ObjectId    │  │       - in-progress         │
│     updated_at: Date        │  │       - completed           │
│     remarks: String         │  │       - cancelled           │
│     previous_status: String │  └─────────────────────────────┘
└─────────────────────────────┘
                                          
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
- Includes geolocation (GeoJSON format)
- Multiple photo attachments
- Simple status tracking (pending/resolved/rejected)
- **REMOVED**: assignedTo, progressUpdates

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

### 2. USER ↔ REPORT (Many-to-Many) - Upvotes
- **Relationship**: Users can upvote multiple reports
- **Type**: M:N (Many-to-Many)
- **Implementation**: Array of ObjectIds in `upvotes` field
- **Description**: Community engagement feature

### 3. USER → ANNOUNCEMENT (One-to-Many)
- **Relationship**: Admin creates many announcements
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `author` in ANNOUNCEMENT references `_id` in USER
- **Description**: Only admins can create announcements

### 4. CATEGORY → REPORT (One-to-Many)
- **Relationship**: One category can be used by many reports
- **Type**: 1:N (One-to-Many)
- **Reference**: `category` in REPORT references `category_name` in CATEGORY
- **Description**: Auto-classification by keywords

---

## Relationships Explained

### 1. USER → REPORT (One-to-Many)
- **Relationship**: One user can create many reports
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `reporter` in REPORT references `_id` in USER
- **Description**: Every report must have a reporter (the user who created it)

### 2. USER → REPORT (Assigned) (One-to-Many)
- **Relationship**: One staff member can be assigned many reports
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `assignedTo` in REPORT references `_id` in USER
- **Description**: Admin can assign reports to staff members for handling

### 3. USER ↔ REPORT (Many-to-Many)
- **Relationship**: Users can upvote multiple reports, reports can have multiple upvotes
- **Type**: M:N (Many-to-Many)
- **Implementation**: Array of ObjectIds in `upvotes` field in REPORT
- **Description**: Community members can upvote reports to show priority

### 4. USER → ANNOUNCEMENT (One-to-Many)
- **Relationship**: One staff/admin can create many announcements
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `author` in ANNOUNCEMENT references `_id` in USER
- **Description**: Only staff and admin can create announcements

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
- `status`: Enum (pending, resolved, rejected) - **ONLY 3 STATUSES**
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
| Report Statuses | 4 (pending, in-progress, resolved, rejected) | **3 (pending, resolved, rejected)** |
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
- ❌ **in-progress status** - Simplified to pending/resolved/rejected

---

## Field Constraints

### USER:
- `email`: Required, Unique, Lowercase
- `password`: Required, Min length: 6, Hashed
- `role`: Enum (resident, barangay_staff, admin)

### REPORT:
- `title`: Required, Max length: 200
- `description`: Required, Max length: 2000
- `category`: Required, Must be from predefined list
- `location.coordinates`: Required, [longitude, latitude]
- `status`: Enum (pending, in-progress, resolved, rejected)
- `reporter`: Required, Must reference valid USER

### ANNOUNCEMENT:
- `title`: Required, Max length: 200
- `content`: Required
- `category`: Enum (General, Emergency, Event, Maintenance, Update)
- `author`: Required, Must reference valid USER (staff/admin)

---

## Sample Data Flow

### Report Creation Flow:
```
1. User (reporter) logs in
2. User creates report with:
   - Title, description, category
   - GPS coordinates
   - Photos (uploaded files)
3. System creates REPORT document:
   - reporter = User's _id
   - status = "pending"
   - priority = "medium"
   - photos stored in uploads/
4. Report appears in admin dashboard
5. Admin assigns report to staff member:
   - assignedTo = Staff's _id
6. Staff updates status:
   - status = "in-progress"
   - adminNotes = "Scheduled for repair"
7. After completion:
   - status = "resolved"
   - resolvedAt = current timestamp
```

### Upvote Flow:
```
1. User views report
2. User clicks upvote
3. System checks if User's _id exists in report.upvotes[]
4. If not exists: Add User's _id to upvotes[]
5. If exists: Remove User's _id from upvotes[]
6. Return updated upvote count
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
  status String
  priority String
  reporter ObjectId [ref: > User._id]
  assignedTo ObjectId [ref: > User._id]
  resolvedAt Date
  adminNotes String
  upvotes Array
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

Ref: Report.upvotes *> User._id
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
   - RESOLVED (issue fixed)
   - REJECTED (invalid)
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
