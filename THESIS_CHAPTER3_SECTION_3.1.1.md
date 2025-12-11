# Chapter III - Methodology
## Section 3.1.1 Information Gathering

---

### 3.1.1. Information Gathering

In preparation for the development of BetterStreets Camaman-an, a comprehensive information-gathering phase was conducted from August to October 2024 to analyze the limitations of the existing reporting process and to define the workflows, features, and user expectations necessary for a centralized solution. The information-gathering process employed multiple methods to ensure a thorough understanding of user needs, operational requirements, and technical feasibility appropriate for a capstone prototype system.

The primary methods used included:

**1. Interviews with Barangay Personnel**

Semi-structured interviews were conducted with five barangay staff members, including the barangay captain, barangay secretary, maintenance coordinator, and two barangay council members, to identify challenges in the current manual reporting process, documentation requirements, and workflow expectations. The interviews focused on understanding how residents currently report concerns, what information is collected, how reports are documented and tracked, what actions are taken to resolve issues, and what challenges exist in the current process.

Key findings from the interviews revealed that the barangay receives an average of 15 to 25 walk-in reports per month, primarily concerning road damage, street lighting issues, garbage collection problems, and drainage concerns. Staff members indicated that most reports are documented in a physical logbook with basic details such as the complainant's name, contact information, and a brief description of the issue. However, the current system lacks standardized forms, photo evidence, precise location information, and a formal status tracking mechanism. Barangay personnel expressed difficulty in following up on reports, prioritizing urgent cases, and providing updates to residents who inquire about their submissions. The interviews also identified the need for a centralized system that would allow staff to categorize reports, assign them to appropriate departments or barangay units, track resolution progress, and generate reports for barangay meetings and documentation purposes.

**2. Resident Consultation**

A questionnaire was distributed to 30 residents of Barangay Camaman-an through purposive sampling, targeting individuals who had previously reported concerns to the barangay or expressed interest in community engagement. The questionnaire assessed their awareness of reporting channels, types of concerns commonly encountered, preferred reporting methods, information they are willing to provide, and willingness to use a mobile-based system for reporting.

Results showed that 73% of respondents were aware that they could report concerns to the barangay hall during office hours, but 60% indicated that visiting the office during work hours was inconvenient. Common concerns mentioned by residents included potholes and damaged roads (67%), broken street lights (53%), uncollected garbage (47%), clogged drainage systems (40%), and public safety issues (33%). When asked about their willingness to provide additional information such as photos and location details, 87% expressed that they would be willing to attach photos if the process was simple, and 80% indicated that automatic GPS tagging would be helpful for pinpointing exact locations. Regarding status updates, 93% of respondents stated that they would like to receive notifications when their reports are acknowledged, being processed, or resolved. The survey also revealed that 83% of residents own Android smartphones and 90% expressed willingness to use a mobile application if it simplifies the reporting process and provides transparency on report status.

**3. Process Observation**

The researchers observed the existing walk-in reporting procedure at the barangay hall on three separate occasions to document the steps involved, information collected, response time, and pain points in the current system. Observations were conducted during typical office hours to capture the natural flow of the reporting process.

The observation revealed that when a resident arrives at the barangay hall to report an issue, they verbally explain the concern to the staff member on duty, who then manually records the information in a logbook. The typical information captured includes the resident's name, address, contact number, date of report, and a brief description of the issue written by the staff member based on their understanding of the verbal report. The process takes approximately 5 to 10 minutes per report, and no photographic evidence or precise location coordinates are collected. Residents are not provided with a reference number or acknowledgment receipt, and there is no formal mechanism for them to track the status of their report. Follow-up inquiries require the resident to return to the barangay hall or call by phone, and staff must manually search through the logbook to locate the original entry. The observations highlighted inefficiencies such as inconsistent record-keeping, lack of visual evidence, difficulty in locating specific reports, absence of categorization, and no structured workflow for assigning responsibility or tracking resolution progress.

**4. Document Analysis**

Existing report logs, complaint forms, and barangay resolution records from the past six months were reviewed with permission from barangay officials to identify common issue categories, data fields captured, frequency of reports, and status tracking methods currently in use. The analysis provided quantitative insights into reporting patterns and recurring community concerns.

The document review revealed that the most frequently reported categories were road-related issues (35%), street lighting problems (22%), garbage and waste management (18%), drainage and flooding concerns (12%), public safety incidents (8%), and miscellaneous infrastructure issues (5%). The logbook entries varied significantly in detail and format, with some entries containing only a single sentence while others included more comprehensive descriptions. However, none of the entries included photographic documentation, GPS coordinates, or timestamps beyond the date of submission. There was no consistent method for tracking the status of reports, and resolution documentation was often missing or recorded separately in meeting minutes rather than linked to the original complaint. This analysis underscored the need for standardized data fields, automatic categorization assistance, status tracking with timestamps, and integration of photo and location evidence to improve documentation quality and accountability.

