# BetterStreets Database ERD (Entity Relationship Diagram)
**Aligned with Research Paper Chapter 3.6**

## Database: betterstreets

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
│       - barangay_staff      │
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
      │         **NEW**                      │
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

      ┌──────────────────────────────────────┐
      │      ACTIVITY_LOG                    │
      │  (activity_log collection)           │
      │         **NEW**                      │
      ├──────────────────────────────────────┤
      │ PK  _id: ObjectId                    │
      │ FK  user_id: ObjectId                │
      │     action: String                   │
      │     action_type: String (enum)       │
      │       - create, update, delete       │
      │       - login, logout, assign, view  │
      │     target_type: String              │
      │     target_id: ObjectId              │
      │     ip_address: String               │
      │     user_agent: String               │
      │     details: Object                  │
      │     created_at: Date                 │
      └──────────────────────────────────────┘
                     ▲
                     │ logs all
                     │ user actions
                     │ *
                     │
                     └── USER (performs actions)
```

---

## Complete Entity List (7 Collections - Aligned with Paper Chapter 3.6)

### 1. **users** - User management
- Stores all system users (residents, barangay staff, admin)
- Handles authentication and role-based access

### 2. **categories** - Report categorization ✨ NEW
- Stores report categories with keyword arrays
- Enables smart keyword-based auto-classification
- Supports rule-based categorization (Chapter 2.8)

### 3. **report** - Community issue reports
- Central entity for all community concerns
- Includes geolocation (GeoJSON format)
- Multiple photo attachments
- Status tracking

### 4. **assignments** - Worker task delegation ✨ NEW
- Tracks which worker is assigned to which report
- Assignment lifecycle (assigned → in-progress → completed)
- Notes and completion timestamps

### 5. **status_history** - Report timeline tracking ✨ NEW
- Complete audit trail of status changes
- Who changed, when, and why (remarks)
- Enables report timeline visualization

### 6. **announcements** - Official barangay announcements
- Posted by admin/staff
- Categorized and prioritized
- Expiration dates

### 7. **activity_log** - System audit trail ✨ NEW
- Logs all user actions in the system
- Tracks create, update, delete, login, logout, assign operations
- IP address and user agent for security
- Supports accountability and monitoring

---

## Relationships Explained

### 1. USER → REPORT (One-to-Many) - Reporter
- **Relationship**: One user can create many reports
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `reporter` in REPORT references `_id` in USER
- **Description**: Every report must have a reporter (the user who created it)

### 2. USER → REPORT (One-to-Many) - Assigned Worker
- **Relationship**: One staff member can be assigned many reports
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `assignedTo` in REPORT references `_id` in USER
- **Description**: Admin can assign reports to staff members for handling

### 3. USER ↔ REPORT (Many-to-Many) - Upvotes
- **Relationship**: Users can upvote multiple reports, reports can have multiple upvotes
- **Type**: M:N (Many-to-Many)
- **Implementation**: Array of ObjectIds in `upvotes` field in REPORT
- **Description**: Community members can upvote reports to show priority

### 4. USER → ANNOUNCEMENT (One-to-Many)
- **Relationship**: One staff/admin can create many announcements
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `author` in ANNOUNCEMENT references `_id` in USER
- **Description**: Only staff and admin can create announcements

### 5. REPORT → STATUS_HISTORY (One-to-Many) ✨ NEW
- **Relationship**: One report has many status updates
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `report_id` in STATUS_HISTORY references `_id` in REPORT
- **Description**: Complete timeline of status changes for audit trail

### 6. REPORT → ASSIGNMENT (One-to-Many) ✨ NEW
- **Relationship**: One report can be assigned to one worker (reassignment creates new entry)
- **Type**: 1:N (One-to-Many)
- **Foreign Keys**: 
  - `report_id` in ASSIGNMENT references `_id` in REPORT
  - `worker_id` in ASSIGNMENT references `_id` in USER
  - `assigned_by` in ASSIGNMENT references `_id` in USER
- **Description**: Tracks worker assignments and completion

### 7. CATEGORY → REPORT (One-to-Many) ✨ NEW
- **Relationship**: One category can be used by many reports
- **Type**: 1:N (One-to-Many)
- **Reference**: `category` in REPORT references `category_name` in CATEGORY
- **Description**: Reports are classified into predefined categories with keywords

### 8. USER → ACTIVITY_LOG (One-to-Many) ✨ NEW
- **Relationship**: One user generates many activity logs
- **Type**: 1:N (One-to-Many)
- **Foreign Key**: `user_id` in ACTIVITY_LOG references `_id` in USER
- **Description**: All user actions are logged for accountability

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
- `role`: Enum (resident, barangay_staff, admin)
- `name`: Required

### CATEGORY: ✨ NEW
- `category_name`: Required, Unique
- `keywords`: Array of strings for auto-classification
- `description`: Optional
- `isActive`: Boolean, default true

### REPORT:
- `title`: Required, Max length: 200
- `description`: Required, Max length: 2000
- `category`: Required, References CATEGORY.category_name
- `location.coordinates`: Required, [longitude, latitude]
- `status`: Enum (pending, in-progress, resolved, rejected)
- `reporter`: Required, Must reference valid USER

### ASSIGNMENT: ✨ NEW
- `report_id`: Required, References REPORT._id
- `worker_id`: Required, References USER._id (must be barangay_staff role)
- `assigned_by`: Required, References USER._id (must be admin role)
- `status`: Enum (assigned, in-progress, completed, cancelled)

### STATUS_HISTORY: ✨ NEW
- `report_id`: Required, References REPORT._id
- `status`: Required, Enum (pending, in-progress, resolved, rejected)
- `updated_by`: Required, References USER._id
- `updated_at`: Default: Current timestamp
- `remarks`: Optional

### ANNOUNCEMENT:
- `title`: Required, Max length: 200
- `content`: Required
- `category`: Enum (General, Emergency, Event, Maintenance, Update)
- `author`: Required, Must reference valid USER (staff/admin)

### ACTIVITY_LOG: ✨ NEW
- `user_id`: Required, References USER._id
- `action`: Required, Description of action
- `action_type`: Required, Enum (create, update, delete, login, logout, assign, view)
- `target_type`: Optional, Type of entity affected
- `target_id`: Optional, ID of affected entity
- `created_at`: Default: Current timestamp

---

## Indexes for Performance

### Automatic Primary Indexes:
- `_id` on all collections (unique, auto-indexed)

### Custom Unique Indexes:
- `email` on USER collection (unique)
- `category_name` on CATEGORY collection (unique)

### Geospatial Index:
- `location` on REPORT collection (2dsphere for geospatial queries)
  ```javascript
  reportSchema.index({ location: '2dsphere' });
  ```

### Compound Indexes for Queries:
- `report_id` + `updated_at` on STATUS_HISTORY (timeline queries)
- `user_id` + `created_at` on ACTIVITY_LOG (user activity queries)
- `worker_id` + `report_id` on ASSIGNMENT (worker's assigned tasks)
- `report_id` on ASSIGNMENT (report's assignment history)

---

## Paper Alignment Notes

### ERD Implementation Matches Chapter 3.6:

| Paper Entity | Implementation | Status |
|--------------|----------------|--------|
| users | User.js | ✅ Implemented |
| categories | Category.js | ✅ NEW - Added |
| report | Report.js | ✅ Implemented |
| assignments | Assignment.js | ✅ NEW - Added |
| status_history | StatusHistory.js | ✅ NEW - Added |
| announcements | Announcement.js | ✅ Implemented |
| activity_log | ActivityLog.js | ✅ NEW - Added |

### Field Name Mapping (Paper → MongoDB):

| Paper Field | MongoDB Field | Reason |
|-------------|---------------|--------|
| user_id | _id | MongoDB default convention |
| report_id | _id | MongoDB default convention |
| category_id | _id | MongoDB default convention |
| full_name | name | Simplified naming |
| image_url | photos[] | Supports multiple images |
| location_lat, location_lng | location.coordinates[] | GeoJSON standard (longitude, latitude) |
| date_created | createdAt | Mongoose/MongoDB convention |
| last_updated | updatedAt | Mongoose/MongoDB convention |

**Note:** These differences are acceptable and follow MongoDB/Mongoose best practices. Document this mapping in your paper's implementation chapter.

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

## For Your Thesis/Capstone Paper

### Include These Sections:

1. **Database Design Overview**
   - NoSQL (MongoDB) justification
   - Why document-based over relational

2. **Entity Descriptions**
   - Detailed explanation of each entity
   - Field purposes and constraints

3. **Relationship Explanations**
   - How entities connect
   - Cardinality rationale

4. **Normalization Analysis**
   - Document design decisions
   - Denormalization for performance

5. **Security Considerations**
   - Password hashing
   - Data validation
   - Access control

6. **Scalability Design**
   - Indexing strategy
   - Query optimization
   - Future growth considerations
