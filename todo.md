# Health Club (হেলথ ক্লাব) — Consistency Fixes TODO List

This document lists all tasks required to resolve the 21 architectural, data, API, business logic, and UI/UX inconsistencies discovered during the consistency audit.

---

## 🚀 Phase 1: P0 — Critical System Blockers (Data Integrity & Auth)

- [x] **TODO-01**: **Fix Member Status Activation Bug & Ghost Expiry**
  - **Files**: `src/app/actions/memberActions.ts`, `src/app/actions/memberAdminActions.ts`, `src/services/dbStore.ts`
  - **Details**: When admin sets a member's status to `"active"`, ensure `joinedDate` is set to today (`now`), `expiryDate` is set to 1 year ahead (`now + 1 year`), and renewal fields (`renewalStatus`, `renewalBkashSender`, `renewalBkashTxnId`) are reset to `null`.

- [x] **TODO-02**: **Consolidate Member Server Actions & Unify Function Signatures**
  - **Files**: `src/app/actions/memberActions.ts`, `src/app/actions/memberAdminActions.ts`, `src/services/dbStore.ts`
  - **Details**: Eliminate duplicate actions (`getMembersAction`, `updateMemberProfileAction`, `updateMemberStatusAction`). Standardize on unified object parameter signatures (`(id: string, updates: Partial<Member>)`) and consistent error/return contracts across the entire codebase.

- [x] **TODO-03**: **Persist `contactName` in Partner Onboarding Application**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/partnerRequestActions.ts`, `src/app/become-partner/page.tsx`, `src/app/admin/components/PartnerRequestsTab.tsx`
  - **Details**: Add `contactName String?` to the `PartnerRequest` model in Prisma. Update `addPartnerRequestAction` to save `contactName`, update `/become-partner` form payload, and render the contact name in the Admin Partner Requests table.

---

## ⚡ Phase 2: P1 — High-Priority Functional & Contract Alignments

- [x] **TODO-04**: **Standardize Transaction Date Serialization (ISO-8601)**
  - **Files**: `src/app/actions/transactionActions.ts`, `src/app/actions/partnerActions.ts`, `src/app/admin/components/MemberDetailsDialog.tsx`, `src/app/partner/dashboard/page.tsx`
  - **Details**: Ensure all transaction queries output date as standard ISO-8601 strings (`.toISOString()`). Update consumer dialogs and partner dashboard to format dates safely using standard date utilities instead of fragile string splitting (`.split(" ")[0]`).

- [x] **TODO-05**: **Connect Sonner Toast Notifications in Admin Quick Transactions**
  - **Files**: `src/app/admin/hooks/useAdminData.ts`, `src/app/admin/components/TransactionDialog.tsx`
  - **Details**: Call `toast.error(res.error)` and `toast.success(...)` directly inside `handleAddTransaction` in `useAdminData.ts`. Remove unused `txSuccess` and `txError` props from `TransactionDialog.tsx`.

- [x] **TODO-06**: **Add Missing Public Routes to Proxy Fast-Path Whitelist**
  - **Files**: `src/proxy.ts`
  - **Details**: Add `"/forgot-password"`, `"/forgot-password/reset"`, `"/consultants"`, and `"/doctors"` to the `publicRoutes` fast-path array to eliminate unnecessary JWT decryption overhead on public pages.

- [x] **TODO-07**: **Standardize Admin Role Check Across Client & Server**
  - **Files**: `src/components/layout/Header.tsx`, `src/components/layout/UserDropdown.tsx`, `src/app/login/page.tsx`
  - **Details**: Replace hardcoded literal `"healthclubfeni@gmail.com"` in `Header.tsx` mobile menu with `process.env.NEXT_PUBLIC_ADMIN_EMAIL` and `user.role === "admin"` check.

- [x] **TODO-08**: **Deduplicate `/profile` Route and `/dashboard` Profile Tab**
  - **Files**: `src/app/profile/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/components/DashboardProfileTab.tsx`, `src/components/layout/BottomNav.tsx`
  - **Details**: Extract a shared `<ProfileForm />` component or redirect `/profile` to `/dashboard?tab=profile` to eliminate duplicated form state, dual data fetching, and split translation keys.

- [x] **TODO-09**: **Align Member Profile Validation Rules Between User & Admin Creation**
  - **Files**: `src/app/register/page.tsx`, `src/app/admin/components/MemberDialog.tsx`
  - **Details**: Harmonize validation schemas so admin-created members and self-registered members have consistent default and required profile attributes.

---

## 🛠️ Phase 3: P2 — Medium-Priority UI/UX & Code Quality

- [x] **TODO-10**: **Implement Proper i18n Dictionary Keys in Admin Tabs**
  - **Files**: `src/app/admin/components/RenewalsTab.tsx`, `src/app/admin/components/PartnerRequestsTab.tsx`, `src/app/admin/components/DoctorsTab.tsx`, `src/app/admin/components/DoctorDialog.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Replace ad-hoc ternary checks (`locale === "bn" ? ... : ...`) and hardcoded strings with dictionary keys accessed via `t(...)`.

