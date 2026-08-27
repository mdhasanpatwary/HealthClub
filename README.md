# 🏥 Health Club (হেলথ ক্লাব) — Digital Healthcare & Discount Platform

A modern, high-performance, mobile-first healthcare membership, emergency medical network, and hospital discount platform built for Feni and surrounding districts in Bangladesh.

---

## 📋 Table of Contents

- [🌟 Features Overview](#-features-overview)
  - [1. Public Healthcare Portal](#1-public-healthcare-portal)
  - [2. Member Dashboard & Digital ID](#2-member-dashboard--digital-id)
  - [3. Partner Hospital & Cashier Portal](#3-partner-hospital--cashier-portal)
  - [4. Admin Control Center & Operations](#4-admin-control-center--operations)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [🗄️ Database & Prisma Setup](#️-database--prisma-setup)
- [📱 Progressive Web App (PWA) & Offline Mode](#-progressive-web-app-pwa--offline-mode)
- [📂 Project Structure](#-project-structure)
- [📜 Scripts & Commands](#-scripts--commands)

---

## 🌟 Features Overview

### 1. Public Healthcare Portal
- **Emergency Services Directory (`/emergency`)**: Instant blood donor search by blood group and Upazila, 24/7 classified ambulance fleet (AC, Non-AC, ICU, Freezing Carrier) with one-tap dialing, oxygen cylinder suppliers, and a volunteer blood donor registration dialog.
- **Specialist Doctors Directory (`/consultants`)**: Filter by medical department and Upazila, real-time chamber availability status (*Available Today*, *On Leave*, *Chamber Closed*), degrees, visiting schedules, and instant appointment serial booking.
- **Partner Hospitals Directory (`/partner-hospitals`)**: Detailed hospital & diagnostic center profiles, facility badges (ICU, CCU, Dialysis, 24/7 Emergency), itemized department discount rates (Pathology, Radiology, Bed charge, Pharmacy), resident doctor rosters, and verified member reviews.
- **Interactive Health Tools (`/health-tools`)**:
  - **BMI & Ideal Weight Calculator**: Calculates BMI, category, weight difference, and daily target.
  - **Pregnancy Due Date (EDD) Calculator**: Calculates estimated delivery date, trimester progress, baby size milestones, and prenatal tips.
  - **Blood Pressure & Diabetes Evaluator**: Clinical evaluation of systolic/diastolic BP and fasting/post-meal blood sugar.
  - **Daily Water & Calorie Intake Calculators**: Personalized hydration and daily caloric energy needs.
  - **Branded PDF Health Report**: One-click generation and download of a combined clinical health assessment summary.
- **Preventative Health Blog (`/health-tips`)**: Medical wellness articles, bilingual content, estimated reading time, reader helpfulness reactions, related specialist recommendations, and structured schema.

### 2. Member Dashboard & Digital ID (`/dashboard`)
- **Offline-First Digital ID Card**: Dynamic QR code with verification link, member tier badges (*Founding* / *Premium*), and offline caching support via Service Worker.
- **Total Savings Tracker**: Real-time counter of total taka saved across partner hospital visits.
- **Transaction History**: Detailed log of hospital visits, billing amounts, discounts received, and date stamps.
- **bKash Annual Renewal**: In-app renewal submission with transaction verification and instant status tracking.
- **In-App Notification Center**: Real-time alerts for renewal status, recorded hospital discounts, and health advisories.
- **Family & Relatives Coverage**: Official policy badging affirming that a single Health Club membership covers the member, their immediate family, and relatives for hospital discounts.

### 3. Partner Hospital & Cashier Portal (`/partner/dashboard`)
- **Camera QR Scanner & Manual ID Lookup**: Instantly verifies member status and active tier before billing.
- **Quick Discount Transaction Entry**: Calculates and records patient bill discounts with cashier desk attribution.
- **Multi-Cashier & Counter Staff**: Hospital admin can provision sub-accounts for specific billing desks (e.g., *Counter 1 - Billing*, *Pharmacy Desk*).
- **Doctor Chamber Management**: Link/unlink specialist doctors, update room numbers, and adjust visiting schedules.
- **Settlement Statements & Analytics**: Monthly patient volume charts, total discount dispensed, peak visiting days, and CSV export.

### 4. Admin Control Center & Operations (`/admin`)
- **Member Management**: Approve/reject pending registrations, manage renewals, issue manual activations, and export member lists to CSV/Excel with UTF-8 BOM encoding for Bangla text.
- **Hospital Partner & Doctor CRUD**: Manage partner hospitals, itemized department discounts, doctor profiles, availability statuses, and leave notices.
- **Broadcast Campaign Manager**: Draft and send announcements (Free Health Camps, blood drives) across **Email**, **SMS**, and **In-App/Web Push** channels to targeted audience segments.
- **Financial & Revenue Analytics**: Real-time SQL aggregations tracking subscription revenue, renewal retention rates, monthly trends, and partner performance.
- **Bulk Data Importer**: Upload and auto-map doctors, hospitals, and emergency contacts via `.xlsx` and `.csv` files.
- **Role-Based Access Control (RBAC)**: Manage admin team members with granular permissions (`super_admin`, `content_moderator`, `support_staff`).
- **Database Backup & Snapshot Manager**: One-click JSON/SQL database snapshot export and recovery system.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) (React Server Components by default)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` configuration inside `src/app/globals.css`)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) / [Supabase](https://supabase.com/) with [Prisma ORM](https://www.prisma.io/) (`@prisma/adapter-pg` connection pooler)
- **Authentication**: Stateless, encrypted HTTP-only JWT session cookies with `jose` and `src/proxy.ts` request proxy guard
- **PWA & Offline**: [Serwist](https://serwist.pages.dev/) (`@serwist/next`) + Web Push API (`web-push`)
- **Email & Messaging**: [Nodemailer](https://nodemailer.com/) + Bangladeshi SMS Gateway with built-in simulator fallback
- **Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Internationalization**: Bilingual (Bangla `bn` & English `en`) route-based modular translation dictionaries

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ or v22+
- [Yarn](https://yarnpkg.com/) v1.22+ or npm / pnpm
- A PostgreSQL database instance (local or hosted on Supabase / Neon / Railway)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/health-club.git
cd HealthClub
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Setup environment variables
Copy the template and configure your secrets:
```bash
cp .env.example .env.local
```

### 4. Setup the database & Prisma client
Push schema to your database and generate Prisma types:
```bash
npx prisma db push
npx prisma generate
```

### 5. (Optional) Seed initial data
```bash
npx tsx scripts/seed.ts
```

### 6. Start development server
```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string with PgBouncer pooling (port 6543) |
| `DIRECT_URL` | **Yes** | Direct PostgreSQL connection string for Prisma CLI / migrations (port 5432) |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Canonical deployment base URL (e.g. `https://healthclubfeni.vercel.app`) |
| `SESSION_SECRET` | **Yes** | 32+ character random string for signing JWT session cookies |
| `ADMIN_EMAIL` | **Yes** | Primary administrative email address for fallback role checks |
| `NEXT_PUBLIC_ADMIN_EMAIL`| **Yes** | Client-accessible admin email identifier |
| `SMTP_HOST` | No | SMTP mail server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP mail server port (`465` or `587`) |
| `SMTP_USER` | No | SMTP username / sender email |
| `SMTP_PASSWORD` | No | SMTP application password |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | No | Web Push VAPID public key (auto-generated in DB if omitted) |
| `VAPID_PRIVATE_KEY` | No | Web Push VAPID private key |
| `VAPID_SUBJECT` | No | Web Push contact URI (e.g. `mailto:healthclubfeni@gmail.com`) |
| `SMS_API_KEY` | No | Bangladeshi SMS Gateway API key (runs in simulation mode if empty) |
| `SMS_SENDER_ID` | No | SMS Approved Masking / Sender ID (default: `HealthClub`) |
| `SMS_API_URL` | No | SMS Gateway HTTP POST endpoint URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token |
| `NEXT_PUBLIC_FACEBOOK_URL` | No | Official Facebook community / page URL |

---

## 🗄️ Database & Prisma Setup

The schema is defined in [`prisma/schema.prisma`](file:///Users/patwary/Projects/HealthClub/prisma/schema.prisma) with optimized multi-column indexes for search, filtering, and sorting across all entities:

- **`Member`**: Profiles, tiers, expiration dates, bKash verification, and renewal states.
- **`Partner`**: Hospitals, diagnostic centers, department discounts, working hours, and emergency helplines.
- **`PartnerStaff`**: Cashier & counter desk accounts for discount transaction tracking.
- **`Transaction`**: Member hospital visit records, bill amounts, and savings calculated.
- **`Doctor`**: Specialist consultants, departments, degrees, chamber addresses, visiting hours, and availability.
- **`PartnerRequest`**: Onboarding applications from new hospitals and diagnostic facilities.
- **`SystemSetting`**: Dynamic key-value store for fees, notices, emergency rosters, health tips, and VAPID keys.
- **`AdminUser`**: Database-backed admin team members with granular RBAC permissions.
- **`DatabaseSnapshot`**: Automatic and manual JSON/SQL backup dumps with metadata.
- **`Review`**: Verified member star ratings and feedback for partner hospitals.
- **`PushSubscription`**: Web Push VAPID subscription endpoints for PWA notifications.

To inspect data visually in Prisma Studio:
```bash
npx prisma studio
```

---

## 📱 Progressive Web App (PWA) & Offline Mode

Health Club is configured as a standalone Progressive Web App powered by Serwist Service Worker:
- **Offline Caching**: The member's digital card and emergency hospital contacts are cached using `CacheStorage` and `localStorage`, ensuring members can present their ID card even without internet access.
- **Web Push Engine**: Supports browser push alerts for renewals, hospital discount receipts, and health alerts.
- **Install Prompts**: Smart install prompts optimized for Android (Chrome), iOS (Safari "Add to Home Screen"), and Desktop.

---

## 📂 Project Structure

```
HealthClub/
├── prisma/
│   └── schema.prisma              # Prisma data models & database indexes
├── public/
│   ├── images/                    # Optimized WebP assets and doctor photos
│   ├── icons/                     # PWA maskable icons
│   ├── manifest.webmanifest       # PWA Web App Manifest
│   ├── llms.txt & llms-full.txt   # Generative Engine Optimization (GEO) knowledge bases
│   └── og-image.png               # Compressed 1200x630 social preview card
├── src/
│   ├── app/
│   │   ├── (public)/              # Emergency, Consultants, Hospitals, Health Tools, Health Tips
│   │   ├── admin/                 # Admin operations, analytics, broadcasts, staff, backups
│   │   ├── dashboard/             # Member portal, digital card, renewals, notifications
│   │   ├── partner/               # Hospital partner dashboard, QR scanner, doctor rosters
│   │   ├── actions/               # Next.js Server Actions (CRUD, auth, analytics, broadcasts)
│   │   ├── globals.css            # Tailwind v4 theme tokens & color definitions
│   │   ├── layout.tsx             # Root layout with SEO JSON-LD schema & providers
│   │   └── proxy.ts               # Next.js 16 request routing & JWT security proxy
│   ├── components/
│   │   ├── analytics/             # GA4 & Core Web Vitals trackers
│   │   ├── layout/                # Responsive navigation headers, drawers & footer
│   │   ├── pwa/                   # PWA install banners & push prompt dialogs
│   │   └── ui/                    # shadcn/ui accessible components
│   ├── data/                      # Initial data & clinical evaluation reference tables
│   ├── lib/                       # Analytics, mail, SMS, PDF export, telemetry, and permissions
│   │   └── translations/          # Modular split dictionaries (Bangla & English)
│   └── sw.ts                      # Serwist Service Worker configuration
└── todo.md                        # Comprehensive 86-task roadmap & audit log
```

---

## 📜 Scripts & Commands

| Command | Description |
| :--- | :--- |
| `yarn dev` | Starts the Next.js development server on `http://localhost:3000` |
| `yarn build` | Compiles the production build with Webpack & Serwist Service Worker |
| `yarn start` | Runs the built production server |
| `yarn lint` | Runs ESLint to check for code quality and unused variables |
| `npx prisma db push` | Pushes Prisma schema changes directly to the database |
| `npx prisma generate` | Regenerates the Prisma Client TypeScript types |
| `npx prisma studio` | Launches visual Prisma Studio database GUI on `http://localhost:5555` |

---

## 📄 License & Attribution

Designed and developed for **Health Club (হেলথ ক্লাব)**, Feni, Bangladesh. All rights reserved.
