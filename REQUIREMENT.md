📄 CHECKGEAR – PRODUCT REQUIREMENT DOCUMENT (FINAL VERSION)
1. 📌 Product Overview
1.1 Product Name

CheckGear

1.2 Description

CheckGear is a web application that allows users to:

Manage personal PC / Laptop / hardware gear
Track price, condition, and usage
Automatically fetch and update market price from Vietnamese websites
Analyze gear value over time
2. 🎯 Product Goals
Build a data-driven gear management system
Combine:
CRUD system
External data crawling
Provide real-time price tracking
Create a portfolio-level fullstack project
3. 👤 Target Users
Developers
Gamers
PC builders
Tech enthusiasts
Second-hand hardware sellers
4. 📦 Scope
4.1 In Scope (MVP)
Authentication
Gear CRUD (PC/Laptop only)
Search & filter
Dashboard
Crawl gear data from Vietnamese websites
Auto-update price
4.2 Out of Scope (Phase 2)
Mobile app
Marketplace
AI prediction
Social features
5. 🧩 Gear Scope Definition
Supported Categories:
💻 Laptop
Gaming laptop
Office laptop
🖥️ PC Components
CPU
VGA
RAM
SSD / HDD
Mainboard
PSU
Case

👉 ❌ Exclude completely:

Phone
Tablet
Smartwatch
6. 🧩 User Stories
6.1 Authentication
User can register
User can login
User can access personal data
6.2 Gear Management
User can add a PC/laptop gear
User can edit gear
User can delete gear
User can view all gear
6.3 Crawl Integration
User can search gear from external websites
User can select suggestion → auto-fill data
System can update gear price automatically
6.4 Dashboard
User sees total gear value
User sees distribution by category
7. 🔑 Functional Requirements
7.1 Authentication Module
API
POST /api/auth/register
POST /api/auth/login
Rules
Email unique
Password hashed (bcrypt)
JWT authentication
Acceptance Criteria
Valid user can login and receive token
Unauthorized request is rejected
7.2 Gear Management Module
7.2.1 Create Gear
Fields
{
  "name": "RTX 3060",
  "category": "VGA",
  "brand": "NVIDIA",
  "price": 8000000,
  "purchaseDate": "2024-01-01",
  "condition": "good",
  "notes": "",
  "externalSource": {}
}
Validation
name: required
category: required
price > 0
7.2.2 Get Gear List
Query Params
GET /api/gears?search=rtx&category=VGA&sort=price&page=1&limit=10
Features
Pagination
Search
Filter
Sort
7.2.3 Update Gear
Only owner can update
All fields editable
7.2.4 Delete Gear
Soft delete (deletedAt)
7.3 Search & Filter Module
Search
name (regex)
brand
Filter
category
condition
price range
Sort
price
createdAt
name
7.4 Dashboard Module
Data
totalItems
totalValue
itemsByCategory
7.5 🔄 Crawl & Data Integration Module
7.5.1 Goal
Fetch gear data from Vietnamese PC hardware websites
Auto-fill gear info
Track real-time price
7.5.2 Supported Sources (Phase 1)
CellphoneS (PC section)
GearVN
Phong Vũ

👉 Start with 1 site only (GearVN recommended)

7.5.3 Crawl Search API
GET /api/crawl/search?keyword=rtx 3060
Response
[
  {
    "name": "RTX 3060 MSI Ventus",
    "price": 7990000,
    "category": "VGA",
    "source": "GearVN",
    "url": "https://...",
    "image": "https://..."
  }
]
7.5.4 Auto-fill Gear

User flow:

Search keyword
Select result
System auto-fill fields
7.5.5 External Source Mapping
{
  "externalSource": {
    "site": "gearvn",
    "url": "https://...",
    "lastPrice": 7990000,
    "lastCheckedAt": "2026-04-13"
  }
}
7.5.6 Auto Update Price (CRON)
Schedule
Every 24 hours
Logic
Fetch latest price from URL
Compare with stored price
Update if changed
7.5.7 Price History
PriceHistory {
  _id,
  gearId,
  price,
  recordedAt
}
Acceptance Criteria
Every update creates history record
Queryable by time
7.5.8 Crawl Technical Requirements
Tools
Axios (simple crawl)
Cheerio (HTML parsing)
Puppeteer (fallback if needed)
Rules
Delay requests (avoid block)
Retry on failure
Separate parser per website
8. 🧱 Data Model
User {
  _id,
  email,
  password,
  createdAt
}

Gear {
  _id,
  userId,
  name,
  category,
  brand,
  price,
  purchaseDate,
  condition,
  notes,
  externalSource,
  createdAt,
  updatedAt,
  deletedAt
}

PriceHistory {
  _id,
  gearId,
  price,
  recordedAt
}
9. 🔄 System Architecture
Backend
Node.js (Express)
Modules:
Auth
Gear
Crawl
Scheduler
Frontend
React / Next.js
Services
Crawler Service
Cron Job Service
10. ⚙️ Non-Functional Requirements
Performance
API < 500ms
Crawl API < 2s
Scalability
Queue system (future)
Modular services
Security
JWT
Input validation
11. 🚨 Edge Cases
Crawl site down
HTML structure change
Invalid URL
Duplicate gear
Large dataset (100k records)
12. 🧪 Testing
API test (Postman)
Crawl test (manual verify data)
Edge case testing
13. 🚀 Deployment
Frontend: Vercel
Backend: Render / Railway
DB: MongoDB Atlas