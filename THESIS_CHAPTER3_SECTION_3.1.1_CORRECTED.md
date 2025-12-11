# Chapter III - Section 3.1 (CORRECTED)

## 3.1. Requirement Analysis and Design

### 3.1.1. Information Gathering

In preparation for the development of BetterStreets Camaman-an, a comprehensive information-gathering phase was conducted from August to October 2024 to analyze the limitations of the existing reporting process and to define the workflows, features, and user expectations necessary for a centralized solution. The purpose of information gathering was not only to identify commonly reported barangay concerns but also to determine what information residents are able to provide, what details barangay staff require for verification, and which features are needed to strengthen transparency and operational monitoring.

This phase guided the requirement specification and influenced the system architecture, use case development, database structure with 4 core collections (users, reports, categories, announcements), and process modeling. The findings emphasized the need for guided reporting fields with validation, photo evidence support (up to 5 images per report), GPS-based geolocation tagging, automatic status timeline tracking with complete audit trail, centralized administrative tools via web dashboard, offline-capable submission support through AsyncStorage caching, and monitoring features such as keyword-based auto-classification into 8 predefined categories and heatmap visualization using OpenStreetMap.

---

#### 3.1.1.1. Techniques Used

**Stakeholder Interviews** – Semi-structured interviews were conducted with 5 barangay staff members, including the barangay captain, secretary, and maintenance coordinator, to gather detailed expectations regarding system modules such as structured reporting intake with form validation, report verification using photo evidence and GPS coordinates, auto-classification into 8 categories (Road Damage, Street Lighting, Garbage/Waste, Drainage/Flooding, Illegal Activity, Public Safety, Infrastructure, Other), assignment to 7 designated barangay units (Maintenance Team, Sanitation Department, Traffic Management, Engineering Office, Health Services, Peace and Order, Social Welfare), status updates with remarks and audit trail, closure documentation with resolution timestamps, and monitoring dashboards with analytics and heatmap visualization. Discussions focused on current pain points in manual logbook-based reporting and desired system functionalities for improving documentation quality and accountability.

**Resident Interviews** – 10 residents were interviewed through purposive sampling to understand their experiences with reporting barangay concerns. Insights were gathered regarding difficulties in reporting during office hours only, lack of acknowledgement receipts or reference numbers, limited progress visibility after submission, inability to attach photo evidence during walk-in reports, and issues caused by requiring in-person visits when internet or mobile reporting would be more convenient.

**Resident and Staff Surveys** – Surveys were distributed to 30 residents and 5 barangay staff members to gather broader feedback regarding commonly reported concerns (road damage, street lighting, garbage collection, drainage), expected system features (mobile app accessibility, photo uploads, GPS tagging, push notifications), usability expectations (simple forms, offline support, notification center), and preferences related to notification delivery (push notifications via Expo Push Notification Service) and status visibility (in-app timeline with status history showing pending, in-progress, resolved, or rejected states).

**Benchmarking** – Comparable community reporting systems such as SeeClickFix, FixMyStreet, and local government mobile apps were reviewed to identify best practices such as structured forms with required fields, evidence uploads with file validation, automatic GPS coordinate capture using expo-location, status tracking with timestamped history, administrative dashboards with filtering and search capabilities, push notification systems for status updates, and data visualization tools such as heatmaps with color-coded markers based on report status and category distribution analytics.

**Document Review and Workflow Analysis** – Existing reporting methods used at the barangay hall, including physical logbooks and complaint forms, were reviewed over a 6-month period to identify missing report fields (no photos, no GPS, no timestamps beyond date), inconsistent categorization practices, lack of formal assignment tracking, and absence of structured follow-up steps. This analysis informed the database schema design with required fields (title, description, category, location with coordinates, photos array, status, priority, assignedAgency, reporter reference, statusHistory array), workflow rules required for validation (required fields, photo format and size limits, location permission checks), automatic keyword-based categorization using scoring algorithm, assignment to barangay units via dropdown selection, status update triggers for push notifications, and case closure with resolvedAt timestamp.

---

#### 3.1.1.2. Stakeholders Involved

**Residents / Community Reporters** – Provided requirements related to user experience on Android mobile app, reporting convenience (24/7 accessibility without office visits), photo evidence submission (up to 5 images per report via expo-image-picker), automatic GPS-based geolocation tagging, offline usability through AsyncStorage caching with automatic resynchronization, status visibility through in-app notification center with unread badge tracking, and ability to view report history with complete status timeline showing all updates made by barangay staff.