- [x] **TODO-11**: **Fix Malformed Translation Key in Member Renewal Page**
  - **Files**: `src/app/dashboard/renew/page.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Replace `t("যেমন: BGA678UHG", "e.g., BGA678UHG")` with proper key `t("dashboard.renew.txnPlaceholder")`. Remove unused `AlertCircle` import.

- [x] **TODO-12**: **Remove Duplicate Inline Success Banner in Profile Form**
  - **Files**: `src/app/dashboard/components/DashboardProfileTab.tsx`
  - **Details**: Remove inline `<div className="mb-4 bg-emerald-50 ...">...</div>` success banner to conform to project notification standards (rely strictly on Sonner toast notifications).

- [x] **TODO-13**: **Remove Phantom `"family"` Tier Fallbacks in Admin Tables**
  - **Files**: `src/app/admin/components/MembersTab.tsx`, `src/app/admin/components/MemberDetailsDialog.tsx`
  - **Details**: Remove legacy fallback checks for `"family"` tier and maintain strict union type `founding | premium`.

- [x] **TODO-14**: **Add Suspense Loading Skeletons to Admin & Partner Login Pages**
  - **Files**: `src/app/login/admin/page.tsx`, `src/app/login/partner/page.tsx`
  - **Details**: Implement consistent loading skeletons and submit disabling during async authentication requests.

- [x] **TODO-15**: **Harmonize Directory Search & Empty State Components**
  - **Files**: `src/app/doctors/components/DoctorDirectory.tsx`, `src/app/partner-hospitals/components/PartnerDirectory.tsx`
  - **Details**: Unify category filter pill styles, search input iconography, and empty state cards between the Doctor Directory and Partner Hospital Directory.

- [x] **TODO-16**: **Standardize Number & Currency Formatting Across All Views**
  - **Files**: `src/lib/i18n.ts`, `src/components/home/SavingsCalculator.tsx`, `src/components/home/LandingPricing.tsx`, `src/app/admin/components/RenewalsTab.tsx`
  - **Details**: Consistently use `formatNum(val, locale)` to format numbers and currency symbols (৳) across both user-facing and admin interfaces.

- [x] **TODO-17**: **Decouple Doctor Auto-Seeding from Query Action**
  - **Files**: `src/app/actions/doctorActions.ts`
  - **Details**: Separate auto-seeding logic from `getDoctorsAction` into an explicit seeder function (`seedDoctorsAction`) to eliminate side effects inside cached server action queries.

---

## 🎨 Phase 4: P3 — Low Priority: Polish & Code Hygiene

- [x] **TODO-18**: **Resolve Unused Variable Warnings from ESLint**
  - **Files**: `src/app/admin/components/TransactionDialog.tsx`, `src/app/dashboard/renew/page.tsx`
  - **Details**: Remove unused `txSuccess`, `txError`, and `AlertCircle` imports/variables.

- [x] **TODO-19**: **Unify Partner Transaction Discount Validation Limit**
  - **Files**: `src/app/actions/transactionActions.ts`, `src/app/actions/partnerActions.ts`
  - **Details**: Unify the discount capping rules (max 70%) across both admin transaction and partner transaction actions.

- [x] **TODO-20**: **Standardize User Avatar Initials Fallback**
  - **Files**: `src/components/layout/Header.tsx`, `src/components/layout/UserDropdown.tsx`
  - **Details**: Standardize avatar initials casing (`.toUpperCase()`) and background gradient styles.

- [x] **TODO-21**: **Source Social Links from System Settings**
  - **Files**: `src/components/landing/ContactForm.tsx`, `src/app/actions/systemSettingsActions.ts`
  - **Details**: Replace hardcoded Facebook page URL with dynamically configurable `SystemSetting` value.

---

## 🌟 Phase 5: New Features & Platform Enhancements (User-Approved)

- [x] **TODO-22**: **Family & Relatives Coverage Policy & Benefit Badging**
  - **Files**: `src/app/membership/page.tsx`, `src/components/home/LandingPricing.tsx`, `src/components/home/FaqAccordion.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Explicitly clarify across membership pricing, FAQs, and benefits that a single Health Club membership card covers the member, their entire family, and relatives for hospital discounts and bill payments.

