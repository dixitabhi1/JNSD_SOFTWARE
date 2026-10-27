# JNSD EDUCATION CENTRE — SCHOOL ERP

> **Production-Grade School Management & ERP System**  
> Serving students from Pre-Primary (Play Group, Nursery, LKG, UKG) through Class 8.  
> CBSE Affiliation: `CBSE-AFF-JNSD-0921` • UDISE+ Code: `09210401802` • Session: `2026–2027`

---

## 1. System Overview

JNSD Education Centre School ERP replaces legacy paper registers with a unified, high-security, role-based platform accessible via responsive Web and an installable native Android APK.

### Key Capabilities
- **Strict Role-Based Access Control (RBAC):**
  - **Manager Sir (Full System Access):** Comprehensive administrative authority across students, classes, admissions, attendance, marks, examinations, UDISE+ reporting, staff access management, audit logs, and **exclusive access to Fees & Accounts** and **Fee Receipt OCR reconciliation**.
  - **Principal (Admissions & Academic Oversight):** Student admission wizard, document verification, academic performance review, teacher account provisioning, and access revocation. **Zero access to Fees & Accounts, financial ledgers, or payment OCR.**
  - **Class Teacher (Assigned Classes Only):** Daily class attendance marking, subject-wise examination marks entry, and student academic progress. Isolated from financial modules, staff management, and other unassigned classes.
- **Student Admission & Digital Records:** 4-step wizard with duplicate student detection, masked Aadhaar UIDAI compliance (`XXXX-XXXX-1234`), parent/guardian contact registers, and printable admission slips.
- **Client-Side Document OCR:** Integrated Tesseract.js engine for auto-extracting Name, DOB, Gender, Masked Aadhaar, and Address from Identity Documents and Fee Receipts, with side-by-side mismatch warnings and mandatory human verification.
- **Daily Attendance Register:** Real-time class/section attendance marking, bulk "Mark All Present", daily/monthly percentage calculations, and low-attendance (<75%) warning indicators.
- **Academic Examinations & CBSE Report Cards:** Examination term management, subject marks validation against limits, automatic percentage and CBSE 8-point grading (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`, `D`, `E`), and printable official report cards bearing the school crest.
- **Fees & Accounts (Manager Exclusive):** Class-wise fee structure management, student invoices, fee collection recording (Cash, UPI, Bank Transfer, Cheque), printable branded receipts, and overdue defaulters tracking.
- **Fee Receipt OCR & Ledger Reconciliation (Manager Exclusive):** Scan fee receipts or bank/UPI payment screenshots, extract fields, match open student invoices, and post verified entries to the ledger.
- **UDISE+ Ministry of Education Module:** Automated rule-based validation checking for missing PEN, unmasked Aadhaar, and age anomalies; official JSON and CSV export generation.
- **Staff Access Management & Mandatory Revocation:** Provision Class Teacher accounts with auto-generated teacher codes (`JNSD-TCH-101`), assign class/sections, temporary password provisioning, and instant one-click **Revoke Access** with mandatory audit logging and session termination.
- **In-App Update Notification & Android Distribution:** In-app updates dashboard querying `version-manifest.json`, direct download link for signed release APK, and SHA-256 cryptographic checksum integrity verification.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Native Android:** Capacitor 8 (`com.jnsd.schoolerp`), Gradle, AndroidManifest with Camera/Storage permissions.
- **Database & Storage:** PostgreSQL schema with Row Level Security (RLS) migrations in `supabase/migrations/`; fallback persistent local relational store for offline/standalone execution.
- **OCR Engine:** Tesseract.js with heuristic normalization for Indian identity cards and fee slips.
- **Testing:** Vitest, Testing Library, JSDOM.
- **CI/CD:** GitHub Actions workflows for continuous integration and automated signed Android APK releases.

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js `22.x` or later
- npm `10.x` or later

### Installation
```bash
# Clone the repository
git clone https://github.com/jnsd-education/school-erp.git
cd school-erp

# Install dependencies
npm ci

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Test Suite
```bash
# Execute automated Vitest test suite
npm test
```

### Production Build
```bash
# Compile TypeScript and bundle web app
npm run build
```

---

## 4. Android APK Build Instructions

The Android application is packaged with Capacitor into `android/`.

### 1. Build and Sync Web Assets
```bash
npm run build
npx cap sync android
```

### 2. Assemble Debug APK
```bash
cd android
./gradlew assembleDebug
```
The debug APK is generated at:  
`android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Assemble Release APK
```bash
cd android
./gradlew assembleRelease
```
The release APK is generated at:  
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 5. Role & Permissions Matrix

| Module / Feature | Manager Sir | Principal | Class Teacher | Revoked Staff |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | Full Metrics (Revenue + Academics) | Academic & Enrollment KPIs | Assigned Class Attendance & Marks | Blocked (Locked) |
| **Admissions & Student Directory** | Full Access | Full Access | View Assigned Class Only | Blocked |
| **Aadhaar / ID Card OCR** | Full Access | Full Access | Denied | Blocked |
| **Attendance Register** | Full Access (All Classes) | Oversight (All Classes) | Manage Assigned Classes Only | Blocked |
| **Examinations & Marks** | Full Access | Full Access | Enter Marks for Assigned Classes | Blocked |
| **Print Official Report Cards** | Yes | Yes | Yes (Assigned) | Blocked |
| **Fees & Accounts** | **EXCLUSIVE FULL ACCESS** | **STRICTLY FORBIDDEN (403)** | **STRICTLY FORBIDDEN (403)** | Blocked |
| **Fee Receipt OCR Reconciliation** | **EXCLUSIVE FULL ACCESS** | **STRICTLY FORBIDDEN (403)** | **STRICTLY FORBIDDEN (403)** | Blocked |
| **UDISE+ Preparation & Exports** | Full Access | Full Access | Denied | Blocked |
| **Staff Provisioning** | Full Access | Teacher Accounts Only | Denied | Blocked |
| **Mandatory Access Revocation** | Full Access | Teacher Accounts Only | Denied | Blocked |
| **Security Audit Logs** | View All | View All | Denied | Blocked |
| **App Updates & APK Download** | Full Access | Full Access | Full Access | Blocked |

---

## 6. Official School Identity Details

- **School Name:** JNSD Education Centre
- **Logo:** Embedded high-resolution crest in `public/school-logo.png`
- **Address:** District Road, Kanpur Nagar, Uttar Pradesh - 208001
- **Affiliation:** CBSE Affiliation No. `CBSE-AFF-JNSD-0921`
- **UDISE+ Code:** `09210401802`
- **Principal:** Dr. Aruna Saxena
- **Manager Sir:** Sri Ramesh Chandra Sharma