**5. Technical Consultation**

Regular consultation sessions were conducted with the capstone adviser and an IT technical consultant to discuss feasible features, appropriate technology stack selection, system architecture design, and scope definition suitable for the project timeline and available resources. These consultations ensured that the system design was technically sound, aligned with academic requirements, and achievable within the constraints of a one-semester capstone project.

Technical guidance influenced several key decisions, including the selection of React Native with Expo SDK for cross-platform mobile development with focus on Android implementation, Node.js with Express and MongoDB for backend infrastructure to support RESTful API architecture, React with Vite and Tailwind CSS for the administrative web dashboard, AsyncStorage for offline-capable functionality rather than complex local database solutions, Expo Push Notification Service for push notifications to avoid third-party SMS integration costs, OpenStreetMap for heatmap visualization to eliminate API key dependencies and licensing costs, and JWT-based authentication for secure stateless API communication. The consultations also helped define realistic feature boundaries, such as limiting the system to two user roles (resident and admin) rather than implementing a three-tier hierarchy with field workers, focusing on assignment to internal barangay units rather than external agency integration, and prioritizing core reporting and management features over advanced analytics or machine learning capabilities.

---

### Synthesis of Findings

The findings from the information-gathering phase revealed several critical limitations in the existing manual reporting process that directly informed the system requirements:

1. **Lack of Standardized Documentation** – Reports are recorded inconsistently with varying levels of detail, making it difficult to analyze trends or retrieve specific cases efficiently.

2. **Absence of Photo Evidence** – Visual documentation is not collected, limiting the ability of barangay staff to verify the severity of issues or prioritize responses appropriately.

3. **No GPS-Based Location Tagging** – Verbal descriptions of locations are often vague or ambiguous, leading to delays in identifying the exact site of reported concerns.

4. **Unclear Status Updates** – Residents have no mechanism to track the progress of their reports and must make follow-up visits or calls to inquire about status, creating frustration and reducing trust in the process.

5. **Limited Accessibility** – The reporting process is restricted to office hours and requires in-person visits, making it inconvenient for working residents or those reporting urgent issues outside business hours.

6. **No Centralized Dashboard** – Barangay staff lack a unified tool to view all reports, monitor resolution progress, identify recurring problems, or generate summaries for decision-making and barangay meetings.

7. **Manual Categorization and Assignment** – Staff must manually determine which department or barangay unit should handle each report, and there is no formal tracking of assignment or accountability.

These findings directly influenced the requirement specification and shaped the functional and non-functional requirements of BetterStreets Camaman-an. The information-gathering phase emphasized the need for the following system capabilities:

- **Guided reporting fields with form validation** to ensure consistent and complete information capture, including required fields for title, description, category, and location.

- **Photo evidence support** allowing users to attach up to 5 images per report using expo-image-picker, with validation for file type (JPEG, PNG) and size limits (5MB per file).

- **GPS-based geolocation tagging** using expo-location to automatically capture latitude and longitude coordinates at the time of report submission, with reverse geocoding to display human-readable addresses.

- **Automatic status timeline tracking** with complete audit trail, logging all status changes (pending, in-progress, resolved, rejected) with timestamps, assigned barangay unit, admin remarks, and the identity of the staff member who made the update.

- **Centralized administrative tools** accessible via a web dashboard built with React, Vite, and Tailwind CSS, providing report management features including filtering by status, category, and priority, bulk actions, and detailed report views.

- **Offline-capable submission support** through AsyncStorage caching, allowing residents to draft reports and view previously loaded data when internet connectivity is unavailable, with automatic synchronization when connection is restored.

- **Push notifications and in-app notification center** using Expo Push Notification Service to deliver real-time updates to residents when their report status changes or when new announcements are published, with unread badge tracking and notification history.

- **Keyword-based auto-classification** into 8 predefined categories (Road Damage, Street Lighting, Garbage/Waste, Drainage/Flooding, Illegal Activity, Public Safety, Infrastructure, Other) using a rule-driven algorithm that scores keywords in the report title and description to suggest the most appropriate category.

- **Heatmap visualization** using OpenStreetMap and React Leaflet to display geographic distribution of reports with color-coded markers based on status, supporting filtering by category and priority to identify problem areas.

- **Analytics dashboard** showing report statistics including total reports, status breakdown, category distribution, priority analysis, trend visualization over time, and performance metrics for each of the 7 designated barangay units (Maintenance Team, Sanitation Department, Traffic Management, Engineering Office, Health Services, Peace and Order, Social Welfare).

These requirements established the foundation for the functional and non-functional specifications detailed in Section 3.1.2, the system architecture design presented in Section 3.1.3, and the database schema development documented in Section 3.1.4.

---

**End of Section 3.1.1**