- [x] **TODO-23**: **Emergency Health Services Directory (রক্তদাতা, অ্যাম্বুলেন্স ও অক্সিজেন)**
  - **Files**: `src/app/emergency/page.tsx`, `src/app/emergency/components/EmergencyDirectory.tsx`, `src/app/emergency/components/BloodDonorRegisterDialog.tsx`, `src/data/emergencyData.ts`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/proxy.ts`
  - **Details**: Build a fast, mobile-first Emergency Services Directory with Blood Donor search by group & upazila, 24/7 Ambulance list with direct dial, emergency oxygen/hotlines, and a voluntary blood donor registration form.

- [x] **TODO-24**: **Interactive Health Calculators Suite (BMI, Ideal Weight, Water Intake, Calories)**
  - **Files**: `src/app/health-tools/page.tsx`, `src/app/health-tools/components/BmiCalculator.tsx`, `src/app/health-tools/components/WaterIntakeCalculator.tsx`, `src/app/health-tools/components/CalorieCalculator.tsx`, `src/proxy.ts`, `src/components/layout/Header.tsx`
  - **Details**: Create interactive, mobile-optimized bilingual health calculators with visual indicators, status badges, and actionable lifestyle & health advice.

- [x] **TODO-25**: **Admin Settings Management UI Panel (`/admin/settings`)**
  - **Files**: `src/app/admin/settings/page.tsx`, `src/app/admin/components/AdminNav.tsx`, `src/app/admin/components/SettingsTab.tsx`, `src/app/actions/systemSettingsActions.ts`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Implement a settings panel in Admin Portal to configure membership fees (Founding/Premium), bKash merchant/personal numbers, hotline/WhatsApp numbers, official emails, social links, and dynamic site notices backed by Prisma `SystemSetting`.

- [x] **TODO-26**: **Admin & Partner Data Export to CSV / Excel**
  - **Files**: `src/lib/exportUtils.ts`, `src/app/admin/components/MembersTab.tsx`, `src/app/admin/components/TransactionsTab.tsx`, `src/app/admin/components/PartnersTab.tsx`, `src/app/admin/components/RenewalsTab.tsx`, `src/app/partner/dashboard/page.tsx`
  - **Details**: Build reusable CSV data export utility with UTF-8 BOM encoding for proper Bangla text support in Excel, adding one-click Export buttons to all Admin data tables and Partner dashboard.

- [x] **TODO-27**: **Health Tips & Medical Knowledge Blog (`/health-tips`)**
  - **Files**: `src/app/health-tips/page.tsx`, `src/app/health-tips/[slug]/page.tsx`, `src/app/health-tips/components/HealthTipsDirectory.tsx`, `src/data/healthTipsData.ts`, `src/proxy.ts`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
  - **Details**: Build a rich health blog & wellness guides hub with category filtering, search, full article reader with key takeaways, social share, related specialist recommendations, and SEO JsonLd schema.

---

## 🌟 Phase 6: Admin Content Management (CRUD) for Emergency & Health Tips

- [x] **TODO-28**: **Backend Server Actions for Emergency & Health Tips CRUD**
  - **Files**: `src/app/actions/emergencyAdminActions.ts`, `src/app/actions/healthTipsAdminActions.ts`
  - **Details**: Create secure, cached Server Actions to fetch, create, update, and delete Blood Donors, Ambulances, Emergency Hotlines, and Health Tips Articles backed by `SystemSetting` key-value persistence with fallback to initial data.

- [x] **TODO-29**: **Admin UI Panel for Emergency Services (`/admin/emergency`)**
  - **Files**: `src/app/admin/emergency/page.tsx`, `src/app/admin/components/EmergencyTab.tsx`, `src/app/admin/components/EmergencyDonorDialog.tsx`, `src/app/admin/components/EmergencyAmbulanceDialog.tsx`, `src/app/admin/components/EmergencyHotlineDialog.tsx`
  - **Details**: Create comprehensive tabbed management interface for Blood Donors, Ambulances, and Hotlines/Oxygen with search, add, edit, delete confirmation, and availability toggle.

- [x] **TODO-30**: **Admin UI Panel for Health Tips & Blog (`/admin/health-tips`)**
  - **Files**: `src/app/admin/health-tips/page.tsx`, `src/app/admin/components/HealthTipsTab.tsx`, `src/app/admin/components/HealthTipArticleDialog.tsx`
  - **Details**: Create article management panel with article table, search, category filter, and rich modal dialog for writing/editing bilingual articles and key takeaways.

- [x] **TODO-31**: **Admin Navigation & Public Frontend Integration**
  - **Files**: `src/app/admin/components/AdminNav.tsx`, `src/app/emergency/page.tsx`, `src/app/emergency/components/EmergencyDirectory.tsx`, `src/app/health-tips/page.tsx`, `src/app/health-tips/[slug]/page.tsx`
  - **Details**: Add navigation items to Admin sidebar/nav bar and connect public emergency and health tips pages to real-time server actions.

- [x] **TODO-32**: **Admin Panel Main Header Menu > Submenu Navigation System**
  - **Files**: `src/components/layout/Header.tsx`, `src/components/layout/AdminHeaderNav.tsx`, `src/components/layout/PublicHeaderNav.tsx`, `src/components/layout/MobileNavDrawer.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Modernized main header with context-aware desktop navigation displaying categorized Menu > Submenu dropdowns (Dashboard, Members & Billing, Medical Network, Services & Content, System & Support, Live Website Switcher), live badge counters, and grouped mobile drawer. Split header components to strictly respect the 500-line limit.

---

## 🌟 Phase 7: Member & Partner Portal Enhancements (TODO-33 to TODO-37)

- [x] **TODO-33** (1.6): **Member In-App Notification Center & Real-Time Alerts**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/memberNotificationActions.ts`, `src/app/dashboard/components/MemberNotificationBell.tsx`, `src/app/dashboard/page.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Implement an in-app notification center for registered members to receive real-time alerts when renewals are approved/rejected, when hospital partner records discount transactions, or when membership approaches expiration.

- [x] **TODO-34** (2.1): **Partner Profile, Contact & Department Discount Branding Editor**
  - **Files**: `src/app/partner/dashboard/page.tsx`, `src/app/partner/dashboard/components/PartnerProfileSettingsTab.tsx`, `src/app/actions/partnerActions.ts`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Enable partner hospitals and diagnostic centers to update their own address, contact numbers, emergency helpline, working hours, and detailed department discount breakdown (e.g. Pathology, Radiology, Bed charge, Pharmacy).

- [x] **TODO-35** (2.2): **Partner Hospital Doctor Roster & Chamber Management**
  - **Files**: `src/app/partner/dashboard/doctors/page.tsx`, `src/app/partner/dashboard/components/PartnerDoctorsTab.tsx`, `src/app/actions/doctorActions.ts`, `src/app/actions/partnerActions.ts`
  - **Details**: Provide a dedicated tab in partner dashboard allowing hospitals to view, link/unlink, and manage specialist doctors practicing in their chambers, updating room numbers and visiting schedules.

