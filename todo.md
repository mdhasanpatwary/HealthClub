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

- [x] **TODO-73**: **Compress `og-image.png` (620 KB → <100 KB)**
  - **Files**: `public/og-image.png`
  - **Details**: OpenGraph image is 620 KB — should be <100 KB for fast social sharing previews. Compress to optimized WebP or JPEG at 1200×630, targeting ~50-80 KB.

- [x] **TODO-74**: **Reduce `favicon.ico` Size (104 KB → <10 KB)**
  - **Files**: `public/favicon.ico`
  - **Details**: Favicon is 104 KB — standard favicons should be <10 KB. Regenerate at standard sizes (16×16, 32×32, 48×48) and target ~5-10 KB.

- [x] **TODO-75**: **Split Translation Files by Route Namespace**
  - **Files**: `src/lib/translations.bn.ts` (183 KB, 1378 lines), `src/lib/translations.en.ts` (101 KB, 1378 lines), `src/components/layout/LanguageProvider.tsx`, `src/app/layout.tsx`
  - **Details**: The entire active locale dictionary (~100-183 KB of strings) is serialized into the RSC payload on every page navigation. Split translations by route namespace (e.g., `landing`, `admin`, `dashboard`, `consultants`, `emergency`, `health-tools`) and load only the keys needed per page. Target 60-80% reduction in per-page translation payload.

### 🟠 P1 — High-Priority Performance Issues

- [x] **TODO-76**: **Add `next/dynamic` Code Splitting for Below-Fold Homepage Components**
  - **Files**: `src/app/page.tsx`, `src/components/ui/SavingsCalculator.tsx`, `src/components/ui/TestimonialCarousel.tsx`, `src/components/landing/FAQSection.tsx`, `src/components/landing/ContactForm.tsx`
  - **Details**: No uses of `next/dynamic` or `React.lazy` exist in the project. Heavy client components (SavingsCalculator: 316 lines, TestimonialCarousel: 147 lines, FAQSection, ContactForm) are eagerly loaded on the homepage even when below the fold. Wrap with `next/dynamic({ loading: () => <Skeleton /> })` to defer loading.

- [x] **TODO-77**: **Replace Raw `<img>` Tags with `next/image`**
  - **Files**: `src/app/admin/components/MemberDetailsDialog.tsx`, `src/app/admin/components/MembersTab.tsx`, `src/app/partner/dashboard/components/PartnerBillingTab.tsx`, `src/app/partner/dashboard/components/PartnerCardPreview.tsx`
  - **Details**: 4 files use raw `<img>` tags which bypass Next.js image optimization (no WebP/AVIF conversion, no lazy loading, no responsive sizes, no blur placeholder). Replace with `<Image>` from `next/image` with appropriate `width`/`height` and `sizes` props.

- [x] **TODO-78**: **Optimize Header Component — Consolidate 5 useEffect Hooks**
  - **Files**: `src/components/layout/Header.tsx`
  - **Details**: Header has 5 separate `useEffect` hooks that fire on mount and several on pathname change. The scroll listener creates a new function on every mount and `dbStore.getCurrentUser()` parses localStorage JSON on every pathname change. Consolidate effects, debounce scroll listener, and remove unnecessary `pathname` dependency from auth-sync effect (auth changes already fire via custom `auth-change` event).

- [x] **TODO-79**: **Slim Down `dbStore` — Remove Pass-Through Abstraction**
  - **Files**: `src/services/dbStore.ts` (468 lines) -> Replaced by `src/services/authStore.ts`
  - **Details**: `dbStore` is a pass-through layer that re-exports server actions with zero added value for most methods (e.g., `async getDoctors() { return getDoctorsAction(); }`). This imports every server action file regardless of which page loads, hurting client bundle parse time and tree-shaking. Refactor: import server actions directly where needed. Keep only the localStorage session helpers (`getCurrentUser`, `setCurrentUser`, `logout`, etc.) in a slim `authStore` module.

- [x] **TODO-80**: **Refactor Files Exceeding 500-Line Limit**
  - **Files**: `src/app/partner/dashboard/components/PartnerDoctorModals.tsx` (952 lines), `src/data/clinicalEvaluatorData.ts` (718 lines), `src/app/health-tools/components/DiabetesEvaluatorTab.tsx` (650 lines), `src/app/admin/components/broadcast/BroadcastComposer.tsx` (647 lines), `src/lib/bulkImportUtils.ts` (621 lines), `src/app/health-tools/components/PregnancyCalculator.tsx` (596 lines), `src/app/health-tools/components/HealthReportExportButton.tsx` (589 lines), `src/app/actions/dbBackupActions.ts` (561 lines)
  - **Details**: 8 files exceed the project's 500-line limit. `PartnerDoctorModals.tsx` at 952 lines is nearly 2× the limit. Large files hurt parse times, tree-shaking, and maintainability. Split into smaller, focused subcomponents, hooks, or helper modules.

### 🟡 P2/P3 — Medium-Priority Performance Issues

- [x] **TODO-81**: **Fix Dev-Mode PrismaClient Recreation on Every Module Load**
  - **Files**: `src/lib/prisma.ts`
  - **Details**: In dev mode, a new `PrismaClient` is created on every module load (lines 43-45), overriding the cached instance. While the `pg.Pool` is reused, PrismaClient instance overhead (internal caches, type maps) adds unnecessary latency. Remove the dev-mode override and rely on server restart after `prisma generate`.

- [x] **TODO-82**: **Fix Double `.filter()` in MemberDetailsDialog**
  - **Files**: `src/app/admin/components/MemberDetailsDialog.tsx`
  - **Details**: The same `transactions.filter(t => t.memberId === viewingMember.id)` runs twice — once to check `.length > 0` and again to `.map()`. Extract to a single `const memberTxs = ...` variable and reuse.