**Barangay Staff / Administrators** – Provided operational insights related to verification requirements (photo evidence and GPS coordinates needed before processing), categorization practices (need for consistent categories across all reports), assignment workflow needs (ability to assign reports to appropriate barangay units and track who is responsible), status update procedures (adding remarks when changing status from pending to in-progress to resolved), documentation standards (maintaining audit trail of all changes with timestamps and admin identity), announcement publishing capabilities (creating official barangay updates with categories and priority levels), and monitoring expectations (analytics dashboard showing report statistics, category distribution, and heatmap visualization to identify problem areas).

---

#### 3.1.1.3. Key Findings

**Report Submission** – Residents prefer a simple reporting interface via mobile app that guides required fields through form validation, supports photo attachments (JPEG/PNG up to 5MB per file, maximum 5 photos per report), and automatically captures GPS coordinates using expo-location to avoid repeated clarifications about exact locations. Survey results showed 87% willingness to provide photos and 80% preference for automatic location tagging.

**Verification and Documentation** – Barangay staff require photographic evidence and accurate GPS-based location data (latitude/longitude coordinates with reverse geocoding for human-readable addresses) to validate concerns efficiently, assess severity visually, prioritize urgent cases, and plan responses. Interviews revealed that 35% of current reports lack sufficient location detail, causing delays in field verification.

**Status Tracking and Transparency** – Residents strongly request push notification updates when report status changes (pending → in-progress → resolved or rejected) and an accessible in-app notification center with complete report history timeline showing all status updates with timestamps, assigned barangay unit, and admin remarks to improve transparency. Survey showed 93% of residents want status update notifications.

**Assignment and Workflow Handling** – Barangay staff require tools to assign reports to responsible barangay units from a predefined list (7 internal departments), update status with remarks explaining actions taken, maintain automatic audit trail in statusHistory array logging all changes with timestamps and admin identity, and close reports with resolvedAt timestamp and final remarks for consistent documentation and accountability.

**Connectivity Constraints** – Residents may experience unstable internet connectivity, particularly in certain areas of the barangay or during peak hours, emphasizing the need for offline-capable support through AsyncStorage caching that allows viewing previously loaded reports, drafting new reports locally, and automatic synchronization when connection is restored. The system does not use queuing mechanisms but relies on AsyncStorage persistence until manual or automatic retry when online.

**Monitoring and Planning Support** – Barangay staff benefit from analytics dashboard showing total reports, status breakdown (pending/in-progress/resolved/rejected percentages), category distribution across 8 types, priority analysis, trend visualization over time periods, and barangay unit performance metrics. Heatmap visualization using OpenStreetMap with React Leaflet displays color-coded markers (green for resolved, yellow for in-progress, red for pending, gray for rejected) to identify recurring issue types and geographic problem areas requiring preventive action or resource allocation.

---

#### 3.1.1.4. Key Insights

From the information gathered, the following insights guided the design of BetterStreets:

1. **Guided reporting with form validation** improves data completeness and reduces delays caused by missing information or clarification requests from barangay staff.

2. **Photo evidence (up to 5 images) and GPS-based geolocation tagging** strengthen verification accuracy, allow visual assessment of severity, and support evidence-based response planning without requiring staff to conduct preliminary site visits for every report.

3. **Transparent status tracking via push notifications and in-app notification center** increases resident trust in the system, reduces repeated follow-up inquiries via phone or walk-in visits, and demonstrates accountability in the resolution process.

4. **Assignment to 7 designated barangay units and automatic status timeline logging** support operational consistency, clarify responsibility for each report, and maintain complete audit trail showing who updated what and when.

5. **Offline-capable functionality through AsyncStorage caching** addresses connectivity constraints in areas with unstable internet, prevents report loss due to connection drops during submission, and allows residents to draft reports and view cached data while offline with automatic resynchronization when connection returns.

6. **Keyword-based auto-classification into 8 categories** reduces manual categorization burden on staff, ensures consistent category assignment across reports, and improves searchability and filtering in the administrative dashboard.

7. **Heatmap visualization using OpenStreetMap and analytics dashboard** support identification of recurring concerns, geographic clustering of problem areas (hotspots), trend analysis over time, and data-driven decision-making for resource allocation and preventive maintenance planning during barangay meetings and budget discussions.

These insights directly informed the functional and non-functional requirements documented in Section 3.1.2.

---

**End of Section 3.1.1**
