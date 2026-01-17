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



## Demo Video Script (3–5 Minutes)

### 0:00 – 0:25 | Overview
    “This is a Chrome Extension built using Manifest V3 that extracts data from Zoho CRM modules using DOM scraping, stores the data locally using chrome.storage.local, and displays everything in a React-based popup dashboard.
    The extension works across multiple CRM modules and supports multiple deal pipelines.”

### 0:25 – 1:10 | Deals Module – Multiple Pipelines
    “I’m currently on the Deals module in Zoho CRM.
    Zoho supports multiple pipelines, so I’ll switch between different pipelines to show that context is captured.”

(Switch pipeline to Zoho UI)
    “Now I’ll click the extension and select Extract Current Module.”

(Click extract)
    “You can see a Shadow DOM indicator injected into the page showing the extraction status.”

(Open popup)
    “In the popup dashboard, deals are grouped by pipeline name, and each deal includes stage, amount, probability, and owner.”

### 1:10 – 1:40 | Leads Module
     Next, I’ll navigate to the Leads module.”

(Open Leads)
       “I’ll extract the current module again.”

(Click extract)
       “The popup now shows lead records with fields like name, company, email, status, and owner.”

### 1:40 – 2:05 | Contacts Module
    “Now I’ll move to the Contacts module.”

(Open Contacts → extract)
    “Contact details such as name, email, phone, account, and owner are extracted and stored.”

### 2:05 – 2:30 | Page Refresh Persistence
    “I’ll refresh the Zoho CRM page.”

(Refresh page)
    “After reopening the extension popup, all previously extracted data is still available, demonstrating local persistence using chrome.storage.local.”

### 2:30 – 2:55 | Popup Dashboard & Delete
    “From the popup dashboard, I can switch between different modules using tabs.
    I can also delete individual records.”

(Delete one record)
    “The UI updates immediately, showing real-time sync across the extension.”

### 2:55 – 3:10 | Wrap-Up
     “To summarize, this extension supports multiple CRM modules, handles multiple deal pipelines, uses Manifest V3-compliant architecture, ensures storage integrity, and is designed to be easily extendable for additional features.”



## Author
### Harshvardhan Singh  Gaur 