- [x] **TODO-83**: **Add Database Indexes for Text Search Queries**
  - **Files**: `prisma/schema.prisma`
  - **Details**: Transaction search uses `OR` with `contains` (case-insensitive LIKE) on `memberName`, `memberId`, `partnerName`, `id` — causing full table scans as data grows. Consider adding PostgreSQL `pg_trgm` extension with GIN indexes for text search columns, or at minimum add a composite `@@index([memberId, partnerId])` for filtered queries.

- [x] **TODO-84**: **Lazy-Load `xlsx` Library (Admin-Only Bulk Import)**
  - **Files**: `package.json`, `src/lib/bulkImportUtils.ts`
  - **Details**: The `xlsx` package (~1 MB minified) is a top-level dependency but only used in admin bulk import. Ensure it's only imported server-side or behind dynamic import to prevent client bundle bloat.

- [x] **TODO-85**: **Lazy-Load `html-to-image` and `html5-qrcode` Libraries**
  - **Files**: `package.json`, related component files
  - **Details**: `html5-qrcode` (~350 KB) is only used for QR scanning (partner dashboard) and `html-to-image` only for card exports. If imported at top level, they bloat the initial JS bundle. Use dynamic `import()` only when the user clicks "Scan QR" or "Export Card".

- [x] **TODO-86**: **Add Route-Specific `loading.tsx` for Key Routes**
  - **Files**: `src/app/admin/loading.tsx` (new), `src/app/dashboard/loading.tsx` (new), `src/app/partner/dashboard/loading.tsx` (new), `src/app/consultants/loading.tsx` (new)
  - **Details**: Only the root `loading.tsx` exists. Routes like `/admin`, `/dashboard`, `/partner/dashboard`, `/consultants` lack their own loading states, causing users to see the homepage skeleton when navigating to admin. Add route-specific `loading.tsx` files with contextually appropriate skeleton UIs.

---

## 🔍 Phase 13: Local SEO, Feni Keyword Optimization & Google 1st-Page Ranking

- [x] **TODO-87**: **Feni Doctor & Serial SEO Optimization (Doctor List, Serial Numbers, Chamber Schedules)**
  - **Target Keywords**: `feni doctor list`, `feni doctor serial number`, `feni doctor appointment`, `feni doctors info`, `feni doctor schedule`, `ফেনী ডাক্তার তালিকা`, `ফেনী ডাক্তারদের তথ্য`, `ফেনী ডাক্তার সিরিয়াল`, `ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী`, `ফেনীতে আজ কোন ডাক্তার বসেন`.
  - **Files**: `src/app/consultants/page.tsx`, `src/components/consultants/ConsultantsGuide.tsx`, `src/components/consultants/ConsultantsFAQ.tsx`, `src/lib/translations.bn.ts`, `src/lib/translations.en.ts`
  - **Details**: Update `/consultants` page metadata, dynamic title/description, high-ranking H1/H2 headings, bilingual keywords, and FAQ content to aggressively rank for all general Feni doctor and appointment serial queries.

- [x] **TODO-88**: **Specialized & Categorized Doctor SEO Landing & Filter System**
  - **Target Specializations**: Medicine, Child Specialist (Pediatrician), Gynaecologist & Obstetrician, Cardiologist, Orthopedic, Dermatologist (Skin & VD), Eye Specialist, ENT Specialist, Diabetes & Hormone.
  - **Target Keywords**: `feni medicine specialist doctor`, `feni child specialist doctor`, `feni gynecologist doctor list`, `feni orthopedic doctor`, `feni eye specialist doctor`, `ফেনীর শিশু বিশেষজ্ঞ ডাক্তার`, `ফেনীর মেডিসিন বিশেষজ্ঞ`, `ফেনীর সেরা গাইনি ডাক্তার`, `ফেনীর হার্ট বিশেষজ্ঞ ডাক্তার`, `ফেনীর অর্থোপেডিক ডাক্তার`.
  - **Files**: `src/app/consultants/page.tsx`, `src/components/ui/DoctorDirectory.tsx`, `src/app/sitemap.ts`
  - **Details**: Implement SEO-friendly specialty filters, dynamic metadata based on category selection, canonical tag management, and contextual landing copy for specific medical departments in Feni.

- [x] **TODO-89**: **Blood Donor & 24/7 Emergency Medical Services SEO**
  - **Target Keywords**: `feni blood donor`, `feni blood bank contact number`, `blood donor in feni`, `feni emergency ambulance service`, `feni ambulance number`, `icu ambulance feni`, `feni oxygen cylinder`, `ফেনী রক্তদাতা`, `ফেনী ব্লাড ব্যাংক`, `ফেনীর রক্তের গ্রুপ ডিরেক্টরি`, `ফেনী অ্যাম্বুলেন্স সেবা`, `ফেনী অক্সিজেন সিলিন্ডার সেবা`.
  - **Files**: `src/app/emergency/page.tsx`, `src/app/emergency/components/EmergencyDirectory.tsx`, `src/components/emergency/EmergencyGuide.tsx`, `src/components/emergency/EmergencyFAQ.tsx`
  - **Details**: Optimize the `/emergency` route metadata, indexable blood group directory, 24/7 emergency ambulance hotline keywords, and Red Crescent / Sadar Hospital emergency references.

- [x] **TODO-90**: **Hospital, Diagnostic Center & Medical Test Discount SEO**
  - **Target Keywords**: `feni hospital list`, `feni diagnostic center list`, `feni private hospital`, `feni blood test discount`, `feni pathology lab discount`, `feni medical test price list`, `ফেনী ডায়াগনস্টিক সেন্টার তালিকা`, `ফেনী হাসপাতাল তালিকা`, `ফেনী ক্লিনিক ও ডায়াগনস্টিক`, `ফেনী প্যাথলজি ল্যাব ছাড়`, `ফেনী মডেল ফার্মেসি`, `ফেনী ঔষধ ডিসকাউন্ট`.
  - **Files**: `src/app/partner-hospitals/page.tsx`, `src/app/partner-hospitals/components/PartnerDirectory.tsx`, `src/components/partner-hospitals/PartnerHospitalsGuide.tsx`, `src/components/partner-hospitals/PartnerHospitalsFAQ.tsx`
  - **Details**: Enhance `/partner-hospitals` metadata, partner category filters (Hospitals, Diagnostic Labs, Pharmacies), member discount rate keywords (10% to 30% savings), and diagnostic test pricing queries.