- [x] **TODO-36** (2.3): **Partner Monthly Settlement Statements & Analytics**
  - **Files**: `src/app/partner/dashboard/analytics/page.tsx`, `src/app/partner/dashboard/components/PartnerAnalyticsTab.tsx`, `src/app/actions/partnerActions.ts`, `src/lib/exportUtils.ts`
  - **Details**: Build partner analytics dashboard with monthly patient volume charts, total discount dispensed, peak visiting days, and downloadable monthly billing statement summaries in CSV/PDF.


- [x] **TODO-37** (2.4): **Partner Multi-Cashier & Counter Staff Accounts**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/partnerStaffActions.ts`, `src/app/partner/dashboard/components/PartnerStaffTab.tsx`, `src/proxy.ts`
  - **Details**: Allow hospital admin accounts to create individual cashier/counter sub-logins with desk identifiers (e.g., "Counter 1 - Billing", "Pharmacy Desk") to track who processed each discount transaction.

---

## 🌟 Phase 8: Admin Operations, Analytics & Management (TODO-38 to TODO-42)

- [x] **TODO-38** (3.2): **Admin Broadcast SMS & Email Campaign Manager**
  - **Files**: `src/app/admin/broadcast/page.tsx`, `src/app/admin/components/BroadcastTab.tsx`, `src/app/actions/broadcastActions.ts`, `src/lib/mail.ts`, `src/app/admin/components/AdminNav.tsx`
  - **Details**: Build broadcast messaging tool in Admin Portal to draft and send mass announcements (Free Health Camps, new hospital discounts, blood donation appeals) to segmented user groups (All Members, Active only, Blood Donors, Partners).

- [x] **TODO-39** (3.3): **Admin Financial & Revenue Analytics Dashboard**
  - **Files**: `src/app/admin/analytics/page.tsx`, `src/app/admin/components/RevenueAnalyticsTab.tsx`, `src/app/actions/analyticsActions.ts`, `src/app/admin/components/AdminNav.tsx`
  - **Details**: Implement visual revenue charts and KPIs tracking membership subscription revenue, renewal retention rates, monthly transaction volumes, and top-performing partner hospitals.

- [x] **TODO-40** (3.4): **Admin Bulk Data Operations & Excel/CSV Importer**
  - **Files**: `src/app/admin/import/page.tsx`, `src/app/admin/components/BulkImportDialog.tsx`, `src/app/actions/bulkImportActions.ts`, `src/app/admin/components/DoctorsTab.tsx`, `src/app/admin/components/PartnersTab.tsx`
  - **Details**: Build bulk data importer supporting `.xlsx` and `.csv` files to import doctors, hospitals, and emergency contacts in batches with column auto-mapping and validation error reporting.

- [x] **TODO-41** (3.5): **Admin Role-Based Access Control (RBAC) & Staff Management**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/adminUserActions.ts`, `src/app/admin/staff/page.tsx`, `src/app/admin/components/AdminStaffTab.tsx`, `src/proxy.ts`, `src/lib/session.ts`
  - **Details**: Replace single hardcoded admin email with database-backed `AdminUser` model supporting granular roles (`super_admin`, `content_moderator`, `support_staff`) with permissions matrix.

- [x] **TODO-42** (3.6): **Database Snapshot & Automated Backup Management**
  - **Files**: `src/app/admin/settings/backup/page.tsx`, `src/app/actions/dbBackupActions.ts`, `src/app/admin/components/SettingsTab.tsx`
  - **Details**: Implement one-click admin database backup export (JSON/SQL dump) and snapshot management with retention controls for disaster recovery.

---

## 🌟 Phase 9: Medical Network, Discovery & Directory (TODO-43 to TODO-48)

- [x] **TODO-43** (4.1): **Dedicated SEO Doctor Profile Detail Pages (`/consultants/[id]`)**
  - **Files**: `src/app/consultants/[id]/page.tsx`, `src/components/consultants/DoctorProfileView.tsx`, `src/app/actions/doctorActions.ts`, `src/proxy.ts`
  - **Details**: Create dynamic, SEO-optimized individual profile pages for specialist doctors with qualifications, chamber schedules, appointment serial button, Google Maps chamber directions, and JSON-LD schema.

- [x] **TODO-44** (4.2): **Dedicated Partner Hospital & Clinic Profile Pages (`/partner-hospitals/[id]`)**
  - **Files**: `src/app/partner-hospitals/[id]/page.tsx`, `src/components/partner-hospitals/HospitalProfileView.tsx`, `src/app/actions/partnerActions.ts`, `src/proxy.ts`
  - **Details**: Build comprehensive hospital profile pages showcasing facility badges (ICU, CCU, 24/7 Emergency, Dialysis, Ambulance), photo gallery, itemized department discounts, and resident doctor roster.

- [x] **TODO-45** (4.3): **Upazila & Area Location Filtering for Doctors & Hospitals**
  - **Files**: `prisma/schema.prisma`, `src/app/consultants/page.tsx`, `src/app/partner-hospitals/page.tsx`, `src/components/ui/DoctorDirectory.tsx`, `src/app/partner-hospitals/components/PartnerDirectory.tsx`
  - **Details**: Add `upazila` / `area` field to Doctor and Partner schemas and introduce area filtering pills (Feni Sadar, Chhagalnaiya, Daganbhuiyan, Sonagazi, Parshuram, Fulgazi) across directories.

