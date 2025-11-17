-- 1. USER Table
-- Stores user accounts: Reporters, Investigators, and Admins.
CREATE TABLE USER (
    UserID      VARCHAR(50) PRIMARY KEY, -- Primary Key
    Name        VARCHAR(255) NOT NULL,
    Email       VARCHAR(255) UNIQUE NOT NULL,
    Role        VARCHAR(50) NOT NULL,    -- e.g., 'Reporter', 'Investigator', 'Admin'
    LastLogin   DATETIME,
    Status      VARCHAR(20) NOT NULL     -- e.g., 'Active', 'Inactive', 'Pending'
);

-- 2. LOCATION Table
-- Stores the geographical details for an incident.
CREATE TABLE LOCATION (
    LocationID          INT PRIMARY KEY AUTO_INCREMENT, -- Primary Key
    Latitude            DECIMAL(10, 8) NOT NULL,
    Longitude           DECIMAL(11, 8) NOT NULL,
    Address             VARCHAR(512),
    LandmarkDescription TEXT
);

-- 3. INCIDENT Table
-- The central table for all reported environmental events.
CREATE TABLE INCIDENT (
    IncidentID          VARCHAR(50) PRIMARY KEY, -- Primary Key (e.g., INC-08421)
    ReporterID          VARCHAR(50) NOT NULL,
    LocationID          INT NOT NULL,
    Type                VARCHAR(100) NOT NULL,     -- e.g., 'Oil Spill', 'Water Contamination'
    Severity            VARCHAR(20) NOT NULL,      -- e.g., 'Low', 'Medium', 'High'
    Status              VARCHAR(50) NOT NULL,      -- e.g., 'New', 'In Progress', 'Resolved', 'Closed'
    DateTimeReported    DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateTimeOfOccurrence DATETIME, -- Optional time of the event
    Description         TEXT,
    ObservedImpacts     JSON,                      -- Store checklist/impact details as a JSON object/string

    -- Foreign Keys
    FOREIGN KEY (ReporterID) REFERENCES USER(UserID),
    FOREIGN KEY (LocationID) REFERENCES LOCATION(LocationID)
);

-- 4. EVIDENCE Table
-- Stores references and details for supporting files.
CREATE TABLE EVIDENCE (
    EvidenceID          INT PRIMARY KEY AUTO_INCREMENT, -- Primary Key
    IncidentID          VARCHAR(50) NOT NULL,
    FileType            VARCHAR(20) NOT NULL,      -- e.g., 'JPG', 'PDF', 'MP4'
    FileURL             VARCHAR(1024) NOT NULL,    -- Path or URL to the stored file
    UploadDate          DATETIME DEFAULT CURRENT_TIMESTAMP,
    Description         VARCHAR(512),

    -- Foreign Key
    FOREIGN KEY (IncidentID) REFERENCES INCIDENT(IncidentID)
);

-- 5. REPORT Table
-- Stores details about generated summary documents.
CREATE TABLE REPORT (
    ReportID            INT PRIMARY KEY AUTO_INCREMENT, -- Primary Key
    GeneratorID         VARCHAR(50) NOT NULL,
    ReportName          VARCHAR(255) NOT NULL,
    DateGenerated       DATETIME DEFAULT CURRENT_TIMESTAMP,
    Format              VARCHAR(10) NOT NULL,      -- e.g., 'PDF', 'CSV', 'XLSX'
    Category            VARCHAR(100),
    DateRangeStart      DATE,
    DateRangeEnd        DATE,

    -- Foreign Key
    FOREIGN KEY (GeneratorID) REFERENCES USER(UserID)
);

-- 6. REPORT_INCIDENT (Association/Junction Table)
-- Resolves the Many-to-Many relationship between REPORT and INCIDENT.
CREATE TABLE REPORT_INCIDENT (
    ReportID            INT NOT NULL,
    IncidentID          VARCHAR(50) NOT NULL,

    -- Composite Primary Key
    PRIMARY KEY (ReportID, IncidentID),

    -- Foreign Keys
    FOREIGN KEY (ReportID) REFERENCES REPORT(ReportID),
    FOREIGN KEY (IncidentID) REFERENCES INCIDENT(IncidentID)
);

Quick Report Module
 

 
  
   
   Module Name

   
   
   Functionality

   
  
 
 
  
  Quick Report

  
  
  A single-page interface integrating: Category
  selection, Evidence upload, Description of the incident, and Location mapping
  (including current location detection). It bypasses the multi-step
  verification of the Guided Report for fast submission.

  
  
Guided Report Module
 

 
  
   
   Sub-Module

   
   
   Step

   
   
    

   
   
   Functionality

   
  
 
 
  
  Category

  
  
  1 of 6

  
  
   

  
  
  Classifies the incident type (e.g., Oil
  Spill, Chemical Release, Environmental Damage).

  
 
 
  
  Location

  
  
  2 of 6

  
  
   

  
  
  Pinpoints the exact occurrence site via
  interactive map, address search, or Latitude/Longitude input.

  
 
 
  
  Details

  
  
  3 of 6

  
  
   

  
  
  Captures observed impacts, detailed
  description (size, color, quantity), severity assessment, and time of
  occurrence.

  
 
 
  
  Evidence

  
  
  4 of 6

  
  
   

  
  
  Uploads supporting photos, videos, or
  documents to substantiate the report.

  
 
 
  
  Reporter Information

  
  
  5 of 6

  
  
   

  
  
  Collects the contact details (Name, Email,
  Phone Number) of the reporting user.

  
 
 
  
  Review

  
  
  6 of 6 6

  
  
   

  
  
  Presents a final summary of all collected
  data for user verification before the report is submitted.

  
  
 
 
 
 
 
 
 
 
 
 
Supporting System Modules
 

 
  
   
   Module Name

   
   
   Purpose &
   Functionality

   
   
   Target User

   
  
 
 
  
  Reporting Method Selection

  
  
  The gateway module allowing the user to
  choose between the Quick Report and the Guided Report.

  
  
  All Users

  
 
 
  
  Registration & Login

  
  
  Manages user sign-up, secure
  authentication, and role-based access (User/Admin).

  
  
  All Users

  
 
 
  
  Incident Management

  
  
  Enables administrators to verify,
  update status, and track all submitted reports (from both Quick and
  Guided methods).

  
  
  Administrator

  
 
 
  
  Map & Explore

  
  
  Visualizes all verified incidents
  on an interactive map, supporting public data analysis and filtering.

  
  
  All Users

  
 
 
  
  Notifications & Profile

  
  
  Manages user alerts about report status
  changes and allows users to update their personal details.

  
  
  Registered Users

  
 
 
  
  Reports & Analytics

  
  
  Generates statistical summaries and
  downloadable reports on incident volume, trends, and geographic distribution.

  
  
  Administrator

  
  
 (Description of modules for environmental reporting system, dbms project)