- [x] **TODO-91**: **Doctor Profile Rich Snippets (Physician & MedicalSpecialty Schema JSON-LD)**
  - **Files**: `src/app/consultants/[id]/page.tsx`, `src/components/seo/JsonLd.tsx`, `src/lib/seo/doctorSchema.ts`
  - **Details**: Integrate Google-compliant Schema.org `Physician` and `MedicalSpecialty` JSON-LD structured data into doctor detail pages (`/consultants/[id]`), including name, qualification, specialty, chamber location, contact phone, visiting hours, and consultation fee info for Google Rich Snippets.

- [x] **TODO-92**: **Hospital & Diagnostic Lab Rich Snippets (MedicalOrganization & DiagnosticLab Schema)**
  - **Files**: `src/app/partner-hospitals/[id]/page.tsx`, `src/components/seo/JsonLd.tsx`, `src/lib/seo/partnerSchema.ts`
  - **Details**: Implement Schema.org `MedicalOrganization`, `Hospital`, `DiagnosticLab`, `Pharmacy`, `PriceSpecification`, and `Offer` structured data on partner hospital profile pages to display verified location, contact, and discount offers in Google search results.

- [x] **TODO-93**: **Dynamic XML Sitemap & Breadcrumbs Schema for Feni Healthcare Pages**
  - **Files**: `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/components/seo/JsonLd.tsx`
  - **Details**: Update `sitemap.ts` to dynamically fetch and index all published doctor profile URLs (`/consultants/[id]`) and partner hospital URLs (`/partner-hospitals/[id]`) with proper `lastmod` timestamps, priority, and `BreadcrumbList` schema for seamless crawling by Googlebot.

---

## 🛠️ Phase 15: Unexpected Behavioral Issues, Security & Integrity Fixes (TODO-94 to TODO-106)

### 🔴 P0 — Critical Security & Data Integrity

- [x] **TODO-94**: **Fix Cashier Privilege Escalation & Plaintext Credential Leakage**
  - **Severity**: Critical
  - **Files**: `src/app/actions/partnerStaffActions.ts`, `src/app/partner/dashboard/page.tsx`, `src/app/partner/dashboard/components/PartnerStaffTab.tsx`
  - **Details**: Staff management actions (`getPartnerStaffListAction`, `createPartnerStaffAction`, `updatePartnerStaffAction`, `resetPartnerStaffPasswordAction`, `deletePartnerStaffAction`) incorrectly authorize callers with `session.role === "partner_staff"`. Ordinary cashiers can call these actions to decrypt and view the plaintext passwords (`plainPassword`) of all other cashiers and managers, as well as create, modify, reset passwords for, or delete other staff. Restrict staff management actions strictly to `session.role === "partner"` or staff with `staffRole === "manager"`, and hide the "Staff & Counters" tab on the Partner Dashboard for cashiers.

- [x] **TODO-95**: **Fix Arbitrary Member Review Impersonation Bug**
  - **Severity**: Critical
  - **Files**: `src/app/actions/reviewActions.ts`
  - **Details**: In `canMemberReviewPartnerAction` (L98-L121) and `submitReviewAction` (L189-L215), when an admin user checks eligibility or submits a review and does not have a linked `Member` record matching their ID or email, the code falls back to `prisma.member.findFirst()`. This takes an arbitrary innocent member in the database and creates/modifies reviews under their identity. Remove this fallback and handle admin reviews explicitly or disallow reviews without a verified linked member profile.

- [x] **TODO-96**: **Fix PostgreSQL Database Backup Export Column Mapping & Table Name Incompatibility**
  - **Severity**: Critical
  - **Files**: `src/lib/dbBackupUtils.ts`, `src/app/actions/dbBackupActions.ts`
  - **Details**: In `generateTableSql`, Prisma queries return JavaScript camelCase property names (`joinedDate`, `expiryDate`, `qrCodeUrl`, `totalSaved`, `createdAt`), but PostgreSQL requires snake_case database column names (`joined_date`, `expiry_date`, `qr_code_url`, `total_saved`, `created_at`). Furthermore, table names like `partnerStaff`, `partnerRequests`, `contactMessages`, `systemSettings`, etc. are emitted in camelCase instead of snake_case (`partner_staff`, `partner_requests`, etc.). The generated `.sql` database backup cannot be restored into PostgreSQL/Supabase. Map Prisma fields and model names to their actual PostgreSQL snake_case identifiers.

### 🟠 P1 — High-Priority Business Logic & Permissions

- [x] **TODO-97**: **Fix Permanent 0% Renewal Retention Rate & Zero Total Renewals in Revenue Analytics**
  - **Severity**: High
  - **Files**: `src/app/actions/analyticsActions.ts`, `src/app/actions/memberAdminActions.ts`
  - **Details**: `analyticsActions.ts` queries `WHERE renewal_status = 'approved'`, but when an admin approves a renewal in `approveMemberRenewalAction`, it sets `renewalStatus: "none"`. Consequently, `totalRenewedCount` in Revenue Analytics is permanently 0 and `renewalRetentionRate` is always 0.00%. Maintain renewal records or query members where `expiry_date > joined_date + INTERVAL '1 year'` to accurately compute renewals and retention.

- [x] **TODO-98**: **Prevent Full Deletion of Linked Doctors by Partner Facilities**
  - **Severity**: High
  - **Files**: `src/app/actions/partnerDoctorActions.ts`
  - **Details**: In `deletePartnerDoctorAction`, when a partner deletes a doctor from their chamber roster, it executes `prisma.doctor.delete({ where: { id: doctorId } })`. If an admin-seeded doctor was linked to that partner, the doctor is permanently deleted from the entire platform directory instead of just removing the partner affiliation. Check if the doctor was created by the partner or linked from the central directory, and unlink (`partnerId: null`) instead of permanently deleting.

