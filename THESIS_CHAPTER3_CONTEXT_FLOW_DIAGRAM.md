# Chapter III - Context Flow Diagram
## Section 3.1.5

---

### 3.1.5. Context Flow Diagram

The Context Flow Diagram illustrates the high-level interactions between external actors (Resident and Admin) and the BetterStreets system. This diagram shows the primary data flows and system boundaries, demonstrating how users interact with the community issue reporting platform. The diagram focuses on the external perspective of the system, showing what inputs the system receives from users and what outputs it provides back to them.

The Context Flow Diagram represents the simplest view of the system, identifying two main actors: Residents who submit and track community issue reports, and Barangay Staff/Admin who manage reports, update statuses, and publish announcements. All interactions flow through the centralized BetterStreets system, which encompasses the mobile application, backend server, database, and administrative dashboard components.

---

#### 3.1.5.1. Context Diagram Overview

```
                    ──────Register Account──────
                   ↓                            ↓
                                                  
    ┌──────────┐                                ┌──────────┐
    │          │  ◄──── Receive Push            │          │
    │          │        Notifications           │          │
    │          │                                │          │
    │          │  ◄──── Receive Status          │          │
    │          │        Updates                 │          │
    │          │                                │          │
    │          │  ◄──── View                    │          │
    │ Resident │        Announcements           │  Admin   │
    │  (User)  │                                │  Staff   │
    │          │                                │          │
    │          │  ────► Submit         ───────► │          │
    │          │        Reports        View     │          │
    │          │                       Reports  │          │
    │          │                                │          │
    │          │        ┌──────────────┐        │          │
    │          │        │ BetterStreets│        │          │
    │          │        │  Community   │        │          │
    │          │        │    Issue     │        │          │
    │          │        │  Reporting   │        │          │
    │          │        │   System     │        │          │
    │          │        └──────────────┘        │          │
    │          │                                │          │
    │          │  ────► Track          ───────► │          │
    │          │        Report Status  Update   │          │
    │          │                       Status   │          │
    │          │                                │          │
    │          │                       ───────► │          │
    │          │                       Manage   │          │
    │          │                       Reports  │          │
    │          │                                │          │
    │          │                       ◄─────── │          │
    │          │        Send Alerts             │          │
    │          │                                │          │
    └──────────┘                                └──────────┘
                   ↑                            ↑
                    ──────Login Account─────────
```

**Figure 3.3: BetterStreets Context Flow Diagram**

---

#### 3.1.5.2. System Interactions

**Resident Interactions:**

The Resident actor represents community members of Barangay Camaman-an who use the BetterStreets mobile application. Residents perform the following interactions with the system:

- **Register Account**: New users create accounts by providing personal information including name, email, phone number, and address. The system validates the information and creates a new resident account.

- **Login Account**: Existing users authenticate using email/phone and password credentials. The system verifies credentials and grants access to the mobile application.

- **Submit Reports**: Residents report community issues by providing a description, selecting a category, capturing photos, and automatically tagging GPS location. The system stores the report with a "pending" status.

- **Track Report Status**: Residents view the current status and complete history of their submitted reports, including timestamps and admin remarks for each status change.

- **View Announcements**: Residents receive and view official barangay announcements posted by admin staff, categorized by type (General, Emergency, Event, Maintenance, Update).

- **Receive Status Updates**: When an admin updates a report status, residents receive real-time push notifications on their mobile devices informing them of the change.

- **Receive Push Notifications**: The system sends automated push notifications for report status changes and new announcements, keeping residents informed even when the app is closed.

**Admin Interactions:**

The Admin actor represents authorized Barangay Staff members who use the BetterStreets web-based administrative dashboard. Admins perform the following interactions with the system:

- **Register Account**: Admin accounts are created by existing administrators with proper authorization and role assignment.

- **Login Account**: Admin staff authenticate using email and password credentials to access the administrative dashboard with elevated privileges.

- **View Reports**: Admins access a comprehensive list of all community reports with filtering options by status, category, date range, and assigned barangay unit.

- **Update Status**: Admins change report statuses (pending → in-progress → resolved/rejected), assign barangay units, add remarks, and set priority levels. Each update is recorded in the status history.

- **Manage Reports**: Admins can view detailed report information including photos, location on map, reporter details, complete status timeline, and delete invalid or duplicate reports.

- **Send Alerts**: When admins update report statuses, the system automatically triggers push notifications to inform residents of changes.

- **Create Announcements**: Admins publish official barangay announcements with title, content, category, priority level, and optional expiration date for temporary notices.

**System Boundary:**

The BetterStreets system encompasses four main components that process and manage all interactions:

1. **Mobile Application** (React Native + Expo) - Android app for residents
2. **Backend Server** (Node.js + Express) - RESTful API handling business logic
3. **Database** (MongoDB) - Data persistence for users, reports, categories, and announcements
4. **Admin Dashboard** (React + Vite) - Web interface for barangay staff management

All data flows shown in the diagram cross the system boundary, representing inputs received from external actors and outputs provided back to them. Internal processing within these four components is abstracted away in this high-level context view.

---

**End of Section 3.1.5**