- [x] **TODO-46** (4.4): **Doctor Chamber Availability Status & Schedule Notices**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/doctorActions.ts`, `src/app/admin/components/DoctorDialog.tsx`, `src/components/ui/DoctorDirectory.tsx`, `src/app/consultants/[id]/page.tsx`
  - **Details**: Add chamber availability toggle (`available_today`, `on_leave_until`, `notice`) to Doctor model with visual badges ("Available Today", "Chamber Closed", "On Leave until Date") on directory cards.

- [x] **TODO-47** (4.5): **Verified Member Reviews & Rating System**
  - **Files**: `prisma/schema.prisma`, `src/app/actions/reviewActions.ts`, `src/components/reviews/ReviewSection.tsx`, `src/app/admin/components/ReviewsTab.tsx`, `src/app/partner-hospitals/[id]/page.tsx`
  - **Details**: Allow verified active members who completed a discount transaction at a partner hospital to submit star ratings and service feedback with admin moderation controls.

- [x] **TODO-48** (5.3): **Ambulance Type Classification & Filtering**
  - **Files**: `src/data/emergencyData.ts`, `src/app/actions/emergencyAdminActions.ts`, `src/app/emergency/components/EmergencyDirectory.tsx`, `src/app/admin/components/EmergencyAmbulanceDialog.tsx`
  - **Details**: Classify ambulances by vehicle type (AC Ambulance, Non-AC Ambulance, ICU Support Ambulance, Freezing Carrier) with filter chips on `/emergency` and type badges.

---

## 🌟 Phase 10: Health Tools & Wellness Knowledge (TODO-49 to TODO-52)

- [x] **TODO-49** (6.1): **Pregnancy Due Date (EDD) & Trimester Progress Calculator**
  - **Files**: `src/app/health-tools/page.tsx`, `src/app/health-tools/components/PregnancyCalculator.tsx`, `src/data/pregnancyMilestones.ts`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Build an interactive Pregnancy Due Date (EDD) calculator based on Last Menstrual Period (LMP) or Ultrasound date, displaying current trimester progress, baby size milestones, and maternal nutrition advice.

- [x] **TODO-50** (6.2): **Blood Pressure & Diabetes Range Clinical Evaluator**
  - **Files**: `src/app/health-tools/page.tsx`, `src/app/health-tools/components/BpDiabetesEvaluator.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Implement interactive clinical evaluation tools for Systolic/Diastolic blood pressure categories (Normal, Elevated, Stage 1/2 Hypertension) and Fasting/2-hour post-meal blood sugar levels.

- [x] **TODO-51** (6.3): **Unified Health Assessment PDF Report Generator**
  - **Files**: `src/app/health-tools/components/HealthReportExportButton.tsx`, `src/lib/healthReportPdf.ts`, `src/app/health-tools/page.tsx`
  - **Details**: Enable users to generate and download a branded, comprehensive PDF Health Assessment Summary combining BMI, Daily Calorie target, Water intake requirement, and clinical indicators with health tips.

- [x] **TODO-52** (6.4): **Health Tips Estimated Reading Time & Reader Reactions**
  - **Files**: `src/app/health-tips/[slug]/page.tsx`, `src/app/actions/healthTipsAdminActions.ts`, `src/components/health-tips/ArticleReactions.tsx`, `src/lib/readingTime.ts`
  - **Details**: Add automated reading time calculation badge (e.g. "৩ মিনিট পড়ার সময়") and reader feedback reactions ("Was this article helpful? 👍 Helpful / 👎 Not really") with dynamic count updates.

---

## 🌟 Phase 11: PWA, Offline Caching & Infrastructure Security (TODO-53 to TODO-55)

- [x] **TODO-53** (7.1): **PWA Web Push Notifications Engine**
  - **Files**: `src/sw.ts`, `src/app/actions/pushNotificationActions.ts`, `src/components/pwa/PushNotificationPrompt.tsx`, `src/app/admin/notifications/page.tsx`
  - **Details**: Implement Web Push API with VAPID subscription keys in Service Worker to broadcast browser push alerts for membership renewal reminders, emergency blood drives, and platform health advisories.

- [x] **TODO-54** (7.2): **Offline Caching for Digital Member Card & Emergency Contacts**
  - **Files**: `src/sw.ts`, `src/app/dashboard/components/OfflineCardBanner.tsx`, `src/lib/safeStorage.ts`
  - **Details**: Configure CacheStorage & IndexedDB offline strategies in Service Worker to ensure members can view and present their digital ID card and call emergency ambulances even with zero network connectivity.

- [x] **TODO-55** (7.3): **Rate Limiting Protection on Sensitive Public Forms & Auth Actions**
  - **Files**: `src/lib/rateLimit.ts`, `src/app/actions/memberAuthActions.ts`, `src/app/actions/contactActions.ts`, `src/app/actions/partnerRequestActions.ts`
  - **Details**: Implement sliding-window rate limiting on login, registration, contact message, and partner onboarding actions to safeguard server endpoints against brute-force attempts and automated spam submissions.

---

## 🌟 Phase 12: SEO, AEO (Ask Engines) & GEO (Generative Engine Optimization) (TODO-56 to TODO-65)

- [x] **TODO-56**: **Fallback OpenGraph Image & Standard 1200x630 Social Cards**
  - **Files**: `public/og-image.png`, `src/app/layout.tsx`, `src/app/consultants/[id]/page.tsx`, `src/app/partner-hospitals/[id]/page.tsx`
  - **Details**: Generate and provide standard 1200x630 OpenGraph and Twitter card asset (`/og-image.png`) with proper `og:image:width: 1200`, `og:image:height: 630`, and update dynamic consultant/partner profile fallbacks to prevent 404 social previews.