- [x] **TODO-99**: **Enforce Granular Admin RBAC on Server Action RPC Endpoints**
  - **Severity**: High
  - **Files**: `src/app/actions/broadcastActions.ts`, `src/app/actions/bulkImportActions.ts`, `src/app/actions/emergencyAdminActions.ts`, `src/app/actions/healthTipsAdminActions.ts`
  - **Details**: Server actions only verify `session.role === "admin"` without checking `hasAdminPermission(session.adminRole, permission)`. A restricted admin (such as `support_staff`) can invoke server actions directly via RPC to send mass broadcast emails/SMS or bulk import data. Integrate granular permission checks using `hasAdminPermission` in all administrative Server Actions.

### 🟡 P2 — Medium-Priority Inconsistencies & Caching

- [x] **TODO-100**: **Fix Incomplete Member Status Counts in Admin Stats**
  - **Severity**: Medium
  - **Files**: `src/app/actions/transactionActions.ts`
  - **Details**: In `getCachedAdminStats`, `active_members` counts `status = 'active'`, and `inactive_members` counts `status = 'inactive'`, ignoring members in `'pending_approval'` or `'pending_payment'`. As a result, `active_members + inactive_members` does not equal `total_members`. Add a `pending_members` counter or adjust inactive calculations to account for all non-active member statuses.

- [x] **TODO-101**: **Revalidate Admin Stats Cache on Administrative Data Mutations**
  - **Severity**: Medium
  - **Files**: `src/app/actions/memberAdminActions.ts`, `src/app/actions/doctorActions.ts`, `src/app/actions/partnerActions.ts`, `src/app/actions/partnerRequestActions.ts`, `src/app/actions/contactActions.ts`
  - **Details**: The admin statistics cache (`admin-stats` tag) is only revalidated in `addTransactionAction` and `addPartnerTransactionAction`. Creating/updating/deleting members, approving partner requests, adding/deleting doctors, or deleting contact messages leaves the admin dashboard summary cards stale for up to 60 seconds. Call `updateTag("admin-stats")` upon modifying any relevant entity.

- [x] **TODO-102**: **Unify Discount Capping Rules Across Admin and Partner Portals**
  - **Severity**: Medium
  - **Files**: `src/lib/utils.ts`, `src/app/actions/transactionActions.ts`, `src/app/actions/partnerTransactionActions.ts`
  - **Details**: `parseDiscountPercentage` in `src/lib/utils.ts` and `addTransactionAction` cap discounts at 30% (`0.30`), whereas `addPartnerTransactionAction` supports up to 70% (`0.70`). Align the discount capping policy across both utilities and server actions so high-discount healthcare services (e.g., 40-50% off pathology tests) are consistently allowed.

- [x] **TODO-103**: **Fix Outdated Doctor Cache Revalidation Path in Bulk Import**
  - **Severity**: Medium
  - **Files**: `src/app/actions/bulkImportActions.ts`
  - **Details**: In `bulkImportDoctorsAction`, line 125 calls `revalidatePath("/doctors")` instead of `/consultants` (since the doctor directory route was moved to `/consultants`). Update to `revalidatePath("/consultants")` so the public directory cache is purged immediately after bulk imports.

### 🟢 P3 — Low-Priority Edge Cases & Anti-Spam

- [x] **TODO-104**: **Prevent Race Conditions on SystemSetting JSON Collections**
  - **Severity**: Low
  - **Files**: `src/app/actions/healthTipsAdminActions.ts`, `src/app/actions/emergencyActions.ts`
  - **Details**: `submitArticleReactionAction` and `registerBloodDonorAction` perform read-modify-write operations on JSON strings in `SystemSetting` without database locks. High concurrent requests can cause votes or submissions to overwrite each other. Use database transactions, locking, or atomic structures.

- [x] **TODO-105**: **Add Rate Limiting & Phone Deduplication on Public Emergency Forms**
  - **Severity**: Low
  - **Files**: `src/app/actions/emergencyActions.ts`
  - **Details**: `registerBloodDonorAction` and `registerAmbulanceAction` lack rate limiting (unlike contact forms) and do not check if a phone number already exists before appending to the list, allowing potential spam bloating of system settings. Add sliding-window rate limiting and deduplication checks.

- [x] **TODO-106**: **Fix Date Timezone Shift on `input[type="date"]` in Pregnancy Calculator**
  - **Severity**: Low
  - **Files**: `src/app/health-tools/components/PregnancyCalculator.tsx`
  - **Details**: `new Date(lmpDate)` parses `"YYYY-MM-DD"` as UTC midnight. When accessed with local date methods (`getFullYear()`, `getMonth()`, `getDate()`) in negative timezones (e.g. UTC-5), the date can shift backwards by one day. Parse `YYYY-MM-DD` explicitly using `const [y, m, d] = str.split("-").map(Number); new Date(y, m - 1, d);`.

---

## 🌟 Phase 16: Performance, Dynamic Settings, i18n & UX Enhancements (TODO-107 to TODO-114)

### ⚡ Performance & Asset Optimization (Item 2)

- [x] **TODO-107**: **Purge Unused Legacy PNG Assets & Update Metadata References to WebP**
  - **Severity**: High
  - **Files**: `public/images/`, `src/app/manifest.ts`, `src/app/layout.tsx`, `src/app/emergency/page.tsx`
  - **Details**: Update PWA manifest, root JSON-LD metadata, and emergency schema to reference `/images/member-card-logo.webp` (11 KB) instead of the uncompressed `member-card-logo.png` (270 KB). Remove legacy unreferenced PNG files (`health-club-logo.png` 373 KB, `member-card-bg.png` 509 KB, `member-card-logo.png` 270 KB) from `public/images/` to reduce repository and bundle payload.

- [x] **TODO-108**: **Add Server-Side Pagination for Customer Reviews & Partner Statements**
  - **Severity**: Medium
  - **Files**: `src/app/actions/reviewActions.ts`, `src/app/actions/partnerAnalyticsActions.ts`, `src/components/reviews/ReviewSection.tsx`, `src/app/admin/components/ReviewsTab.tsx`
  - **Details**: Enforce server-side pagination with `skip`/`take` and cursor/page controls on member review queries and partner monthly transaction statements to ensure scalability and fast query responses as records grow.

