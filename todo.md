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