- [x] **TODO-57**: **Convert Legacy `/doctors` Redirects to HTTP 308 Permanent Redirects**
  - **Files**: `src/app/doctors/page.tsx`, `src/app/doctors/[id]/page.tsx`, `next.config.ts`
  - **Details**: Replace Next.js `redirect()` (HTTP 307 temporary) with `permanentRedirect()` from `next/navigation` (HTTP 308 permanent) or configure `redirects()` in `next.config.ts` so search engine crawlers properly transfer PageRank and link equity to `/consultants`.

- [x] **TODO-58**: **Robots.txt Security & AI Search Crawlers Optimization**
  - **Files**: `src/app/robots.ts`
  - **Details**: Apply strict `disallow` paths (`/admin/`, `/dashboard/`, `/partner/`, `/profile/`, `/api/`) to AI user-agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`), and add support for modern AI search bots (`OAI-SearchBot`, `ChatGPT-User`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `Bingbot`).

- [x] **TODO-59**: **Sitemap.xml Database Synchronization & Stable Modification Timestamps**
  - **Files**: `src/app/sitemap.ts`
  - **Details**: Update `sitemap.ts` to fetch published health tip articles dynamically via `getAllHealthTipsAction()` rather than static array, provide stable `lastModified` dates instead of dynamic `new Date()`, and include multi-lingual alternate language tags (`alternates.languages`).

- [x] **TODO-60**: **Generative Engine Optimization (GEO): Overhaul `llms.txt` and `llms-full.txt`**
  - **Files**: `public/llms.txt`, `public/llms-full.txt`, `src/app/layout.tsx`
  - **Details**: Update `llms.txt` and `llms-full.txt` knowledge bases with comprehensive information on Emergency Services & Blood Network (`/emergency`), Specialist Doctors Directory (`/consultants`), Health Assessment Tools (`/health-tools`), Preventative Health Guides (`/health-tips`), and all 6 Feni Upazilas coverage. Add `<link rel="alternate" type="text/markdown">` head tags in `layout.tsx`.

- [x] **TODO-61**: **Organization & WebSite Schema: Add Social Entity Graph (`sameAs`) & SiteLinks Searchbox**
  - **Files**: `src/app/layout.tsx`
  - **Details**: Add `sameAs` array (official Facebook page, WhatsApp hotline, YouTube) to the global `Organization` JSON-LD schema, and attach `potentialAction: SearchAction` (Sitelinks Searchbox target `${SITE_URL}/consultants?search={search_term_string}`) to the `WebSite` schema.

- [x] **TODO-62**: **Answer Engine Optimization (AEO): Granular Medical Schema for Doctors & Hospitals**
  - **Files**: `src/app/consultants/[id]/page.tsx`, `src/app/partner-hospitals/[id]/page.tsx`
  - **Details**: Expand `Physician` schema with `isAcceptingNewPatients: true`, `availableService`, `currenciesAccepted: "BDT"`, `paymentAccepted`, and `hasCredential`. Enrich `Hospital` / `MedicalBusiness` schema with `hasOfferCatalog` specifying department discount rates.

- [x] **TODO-63**: **SoftwareApplication & WebApplication Schema for Interactive Health Tools**
  - **Files**: `src/app/health-tools/page.tsx`
  - **Details**: Add `SoftwareApplication` / `WebApplication` JSON-LD schema with `applicationCategory: "HealthApplication"`, `operatingSystem: "All"`, free tier offers, and `HowTo` structured data for the BMI, Water, and Calorie health calculators.

- [x] **TODO-64**: **Dynamic Publication & Modification Timestamps in Health Tip Articles Schema**
  - **Files**: `src/app/health-tips/[slug]/page.tsx`
  - **Details**: Dynamically derive `datePublished` and `dateModified` in `MedicalWebPage` JSON-LD from `article.publishedDate` or article timestamps to maintain accurate E-E-A-T freshness signals.

- [x] **TODO-65**: **Explicit Meta Robots Configuration for Utility, Auth & Private Subpages**
  - **Files**: `src/app/forgot-password/page.tsx`, `src/app/forgot-password/reset/page.tsx`, `src/app/register/payment/page.tsx`, `src/app/register/verify-email/page.tsx`
  - **Details**: Add explicit `robots: { index: false, follow: false }` metadata to transactional, authentication, and reset password routes to prevent duplicate or thin-content indexing.

---

## 🌟 Phase 13: Analytics, Monitoring & Observability Suite (TODO-66 to TODO-70)

- [x] **TODO-66**: **Unified Analytics & Event Tracking Engine (`src/lib/analytics.ts`)**
  - **Files**: `src/lib/analytics.ts`
  - **Details**: Strongly-typed event dispatcher supporting Google Analytics 4 (GA4 `gtag`), Vercel Analytics, and development environment structured event debugging.

- [x] **TODO-67**: **Google Analytics 4 & App Router Dynamic Pageview Tracker**
  - **Files**: `src/components/analytics/GoogleAnalytics.tsx`, `src/app/layout.tsx`
  - **Details**: Asynchronous GA4 script loader supporting `NEXT_PUBLIC_GA_MEASUREMENT_ID` with route change tracking in Next.js App Router wrapped in Suspense boundary.

- [x] **TODO-68**: **Core Web Vitals Performance Monitor**
  - **Files**: `src/components/analytics/WebVitalsTracker.tsx`, `src/app/layout.tsx`
  - **Details**: Real-user performance metric capturing (LCP, FID/INP, CLS, TTFB, FCP) via `next/web-vitals` with automated GA4 dispatch.

- [x] **TODO-69**: **High-Value User Engagement & Conversion Instrumentation**
  - **Files**: `src/app/emergency/components/EmergencyDirectory.tsx`, `src/app/emergency/components/AmbulanceCard.tsx`, `src/components/ui/doctors/DoctorModals.tsx`, `src/components/partner-hospitals/HospitalContactSidebar.tsx`, `src/app/health-tools/components/BmiCalculator.tsx`, `src/app/health-tools/components/PregnancyCalculator.tsx`, `src/app/health-tools/components/BpEvaluatorTab.tsx`, `src/app/health-tools/components/DiabetesEvaluatorTab.tsx`, `src/app/health-tools/components/WaterIntakeCalculator.tsx`, `src/app/health-tools/components/CalorieCalculator.tsx`, `src/app/health-tools/components/HealthReportExportButton.tsx`, `src/components/health-tips/ArticleReactions.tsx`, `src/components/pwa/PushNotificationPrompt.tsx`, `src/components/layout/InstallAppBanner.tsx`, `src/app/register/payment/page.tsx`, `src/app/dashboard/renew/page.tsx`
  - **Details**: Instrument all critical conversion actions: blood donor calls, ambulance calls, emergency hotlines, doctor serial bookings, hospital helplines, health tool calculations, health report PDF downloads, article helpfulness votes, PWA install prompts, and membership payment/renewal submissions.

- [x] **TODO-70**: **Production Error Telemetry & Exception Boundary Integration**
  - **Files**: `src/lib/telemetry.ts`, `src/app/error.tsx`, `src/app/global-error.tsx`
  - **Details**: Centralized exception capturing utility with Sentry/OpenTelemetry plug-and-play hook, integrated into root and segment error boundaries to capture unhandled runtime exceptions safely with PII sanitization.

---

## ⚡ Phase 14: Performance Optimization & Bundle Size (TODO-71 to TODO-86)

### 🔴 P0 — Critical Performance Issues

- [x] **TODO-71**: **Optimize Doctor Images — Convert 35 MB of PNGs to WebP**
  - **Files**: `public/images/doctors/*.png` (~50 files, 35 MB total)
  - **Details**: Doctor profile images are uncompressed PNGs ranging from 918 KB to 3.3 MB each. Convert all to WebP/AVIF format and resize to max ~400×400px for thumbnails. Target total directory size reduction from 35 MB → ~5 MB (~85% reduction). This directly impacts LCP and mobile bandwidth for users on 3G/4G in Bangladesh.

- [x] **TODO-72**: **Move Analytics Aggregation from In-Memory Loops to SQL**
  - **Files**: `src/app/actions/analyticsActions.ts`
  - **Details**: `getAdminRevenueAnalyticsAction` fetches ALL members and ALL transactions into Node.js memory, then aggregates with `for` loops. As data grows, this risks OOM crashes and severe latency. Refactor to use `prisma.$queryRaw` with SQL `GROUP BY`, `COUNT`, `SUM`, and date functions for tier breakdowns, monthly financials, and partner performance metrics.

- [ ] **TODO-73**: **Compress `og-image.png` (620 KB → <100 KB)**
  - **Files**: `public/og-image.png`
  - **Details**: OpenGraph image is 620 KB — should be <100 KB for fast social sharing previews. Compress to optimized WebP or JPEG at 1200×630, targeting ~50-80 KB.

- [ ] **TODO-74**: **Reduce `favicon.ico` Size (104 KB → <10 KB)**
  - **Files**: `public/favicon.ico`
  - **Details**: Favicon is 104 KB — standard favicons should be <10 KB. Regenerate at standard sizes (16×16, 32×32, 48×48) and target ~5-10 KB.

- [ ] **TODO-75**: **Split Translation Files by Route Namespace**
  - **Files**: `src/lib/translations.bn.ts` (183 KB, 1378 lines), `src/lib/translations.en.ts` (101 KB, 1378 lines), `src/components/layout/LanguageProvider.tsx`, `src/app/layout.tsx`
  - **Details**: The entire active locale dictionary (~100-183 KB of strings) is serialized into the RSC payload on every page navigation. Split translations by route namespace (e.g., `landing`, `admin`, `dashboard`, `consultants`, `emergency`, `health-tools`) and load only the keys needed per page. Target 60-80% reduction in per-page translation payload.

### 🟠 P1 — High-Priority Performance Issues

- [ ] **TODO-76**: **Add `next/dynamic` Code Splitting for Below-Fold Homepage Components**
  - **Files**: `src/app/page.tsx`, `src/components/ui/SavingsCalculator.tsx`, `src/components/ui/TestimonialCarousel.tsx`, `src/components/landing/FAQSection.tsx`, `src/components/landing/ContactForm.tsx`
  - **Details**: No uses of `next/dynamic` or `React.lazy` exist in the project. Heavy client components (SavingsCalculator: 316 lines, TestimonialCarousel: 147 lines, FAQSection, ContactForm) are eagerly loaded on the homepage even when below the fold. Wrap with `next/dynamic({ loading: () => <Skeleton /> })` to defer loading.

- [ ] **TODO-77**: **Replace Raw `<img>` Tags with `next/image`**
  - **Files**: `src/app/admin/components/MemberDetailsDialog.tsx`, `src/app/admin/components/MembersTab.tsx`, `src/app/partner/dashboard/components/PartnerBillingTab.tsx`, `src/app/partner/dashboard/components/PartnerCardPreview.tsx`
  - **Details**: 4 files use raw `<img>` tags which bypass Next.js image optimization (no WebP/AVIF conversion, no lazy loading, no responsive sizes, no blur placeholder). Replace with `<Image>` from `next/image` with appropriate `width`/`height` and `sizes` props.

- [ ] **TODO-78**: **Optimize Header Component — Consolidate 5 useEffect Hooks**
  - **Files**: `src/components/layout/Header.tsx`
  - **Details**: Header has 5 separate `useEffect` hooks that fire on mount and several on pathname change. The scroll listener creates a new function on every mount and `dbStore.getCurrentUser()` parses localStorage JSON on every pathname change. Consolidate effects, debounce scroll listener, and remove unnecessary `pathname` dependency from auth-sync effect (auth changes already fire via custom `auth-change` event).

- [ ] **TODO-79**: **Slim Down `dbStore` — Remove Pass-Through Abstraction**
  - **Files**: `src/services/dbStore.ts` (468 lines)
  - **Details**: `dbStore` is a pass-through layer that re-exports server actions with zero added value for most methods (e.g., `async getDoctors() { return getDoctorsAction(); }`). This imports every server action file regardless of which page loads, hurting client bundle parse time and tree-shaking. Refactor: import server actions directly where needed. Keep only the localStorage session helpers (`getCurrentUser`, `setCurrentUser`, `logout`, etc.) in a slim `authStore` module.

- [ ] **TODO-80**: **Refactor Files Exceeding 500-Line Limit**
  - **Files**: `src/app/partner/dashboard/components/PartnerDoctorModals.tsx` (952 lines), `src/data/clinicalEvaluatorData.ts` (718 lines), `src/app/health-tools/components/DiabetesEvaluatorTab.tsx` (650 lines), `src/app/admin/components/broadcast/BroadcastComposer.tsx` (647 lines), `src/lib/bulkImportUtils.ts` (621 lines), `src/app/health-tools/components/PregnancyCalculator.tsx` (596 lines), `src/app/health-tools/components/HealthReportExportButton.tsx` (589 lines), `src/app/actions/dbBackupActions.ts` (561 lines)
  - **Details**: 8 files exceed the project's 500-line limit. `PartnerDoctorModals.tsx` at 952 lines is nearly 2× the limit. Large files hurt parse times, tree-shaking, and maintainability. Split into smaller, focused subcomponents, hooks, or helper modules.

### 🟡 P2/P3 — Medium-Priority Performance Issues

- [ ] **TODO-81**: **Fix Dev-Mode PrismaClient Recreation on Every Module Load**
  - **Files**: `src/lib/prisma.ts`
  - **Details**: In dev mode, a new `PrismaClient` is created on every module load (lines 43-45), overriding the cached instance. While the `pg.Pool` is reused, PrismaClient instance overhead (internal caches, type maps) adds unnecessary latency. Remove the dev-mode override and rely on server restart after `prisma generate`.

- [ ] **TODO-82**: **Fix Double `.filter()` in MemberDetailsDialog**
  - **Files**: `src/app/admin/components/MemberDetailsDialog.tsx`
  - **Details**: The same `transactions.filter(t => t.memberId === viewingMember.id)` runs twice — once to check `.length > 0` and again to `.map()`. Extract to a single `const memberTxs = ...` variable and reuse.

- [ ] **TODO-83**: **Add Database Indexes for Text Search Queries**
  - **Files**: `prisma/schema.prisma`
  - **Details**: Transaction search uses `OR` with `contains` (case-insensitive LIKE) on `memberName`, `memberId`, `partnerName`, `id` — causing full table scans as data grows. Consider adding PostgreSQL `pg_trgm` extension with GIN indexes for text search columns, or at minimum add a composite `@@index([memberId, partnerId])` for filtered queries.

- [ ] **TODO-84**: **Lazy-Load `xlsx` Library (Admin-Only Bulk Import)**
  - **Files**: `package.json`, `src/lib/bulkImportUtils.ts`
  - **Details**: The `xlsx` package (~1 MB minified) is a top-level dependency but only used in admin bulk import. Ensure it's only imported server-side or behind dynamic import to prevent client bundle bloat.

- [ ] **TODO-85**: **Lazy-Load `html-to-image` and `html5-qrcode` Libraries**
  - **Files**: `package.json`, related component files
  - **Details**: `html5-qrcode` (~350 KB) is only used for QR scanning (partner dashboard) and `html-to-image` only for card exports. If imported at top level, they bloat the initial JS bundle. Use dynamic `import()` only when the user clicks "Scan QR" or "Export Card".

- [ ] **TODO-86**: **Add Route-Specific `loading.tsx` for Key Routes**
  - **Files**: `src/app/admin/loading.tsx` (new), `src/app/dashboard/loading.tsx` (new), `src/app/partner/dashboard/loading.tsx` (new), `src/app/consultants/loading.tsx` (new)
  - **Details**: Only the root `loading.tsx` exists. Routes like `/admin`, `/dashboard`, `/partner/dashboard`, `/consultants` lack their own loading states, causing users to see the homepage skeleton when navigating to admin. Add route-specific `loading.tsx` files with contextually appropriate skeleton UIs.