### 🔒 Security, Dynamic Settings & Session Invalidation (Items 3.2 & 3.3)

- [x] **TODO-109**: **Connect Contact Helplines & Social Links to Dynamic System Settings**
  - **Severity**: Medium
  - **Files**: `src/components/layout/Footer.tsx`, `src/components/landing/ContactForm.tsx`, `src/data/emergencyData.ts`, `src/app/actions/systemSettingsActions.ts`
  - **Details**: Replace hardcoded contact numbers (`01886763849`), email addresses (`healthclubfeni@gmail.com`), and WhatsApp links across Footer, Contact Form, and Emergency directory with dynamically fetched `SystemSetting` keys (`contact_hotline`, `contact_whatsapp`, `contact_email`, `facebook_url`) with fallback to environment variables.

- [x] **TODO-110**: **Invalidate Active JWT Sessions on Partner Staff Deactivation & Password Reset**
  - **Severity**: High
  - **Files**: `src/proxy.ts`, `src/lib/session.ts`, `src/app/actions/partnerStaffActions.ts`
  - **Details**: When an admin or partner manager deactivates a cashier (`isActive: false`) or resets their password in `PartnerStaff`, ensure their active JWT session is immediately invalidated on the next request by verifying staff active status in proxy/server actions or incorporating a token revision timestamp.

### 🌐 Localization (i18n) Standardization (Item 4)

- [x] **TODO-111**: **Replace Ad-Hoc Inline Ternary Locale Checks with i18n Dictionary Keys**
  - **Severity**: Medium
  - **Files**: `src/components/layout/Footer.tsx`, `src/components/partner-hospitals/HospitalProfileView.tsx`, `src/lib/translations/`
  - **Details**: Replace inline `currentLocale === "en" ? ... : ...` ternary strings in `Footer.tsx` (emergency, health tools, health tips links) and `HospitalProfileView.tsx` (breadcrumbs, facility category labels) with standard dictionary keys loaded from translation namespaces.

### 📱 Mobile-First UX, Accessibility (a11y) & Print Media (Item 5)

- [x] **TODO-112**: **Implement Screen Reader Live Announcements (`aria-live`) for Dynamic Search**
  - **Severity**: Low
  - **Files**: `src/components/ui/DoctorDirectory.tsx`, `src/app/partner-hospitals/components/PartnerDirectory.tsx`, `src/app/emergency/components/EmergencyDirectory.tsx`
  - **Details**: Add screen-reader-only live announcement regions (`<div aria-live="polite" className="sr-only">`) to dynamically notify assistive technology users of matching result counts when category filters or search inputs change.

- [x] **TODO-113**: **Standardize CR80 Physical PVC Card Print Sizing & Media Queries**
  - **Severity**: Low
  - **Files**: `src/app/dashboard/print/page.tsx`, `src/components/ui/MemberCard.tsx`
  - **Details**: Add precise CR80 physical card dimensions (`85.60mm × 53.98mm`) and high-DPI scaling rules inside `@media print` on `/dashboard/print` to support high-quality printing on PVC ID card printers and wallet photo laminates.

### 📊 Observability & Failure Telemetry (Item 6)

- [x] **TODO-114**: **Add Telemetry Breadcrumbs for OTP Delivery Failures & Payment Disputes**
  - **Severity**: Medium
  - **Files**: `src/lib/telemetry.ts`, `src/app/actions/memberAuthActions.ts`, `src/app/actions/memberActions.ts`
  - **Details**: Instrument structured telemetry error events (`telemetry.captureEvent`) when email OTP delivery fails or when duplicate/invalid bKash transaction IDs are submitted to facilitate real-time monitoring and rapid dispute resolution.

### 🔐 Authentication & Zero-Junk Registration Architecture (Item 7)

- [x] **TODO-115**: **Implement Email OTP Verification Before Database Record Insertion**
  - **Severity**: High
  - **Files**: `src/lib/pendingRegistration.ts`, `src/app/actions/memberActions.ts`, `src/app/actions/memberAuthActions.ts`, `src/app/register/verify-email/page.tsx`
  - **Details**: Refactor user signup to store unverified registration data in a signed/encrypted HttpOnly cookie session (`hc_pending_registration`), dispatching the OTP and creating the `Member` record in the database only upon successful 6-digit OTP verification. Allows users with mistyped emails to re-register without phone number locking.

### 🔍 Search Engine Optimization & Crawlability (Item 8)

- [x] **TODO-116**: **Fix Search Console Crawlability, Canonical Alignment & Inherited Hreflang Conflicts**
  - **Severity**: High
  - **Files**: `src/lib/siteConfig.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/robots.ts`, `src/app/partner-hospitals/page.tsx`, `src/components/ui/PartnerDirectory.tsx`, `src/app/consultants/page.tsx`, `src/app/consultants/[id]/page.tsx`, `src/app/partner-hospitals/[id]/page.tsx`, `src/app/health-tips/[slug]/page.tsx`
  - **Details**: Resolved Google Search Console indexing bottlenecks by setting primary `SITE_URL` to `https://www.healthclubfeni.com` to eliminate 308 redirect loops, removing conflicting root layout `hreflang` inheritance that pointed subpage alternates to `/`, adding dynamic category-specific metadata and matching canonicals for `/partner-hospitals?category=...`, tightening `robots.ts` disallowed paths to protect crawl budget from private routes, and ensuring all dynamic pages provide consistent, self-referencing canonical and localized alternate headers.

### 🏗️ File Modularization & 500-Line Limit Compliance (Item 9)

