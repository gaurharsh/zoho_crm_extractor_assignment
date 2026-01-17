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





⏱️ VIDEO FLOW (3–5 MINUTES TOTAL)
________________________________________
## 1️⃣ INTRO (0:00 – 0:20)
🎬 On screen
•	Show Zoho CRM home page
•	Don’t click anything yet
🎙️ Say this:
Hi, this is a demo of my Zoho CRM Data Extractor Chrome Extension.
The extension extracts data from Deals, Leads, and Contacts, stores it locally using Chrome storage, and displays everything in a popup dashboard built with React.
________________________________________
##  2️⃣ ARCHITECTURE OVERVIEW (0:20 – 0:45)
🎬 On screen
•	Open chrome://extensions
•	Click “Details” on your extension briefly
🎙️ Say this:
The extension is built using Chrome Manifest V3, with a service worker, on-demand content script injection, and a React-based popup UI.
Data extraction is done via DOM scraping, without using Zoho APIs.
________________________________________
##  3️⃣ DEALS EXTRACTION – MULTIPLE PIPELINES (0:45 – 1:45)
🎬 On screen
•	Go to Deals
•	Switch to Kanban view
•	Scroll a bit so multiple stages are visible
•	Open the extension popup
🎙️ Say this:
I’ll start with the Deals module, which is rendered as a Kanban board in Zoho CRM.
Each deal card belongs to a pipeline and stage, and the extractor detects this context directly from the DOM.
🎬 On screen
•	Click “Extract Current Page”
•	Show black status badge: Extracted X deals
•	Switch popup tab to “deals”
🎙️ Say this:
The extractor captures the deal name, amount, stage, pipeline name, probability, closing date, owner, and related account or contact.
This works across multiple pipelines, not just the default one.
________________________________________
##  4️⃣ LEADS EXTRACTION (1:45 – 2:30)
🎬 On screen
•	Navigate to Leads module (list view)
•	Scroll slightly
•	Open popup
🎙️ Say this:
Next is the Leads module.
Zoho renders Leads using a Crux table with Lyte components, so I extract data from the rendered table rows rather than relying on URLs.
🎬 On screen
•	Click Extract Current Page
•	Show “Extracted X Leads”
•	Switch popup tab to “leads”
🎙️ Say this:
For Leads, the extension extracts lead name, company, email, phone, lead source, lead status, and lead owner.
System UI rows are filtered out to avoid junk data.
________________________________________
##  5️⃣ CONTACTS EXTRACTION (2:30 – 3:00)
🎬 On screen
•	Go to Contacts
•	Open popup
🎙️ Say this:
The same table-based extraction logic is reused for Contacts.
🎬 On screen
•	Click Extract Current Page
•	Switch to “contacts” tab
🎙️ Say this:
For Contacts, it extracts name, email, phone, account name, contact owner, and mailing address.
________________________________________
##  6️⃣ PAGE REFRESH PERSISTENCE (3:00 – 3:25)
🎬 On screen
•	Refresh the Zoho page
•	Open popup again
🎙️ Say this:
All extracted data is stored using chrome.storage.local, so it persists even after a page refresh.
________________________________________
##  7️⃣ POPUP DASHBOARD + DELETE FUNCTIONALITY (3:25 – 4:20)
🎬 On screen
•	Switch between popup tabs
•	Scroll records
•	Click Clear All Stored Data
🎙️ Say this:
The popup dashboard allows switching between modules, viewing extracted records, and clearing stored data.
The Clear All Stored Data button resets the local storage, which is useful for repeated extractions during testing.
________________________________________
##  8️⃣ UI & TAILWIND NOTE (4:20 – 4:40)
🎙️ Say this (IMPORTANT – EXACT WORDING):
The popup UI is built with React, and the styling follows Tailwind-style utility patterns.
Due to build constraints in the Chrome extension environment, I used a CSS-based implementation that mirrors Tailwind utility behavior, while keeping the component structure and design approach the same.
⬆️ This is honest, professional, and safe
❌ Do NOT say “Tailwind didn’t work”
✅ Say “Tailwind-style / mirrored”
________________________________________
##  9️⃣ CLOSING (4:40 – 5:00)
🎙️ Say this:
This concludes the demo of the Zoho CRM Data Extractor.
Thank you.

