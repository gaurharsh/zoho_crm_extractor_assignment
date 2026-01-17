# Zoho CRM Data Extractor – Chrome Extension

## Overview

This project is a **Chrome Extension (Manifest V3)** that extracts data from **Zoho CRM** modules using **DOM scraping (no API calls)**, stores the data locally using `chrome.storage.local`, and displays it in a **React + TailwindCSS popup dashboard**.

The extension supports extraction across **multiple Zoho CRM modules**, including **Deals with multiple pipelines**, and provides **visual feedback** using **Shadow DOM** during extraction.

This assignment demonstrates:
- Chrome Extension APIs (MV3)
- DOM manipulation and data extraction
- React-based UI architecture
- Local storage schema design and data integrity handling

---

## Supported Modules

- **Leads**
- **Contacts**
- **Accounts**
- **Deals** (multiple pipelines & stages)
- **Tasks**

---

## Technology Stack

- **Chrome Manifest V3**
  - Service Worker
  - Content Scripts
- **React.js** (Popup UI)
- **TailwindCSS**
- **Shadow DOM** (in-page extraction indicators)
- **chrome.storage.local**
- **chrome.tabs**, **chrome.runtime**, **chrome.storage** APIs

---

## Folder Structure 

```text
│   .gitignore
│   eslint.config.js
│   index.css
│   index.html
│   manifest.json
│   package-lock.json
│   package.json
│   postcss.config.js
│   README.md
│   service-worker.js
│   tailwind.config.js
│   tailwind.css
│   vite.config.js
│
├───content
│       extractor.js
│
├───dist
│   │   popup.html
│   │   popup.js
│   │   vite.svg
│   │
│   └───assets
│           popup-C1Rp4Rea.css
│
├───public
│       vite.svg
│
└───src
    │   App.css
    │   App.jsx
    │   index.css
    │   main.jsx
    │
    ├───assets
    │       react.svg
    │
    └───popup
            app.jsx
            main.jsx
            popup.css```
            

## Installation Steps

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>

2. Install dependencies:
    ```bash
    npm install

3. Build the React popup:
   ```bash
    npm run build

4. Load the extension in Chrome:
   Open chrome://extensions
   Enable Developer Mode
   Click Load unpacked
   Select the project root folder

5. Open Zoho CRM and navigate to a supported module.


### DOM Selection Strategy (Data Extraction Engine)
The extension uses DOM scraping instead of Zoho APIs, as required by the assignment.

#### Strategy Principles
Prefer stable attributes (data-id, semantic class names)
Avoid brittle selectors (deep nested CSS paths)
Extract data only from visible rows/cards
Detect module type automatically from URL patterns

#### Module Detection
The active Zoho CRM module is detected using the page URL:
/Leads
/Contacts
/Accounts
/Deals
/Tasks

This allows dynamic routing to the appropriate extraction logic without manual user input.

## Module-Specific Extraction Details
### Deals Module (Key Challenges Addressed)

#### Multiple Pipelines
     Pipeline name is extracted and associated with each deal

#### Deal Stages
     qualification, Proposal, Negotiation, Closed Won/Lost

#### List View and Kanban View
     Both table rows and kanban cards are supported

#### Team Selling (if enabled)
     Deal team members and their roles are extracted

#### Deal Split (if present)
     Revenue split percentage and overlay split data extracted

## Leads
### Extracted fields:
Lead Name
Company
Email
Phone
Lead Source
Lead Status
Lead Owner

## Contacts
### Extracted fields:
Name
Email
Phone
Account Name
Contact Owner
Mailing Address

## Accounts
### Extracted fields:
Account Name
Website
Phone
Industry
Annual Revenue
Account Owner

## Tasks
### Extracted fields:
Subject
Due Date
Status
Priority
Related To (Deal / Contact)
Assigned To

### Storage Layer Design
All data is stored using chrome.storage.local.

## Storage Schema
{
  "zoho_data": {
    "leads": [],
    "contacts": [],
    "accounts": [],
    "deals": [],
    "tasks": [],
    "lastSync": 1700000000000
  }
}


## Data Integrity Handling

### Deduplication
    Records are keyed by unique Zoho record ID

### Updates
    Re-extraction updates existing records

### Deletions
    Records can be deleted from the popup UI

### Race Conditions
    Map-based merges prevent overwrites
    Safe for multiple tabs extracting simultaneously

### Real-Time Sync
    Popup updates automatically via chrome.storage.onChanged


## Popup Dashboard (React UI)
Clicking the extension icon opens a React-based dashboard that provides:

#### Tabs for:
     Leads
     Contacts
     Accounts
     Deals (grouped by pipeline)
     Tasks

Search and filter functionality
Delete individual records
Extract Current Module button
Last sync timestamp per module
Deals grouped by:
  Pipeline
  Stage progression

### Visual Feedback (Shadow DOM)
During extraction, a Shadow DOM-based indicator is injected into the Zoho CRM page.

#### Indicator states:
     Loading (orange)
     Success (green)
     Error (red)
The indicator also displays the detected module name.

#### Shadow DOM ensures:
      Complete style isolation
      No interference with Zoho CRM UI

[ Demo Video_Link](https://drive.google.com/file/d/1sZbRK3X5K8o0SVIu2qd4rouVIlvV0toA/view)

#### Author
### Harshvardhan Singh Gaur 