- [x] **TODO-117**: **Modularize Files Exceeding the 500-Line Strict Limit**
  - **Severity**: High
  - **Files**: `src/app/actions/adminNotificationActions.ts`, `src/app/actions/memberActions.ts`, `src/app/admin/components/SettingsTab.tsx`, `src/data/doctorSeoData.ts`
  - **Details**: Refactor files exceeding the project's strict 500-line code limit:
    1. Extract notification item formatting, persistence helpers, and filtering logic from `adminNotificationActions.ts` (545 lines) into `adminNotificationHelpers.ts`.
    2. Extract member payment/renewal processing (`submitBkashPaymentAction`, `requestRenewalAction`) from `memberActions.ts` (531 lines) into `memberPaymentActions.ts`, and prune legacy wrapper re-exports.
    3. Split `SettingsTab.tsx` (507 lines) into modular subcomponents (`FeeSettingsCard.tsx`, `PaymentSettingsCard.tsx`, `ContactSettingsCard.tsx`, `NoticeSettingsCard.tsx`).
    4. Break `doctorSeoData.ts` (825 lines) into structured category/department sub-data files.

### 🛡️ Role-Based Access Control & Granular Security (Item 10)

- [x] **TODO-118**: **Fix Admin Navigation Identity Check for Secondary Admin Roles**
  - **Severity**: High
  - **Files**: `src/components/layout/UserDropdown.tsx`, `src/components/layout/MobileNavDrawer.tsx`, `src/app/login/page.tsx`
  - **Details**: Update admin detection in `UserDropdown.tsx` and `MobileNavDrawer.tsx` from checking exclusively `user.email === NEXT_PUBLIC_ADMIN_EMAIL` to also recognizing `user.id.startsWith("admin_")` or validating session role. This ensures secondary administrators (`super_admin`, `content_moderator`, `support_staff`) created via `adminUserActions.ts` with custom email addresses correctly see the "Admin Panel" link instead of being misidentified as regular members.

- [x] **TODO-119**: **Add Granular RBAC Permission Check on Admin Transaction Creation**
  - **Severity**: Medium
  - **Files**: `src/app/actions/transactionActions.ts`
  - **Details**: Enforce `hasAdminPermission(session.adminRole || "super_admin", "manage_transactions")` inside `addTransactionAction` when invoked by an admin session, preventing unauthorized transactions from staff with restricted administrative privileges (e.g., support staff or content moderators).

### 🔔 UI Standards & Notification Deduplication (Item 11)

- [x] **TODO-120**: **Remove Duplicate Inline Error Banners & Enforce Semantic Destructive Styling**
  - **Severity**: Medium
  - **Files**: `src/app/partner/dashboard/components/PartnerAnalyticsTab.tsx`, `src/app/admin/components/RevenueAnalyticsTab.tsx`
  - **Details**: Comply with project notification rules ("No Duplicate Error Banners"): remove redundant inline error cards (`<Card className="border-red-200 ...">...<AlertCircle .../>`) in `PartnerAnalyticsTab.tsx` and `RevenueAnalyticsTab.tsx` since errors are already dispatched via `toast.error(errorMsg)`. Replace non-standard ad-hoc colors (`border-red-200`, `text-red-500`, `text-red-600`) with semantic `@theme` tokens (`destructive`).

### 📝 Form Management & Validation Standardization (Item 12)

- [x] **TODO-121**: **Integrate React Hook Form & Comprehensive Zod Schemas for Client Forms**
  - **Severity**: Medium
  - **Files**: `package.json`, `src/lib/validations/member.ts`, `src/lib/validations/emergency.ts`, `src/lib/validations/contact.ts`, `src/lib/validations/doctor.ts`, `src/lib/validations/settings.ts`, `src/lib/validations/index.ts`, `src/app/actions/memberActions.ts`, `src/app/actions/emergencyActions.ts`, `src/app/actions/contactActions.ts`, `src/app/actions/partnerDoctorActions.ts`, `src/app/actions/systemSettingsActions.ts`, `src/app/register/page.tsx`, `src/app/emergency/components/BloodDonorRegisterDialog.tsx`, `src/app/emergency/components/AmbulanceRegisterDialog.tsx`, `src/components/landing/ContactForm.tsx`, `src/app/partner/dashboard/components/doctor-modals/EditChamberScheduleDialog.tsx`, `src/app/admin/components/SettingsTab.tsx`
  - **Details**: Installed `react-hook-form` and `@hookform/resolvers` and standardized form management and input validation across the application in compliance with project rules. Created centralized Zod validation schemas under `src/lib/validations/` ensuring DRY synchronization and full Next.js App Router compatibility. Replaced manual multi-state input bindings and ad-hoc string checks with React Hook Form controllers and Zod schema validation across member registration, emergency registrations (blood donors and ambulances), contact inquiries, partner doctor chamber schedules, and administrative system settings while keeping all files strictly under the 500-line limit.

### 🗄️ Scalability & Database Performance (Item 13)

- [x] **TODO-122**: **Migrate Emergency Donors & Ambulances from Monolithic SystemSetting JSON to Relational Tables**
  - **Severity**: Medium
  - **Files**: `prisma/schema.prisma`, `src/app/actions/emergencyActions.ts`, `src/app/actions/emergencyAdminActions.ts`, `src/data/emergencyData.ts`
  - **Details**: Refactor `emergency_donors` and `emergency_ambulances` from monolithic JSON strings stored inside `system_settings` (which require heavy `SELECT ... FOR UPDATE` row locks and full array in-memory serialization on every write) into dedicated relational Prisma models (`BloodDonor` and `AmbulanceService`) with database-level `phone` unique constraints and indexed upazila queries.

### 🧼 Code Quality, Typing & Telemetry Health (Item 14)

- [x] **TODO-123**: **Route Direct `console.error` Calls Through Centralized Logger & Fix ESLint Effect Suppressions**
  - **Severity**: Low
  - **Files**: `src/app/partner/dashboard/components/PartnerBillingTab.tsx`, `src/components/layout/InstallAppBanner.tsx`, `src/components/layout/Header.tsx`, `src/app/partner/dashboard/components/PartnerAnalyticsTab.tsx`, `src/app/admin/components/RevenueAnalyticsTab.tsx`
  - **Details**: Replace raw `console.error` calls in `PartnerBillingTab.tsx` (camera scanner) and `InstallAppBanner.tsx` (PWA install prompt) with `logger.error` for consistent error sanitization. Refactor `react-hooks/set-state-in-effect` ESLint suppressions in `Header.tsx`, `PartnerAnalyticsTab.tsx`, and `RevenueAnalyticsTab.tsx` to eliminate cascading state update anti-patterns.

- [x] **TODO-124**: **Eliminate `any` Type Assertions Across Core Server Actions**
  - **Severity**: Low
  - **Files**: `src/app/actions/doctorActions.ts`, `src/app/actions/partnerDoctorActions.ts`, `src/app/actions/partnerRequestActions.ts`, `src/app/actions/partnerActions.ts`, `src/app/actions/memberAdminActions.ts`, `src/app/actions/memberActions.ts`, `src/app/actions/transactionActions.ts`, `src/app/actions/contactActions.ts`
  - **Details**: Replaced loose `any` parameter types, where clauses, update inputs, and mappings with explicit Prisma models and types (`Prisma.DoctorGetPayload`, `Prisma.DoctorWhereInput`, `Prisma.PartnerGetPayload`, `Prisma.PartnerWhereInput`, `Prisma.PartnerRequestGetPayload`, `Prisma.PartnerRequestWhereInput`, `Prisma.MemberGetPayload`, `Prisma.MemberWhereInput`, `Prisma.MemberUpdateInput`, `Prisma.TransactionWhereInput`, `Prisma.ContactMessageWhereInput`, and `VerifiedPartnerMember`). Removed all `no-explicit-any` ESLint suppressions while maintaining strict compliance with the 500-line limit across all server action files.

---

## 🛡️ Phase 17: Critical Logical Errors, Access Control, Data Integrity & Cache Resiliency (TODO-125 to TODO-140)

### 🚨 Critical Security & Access Control (P1)

- [x] **TODO-125**: **Fix Authentication Bypass & Account Takeover in `submitBkashPaymentAction`**
  - **Severity**: Critical
  - **Files**: `src/app/actions/memberPaymentActions.ts`
  - **Details**: In `submitBkashPaymentAction`, `isAuthorized` evaluates to `true` for unauthenticated callers whenever the target member's status is `"inactive"` or `"pending_approval"`, calling `setSessionUser(cleanId, "user")` without requiring a password, OTP, or active session. Secure the action by verifying that payment submissions for registration are guarded by a signed registration cookie (`pending_reg_token`) or restricted strictly to authenticated users matching `session?.userId === cleanId`. Never issue an authenticated member session to an unauthenticated caller.

- [x] **TODO-126**: **Prevent Public Exposure of Unapproved Blood Donors & Ambulances**
  - **Severity**: Critical
  - **Files**: `src/app/actions/emergencyAdminActions.ts`, `src/app/actions/broadcastActions.ts`
  - **Details**: `getEmergencyDataAction` queries `prisma.bloodDonor.findMany` and `prisma.ambulanceService.findMany` without `{ where: { status: "approved" } }`, publicly displaying pending or spam submissions on `/emergency`. Similarly, `broadcastActions.ts` queries all donors without checking `status: "approved"`. Add `{ where: { status: "approved" } }` to `getEmergencyDataAction` and `getBloodDonorsList()`.

- [x] **TODO-127**: **Enforce Instant Session Invalidation for Deactivated or Deleted Admin Users**
  - **Severity**: Critical
  - **Files**: `src/lib/session.ts`, `src/app/actions/adminUserActions.ts`
  - **Details**: `session.ts` only validates database active status for `partner_staff`. For `role === "admin"`, JWT sessions remain trusted for up to 7 days even if the admin account is suspended (`isActive: false`), demoted, or deleted. Add a database verification helper `verifyActiveAdminUser(userId)` inside `getSessionUser` to immediately invalidate sessions of deactivated, demoted, or deleted administrators.

### ⚠️ Data Integrity, Tenure & State Restoration (P1 / P2)

- [x] **TODO-128**: **Preserve Member Historical `joinedDate` on Status Updates**
  - **Severity**: High
  - **Files**: `src/app/actions/memberAdminActions.ts`
  - **Details**: In `updateMemberStatusAction`, toggling a member's status to `"active"` overwrites `updateData.joinedDate = new Date()`, wiping their original signup year and seniority. Check if `joinedDate` is already present on the member record and only set `joinedDate = now` if it was previously null or uninitialized.

- [x] **TODO-129**: **Eliminate Fallback to Hardcoded Seed Data on Valid Empty (0-Row) Database Queries**
  - **Severity**: High
  - **Files**: `src/app/actions/doctorActions.ts`, `src/app/actions/partnerDoctorActions.ts`, `src/app/actions/emergencyAdminActions.ts`
  - **Details**: In `getDoctorsAction`, `getPartnerDoctorsAction`, and `getEmergencyDataAction`, when the database returns 0 rows (e.g. after legitimate deletion, deactivation, or partner doctor unlinking), the actions fall back to hardcoded seed lists (`initialDoctors`, `INITIAL_BLOOD_DONORS`, `INITIAL_AMBULANCES`), making it impossible to remove or clear records. Remove the runtime fallback to seed arrays on read queries now that database tables and migrations are fully in place.

- [x] **TODO-130**: **Fix Un-deletable Base Health Tips in `healthTipsAdminActions.ts`**
  - **Severity**: High
  - **Files**: `src/app/actions/healthTipsAdminActions.ts`
  - **Details**: In `getAllHealthTipsAction`, any article from `HEALTH_TIPS_ARTICLES` missing from `dbMap` is automatically reconstructed and re-persisted into `system_settings`, effectively resurrecting deleted base articles on the very next read. Maintain an explicit list of deleted slugs or remove the automatic resurrection merge pattern so admin deletions remain permanent.

- [x] **TODO-131**: **Reset Chamber Details When Doctor is Unlinked from Partner Facility**
  - **Severity**: High
  - **Files**: `src/app/actions/partnerDoctorActions.ts`
  - **Details**: When a doctor is linked to a partner hospital, `chamberName` and `chamberAddress` are overwritten with the hospital's name and address. When `unlinkDoctorFromPartnerAction` is called, it resets `partnerId: null, roomNo: null` but leaves the stale hospital chamber address and name intact on the doctor record. Clear or reset `chamberName` and `chamberAddress` to default chamber info or empty when unlinking.

- [x] **TODO-132**: **Fix PostgreSQL Case-Sensitivity in Member Password Reset Queries**
  - **Severity**: Medium
  - **Files**: `src/app/actions/memberPasswordResetActions.ts`
  - **Details**: In `requestPasswordResetAction` and `verifyPasswordResetOtpAction`, the email is normalized into `cleanEmail = email.trim().toLowerCase()` for rate limiting, but the Prisma query searches using raw, unnormalized `email`: `prisma.member.findFirst({ where: { email } })`. Because PostgreSQL string comparison is case-sensitive, searching with raw `email` fails when casing does not match. Use `cleanEmail` (or case-insensitive mode) in the Prisma where clauses.

- [x] **TODO-133**: **Prevent Concurrency Race Condition & Duplicate Creation on Partner Requests**
  - **Severity**: Medium
  - **Files**: `src/app/actions/partnerRequestActions.ts`
  - **Details**: `approvePartnerRequestAction` does not check `{ where: { id: requestId, status: "pending" } }` atomically. If an admin double-clicks or multiple admins approve simultaneously, duplicate partner accounts are generated or unique constraint violations (P2002) are thrown. Guard approval within a transaction checking that `status === "pending"` before creating the partner.

### 🔄 Cache Synchronization & Background Maintenance (P2)

- [x] **TODO-134**: **Fix Cache Tag Mismatch on Bulk Import of Doctors & Partners**
  - **Severity**: High
  - **Files**: `src/app/actions/bulkImportActions.ts`
  - **Details**: `bulkImportDoctorsAction` invalidates tag `"doctors-data"` and `bulkImportPartnersAction` invalidates tag `"partners-data"`. However, the read queries in `doctorActions.ts`, `partnerActions.ts`, and `partnerProfileQueryActions.ts` cache under `"doctors"` and `"partners"`. Update bulk import invalidations to use the exact canonical tags (`"doctors"` and `"partners"`).

- [x] **TODO-135**: **Add Cache Invalidation & Path Revalidation on Review Moderation & Deletion**
  - **Severity**: Medium
  - **Files**: `src/app/actions/reviewActions.ts`
  - **Details**: `submitReviewAction`, `moderateReviewAction`, and `deleteReviewAction` update database records and calculate average ratings, but never call `updateTag` or `revalidatePath`. Add cache busting for `"partners"` tag and revalidate `/partner-hospitals` and `/partner-hospitals/[slug]` so updated ratings and review counts reflect immediately.

- [x] **TODO-136**: **Automatically Purge Expired Subscriptions in Web Push Broadcasts**
  - **Severity**: Medium
  - **Files**: `src/app/actions/pushNotificationActions.ts`
  - **Details**: In `sendPushBroadcastAction`, when an endpoint returns HTTP 410 Gone / 404 Not Found (`res.expired === true`), the server increments `expired++` in memory but never deletes the defunct subscription from `prisma.pushSubscription`. Collect expired endpoint URLs and delete them from the database in batch (`deleteMany({ where: { endpoint: { in: expiredEndpoints } } })`).

- [x] **TODO-137**: **Deduplicate Hotlines on Bulk Import to Prevent Endless Accumulation**
  - **Severity**: Low
  - **Files**: `src/app/actions/bulkImportEmergencyActions.ts`
  - **Details**: `bulkImportHotlinesAction` prepends new hotlines directly onto existing ones without deduplicating by phone or Bengali title, multiplying duplicate hotlines on repeated CSV/JSON imports. Add deduplication by phone and title before saving to `system_settings`.

### 🛡️ RBAC Permissions, PWA & Reporting Alignment (P2 / P3)

- [x] **TODO-138**: **Fix RBAC Route Guard Lockout on `/admin/reviews` for Content Moderators**
  - **Severity**: Medium
  - **Files**: `src/lib/permissions.ts`, `src/proxy.ts`
  - **Details**: The `/admin/reviews` route is omitted from `ROLE_CONFIGS.content_moderator.allowedRoutes` and `ROLE_CONFIGS.support_staff.allowedRoutes` (and missing from `ROLE_CONFIGS.super_admin.allowedRoutes`). Content moderators visiting `/admin/reviews` are blocked by `proxy.ts` and redirected to `/admin`. Add `"/admin/reviews"` to `allowedRoutes` and add the `"manage_reviews"` permission key.

- [x] **TODO-139**: **Prevent PWA Standalone Status Overwrite on Standard Browser Visits**
  - **Severity**: Medium
  - **Files**: `src/app/actions/pwaActions.ts`
  - **Details**: In `recordPwaSessionAction`, `isStandalone: Boolean(isStandalone)` is unconditionally written to the database. If a user installs the PWA (`isStandalone: true`) and later opens the website in a standard Chrome/Safari tab, `isStandalone` is overwritten with `false`, distorting install metrics and undercounting active installations. Only set `isStandalone: true` when present; never downgrade to `false` on standard session telemetry.

- [x] **TODO-140**: **Include Relational Emergency Records (`BloodDonor`, `AmbulanceService`) in DB Backup Summary**
  - **Severity**: Low
  - **Files**: `src/app/actions/dbBackupActions.ts`, `src/services/db.ts`, `src/app/admin/components/DbBackupTableStats.tsx`, `src/app/admin/components/DbBackupExportTab.tsx`
  - **Details**: `getDatabaseStatsSummaryAction` aggregates record counts across all relational database tables including `prisma.bloodDonor.count()` and `prisma.ambulanceService.count()`. Added both counts to the transaction, summary stats object, and stats cards/export table selector so the Admin Database Backup & Retention page (`/admin/settings/backup`) displays accurate total database records.

