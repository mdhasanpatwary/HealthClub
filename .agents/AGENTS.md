# Health Club - Project-Specific Agent Rules

These rules apply specifically to coding the **Health Club (হেলথ ক্লাব)** platform website. All agents working on this workspace must follow them.

## 1. Technology Stack & Framework Rules

### Next.js App Router
- Use React Server Components (RSC) by default for pages and non-interactive layout structures.
- Place `"use client"` at the very top of components that require hooks (`useState`, `useEffect`, `useActionState`, etc.) or client-side event handlers.
- Use Next.js custom metadata (`Metadata` export) for page-specific SEO.

### Tailwind CSS (v4)
- Leverage Tailwind v4's CSS-first theme configuration.
- Do NOT create a `tailwind.config.js` or `tailwind.config.ts`. Custom variables, keyframes, animations, or colors must be declared inside `src/app/globals.css` using the `@theme` directive.
- Apply semantic naming for component styling using standard utility classes:
  - `bg-primary`, `text-primary-foreground`
  - `bg-secondary`, `text-secondary-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `bg-accent`, `text-accent-foreground`

### shadcn/ui
- UI elements must utilize shadcn components found under `src/components/ui`.
- Compose elements together using shadcn interfaces rather than rewriting custom buttons or dialogs from scratch.

---

## 2. Design & Branding Guides

### Typography Rules
- **English**: Use `Inter` font.
- **Bangla**: Use `Noto Sans Bengali` font.
- Apply high font weights for titles (700-800) and normal weights for body (400-500).
- Set a readable line-height (e.g., `leading-relaxed` or `leading-loose`).
- Restrict maximum content width to `max-w-7xl` (1280px) and center page sections.

### Color Tokens (CSS Variables)
Always use the following color variables or class equivalents:
- **Primary**: `oklch(0.627 0.194 149.25)` -> Hex equivalent: `#16a34a` (Trust Green)
- **Primary Dark**: `oklch(0.518 0.166 148.97)` -> Hex equivalent: `#15803d`
- **Secondary**: `oklch(0.205 0.047 265.41)` -> Hex equivalent: `#0f172a` (Deep Slate)
- **Accent**: `oklch(0.704 0.201 148.6)` -> Hex equivalent: `#22c55e` (Bright Green)
- **Warning**: `oklch(0.768 0.18 76.5)` -> Hex equivalent: `#f59e0b` (Amber)
- **Danger**: `oklch(0.627 0.265 27.32)` -> Hex equivalent: `#ef4444` (Red)

---

## 3. Interaction & Brainstorming Mode

- **Brainstorming Workflow**: Before executing any code changes or building a component:
  1. Identify the core user needs.
  2. Brainstorm at least 2 potential layout or logic options.
  3. Detail the selection criteria and the chosen approach.
- **Strict Confirmation Policy**: If any requirement or UI design decision is ambiguous or conflicts with existing setups, **always stop and ask the user** before starting execution.

---

## 4. Core Development & Coding Rules

### Component Reuse & Modular Design
- Always design and build for reusability. Avoid duplicate UI code or business logic.
- If a component is needed in multiple views (e.g., user panel vs. admin panel), extract it to a shared layout or common UI component folder.
- Keep concerns separate: isolate data fetching, business logic, form validation, and presentation.

### UI & Styling Standards
- **shadcn/ui First Priority**: UI elements must utilize shadcn components found under `src/components/ui`. Always check there first before writing custom buttons, inputs, or menus.
- When a new common UI component is needed, add it using the shadcn CLI if possible, or build it matching the existing shadcn/Radix/Base-UI configuration.

### Framework & Performance
- **React Server Components (RSC) Preference**: Keep components as Server Components where possible. Use `"use client"` only when client-side interactivity is necessary.
- **Strict 500-Line Code Limit**: No single source code file should exceed 500 lines of code. Keep files short and split concerns into smaller, modular subcomponents, hooks, or helpers.
- **Clean & Optimized Code**: Write optimized, readable, and maintainable TypeScript following industry best practices.

### Forms & Validation
- **Validation**: Always use **Zod** for schema validation.
- **Form Management**: Always use **React Hook Form** for form state, submission handling, and validation binding.

### Notification & Toast Standards
- **Toast Notifications Mandatory**: All user-facing error, warning, and success feedback must be displayed using the application's Toaster library (`import { toast } from "sonner"`).
- Always use standard toast methods: `toast.success(...)`, `toast.error(...)`, `toast.warning(...)`, and `toast.info(...)`.
- **No Duplicate Error Banners**: Do NOT render duplicate inline error message banners inside card UI components; user notifications must be communicated strictly through the toaster.

### Pricing & Discount Display Rules
- **No Direct Discounted Taka Amounts in Pricing Tables**: In all diagnostic, procedure, care, and medical pricing tables or packages, NEVER show fixed or calculated discounted price amounts (e.g., `৳২৪০ - ৳৪০০`). Health Club member benefits must strictly display **10-30% discount** text/badge:
  - Bengali: `"১০-৩০% মেম্বার ছাড়"` or `"মেম্বার হলে ১০-৩০% ডিসকাউন্ট"` / `"১০-৩০% বিশেষ ছাড়"`
  - English: `"10-30% Member Discount"` or `"10-30% Special Discount"`
- Regular market price ranges (`regularPriceRangeBn`) can be shown as reference ranges, but the Health Club benefit column must always communicate percentage savings (`10-30%`) rather than an absolute member price.

### Partner Facility Verification & Geographic Scope Rules
- **Contract Verification Mandatory**: When writing articles, guides, or UI content mentioning Health Club partner hospitals, clinics, diagnostic centers, or doctor chambers, you MUST verify the actual contracted partner organizations (`partners` database/directory) before making any partnership or discount claims. Never invent or assume partnerships.
- **Geographic Scope (Feni Sadar Only)**: Health Club currently maintains contracted partner healthcare facilities strictly within **Feni Sadar**. Health Club has **NO** active contracts with hospitals, clinics, or diagnostic centers outside Feni Sadar (such as in Daganbhuiyan, Chhagalnaiya, Sonagazi, Parshuram, Fulgazi, etc.).
- **No False Partner Badges or Claims**:
  - Never mark facilities or doctor profiles outside Feni Sadar as `partnerStatus: true` or display "অফিসিয়াল পার্টনার চেম্বার" / "Health Club Partner" badges for them.
  - In sub-district / upazila blog guides outside Feni Sadar, do NOT show "হেলথ ক্লাব সুবিধা" (Health Club Benefit) columns in local test fee tables (`showBenefitColumn={false}`).
  - Clearly state in upazila content that Health Club member discount benefits (10-30%) apply when patients are referred to verified partner facilities located in **Feni Sadar**.

### Blog Architecture & Database-Driven Standards
- **Database Storage for Blog Posts**: All blog posts must be stored in the database (`BlogPost` model/table) rather than creating multiple separate static TypeScript files per post (`*Pricing.ts`, `*ComparisonTable.ts`, `*Centers.ts`, `*Guide.ts`). Do NOT spawn new static TypeScript data files when adding or updating articles.
- **Lightweight Card Projection for `/blog` Listing**: The `/blog` directory and search listing page must ONLY query and load lightweight card metadata (`BlogPostCardItem` containing `slug`, `titleBn`, `titleEn`, `excerptBn`, `category`, `coverImage`, `readTimeBn`, `publishedDate`, facility counts) via Prisma `select`. Never fetch or deserialize full post bodies, detailed pricing tables, comparison matrices, or extensive hospital reviews on the listing page to prevent excessive memory usage and database egress.
- **Single-Post Query for `/blog/[slug]`**: The individual blog page `/blog/[slug]` retrieves its full document by `slug` from the database. Static site generation (SSG) is preserved via `generateStaticParams()` querying only slugs from the database at build time.
- **Strict 500-Line Code Limit**: All blog-related components, actions, and utilities must strictly remain below 500 lines per file.

### SEO, AEO & GEO First-Priority Directive (Search, Ask & Generative Engine Optimization)

**Mandatory Directive**: In ALL development tasks (pages, layouts, UI components, schemas, metadata, routing) AND all article/content writing (medical guides, directories, doctor profiles, health tips, FAQs), **SEO** (Search Engine Optimization), **AEO** (Ask/Answer Engine Optimization), and **GEO** (Generative Engine Optimization) are the **FIRST PRIORITY**.

Modern users increasingly discover healthcare information through AI software and answer engines (e.g., **ChatGPT, Gemini, Grok, Perplexity, Copilot**), in addition to traditional search engines (Google, Bing) and voice assistants (Siri, Google Assistant). All code, page structures, and content MUST be engineered for maximum visibility, precise answer extraction, and generative AI citation.

#### 1. Generative Engine Optimization (GEO) Standards (for ChatGPT, Gemini, Grok, Perplexity)
- **Entity Clarity & Disambiguation**: Always explicitly name entities (e.g. "Health Club", "Feni Sadar", "BMDC-registered specialist doctor", exact hospital/diagnostic center names, test names, ultrasound/MRI machine models) rather than using vague pronouns ("তারা", "এখানে", "সেবা"). Generative AI models index, synthesize, and cite content based on explicit entity associations.
- **Direct Answer Capsules (BLUF — Bottom Line Up Front)**:
  - Immediately below every H2 or H3 question heading, provide a 40–60 word concise, factual, direct answer capsule before expanding into details. AI engines (ChatGPT Search, Perplexity, Google Gemini AI Overviews) extract this exact snippet for their citations and summary answer boxes.
- **High Information Density & Structured Tables**:
  - Always format fees, chamber schedules, diagnostic test preparations, doctor rosters, and comparisons in clean HTML tables (`<table>`) or structured lists (`<ul>`, `<ol>`). LLMs parse, summarize, and quote tabular data far more reliably and accurately than unstructured paragraphs.
- **Unique Local Information Gain**:
  - Provide concrete, verified local data (e.g., realistic Feni Sadar diagnostic fee ranges in BDT, exact chamber visiting hours, Friday schedules, serial hotline numbers) that generic AI base models do not have in their training weights.
- **Crawlability & Server-Side Rendering (RSC)**:
  - All public pages, articles, and directory hubs must be rendered via React Server Components (RSC) to serve 100% crawlable, pure HTML. AI search bots (`GPTBot`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`, `GrokBot`, `OAI-SearchBot`) must never receive blank client-rendered JavaScript shells.
  - Maintain and synchronize `public/llms.txt` and `public/llms-full.txt` knowledge bases with structured, up-to-date markdown representing all platform doctors, partner facilities, test pricing, and emergency helplines.
- **Verifiable Medical E-E-A-T & Citations**:
  - Every medical article must feature doctor fact-checking attribution (`reviewedBy: Physician`), author credentials, verified BMDC references, editorial policy links, and dynamic modification dates (`dateModified`) to earn authoritative AI citation.

#### 2. Answer Engine Optimization (AEO) Standards (for Voice & Zero-Click Answers)
- **Conversational Query Headings**: Frame H2 and H3 headings as natural questions people speak or ask in conversational Bengali & English (e.g. *"ফেনীতে এমআরআই টেস্টের খরচ কত?"*, *"শুক্রবার ফেনীতে কোন কোন বিশেষজ্ঞ ডাক্তার বসেন?"*, *"Health Club মেম্বারশিপ কীভাবে নিব?"*).
- **FAQ Schema (`FAQPage`)**: Every medical guide and directory page must include structured `FAQPage` JSON-LD with exact Q&A pairs matching on-page text.
- **Speakable Specification**: Configure Schema.org `speakable` selectors (`#article-quick-summary`, `#overview`, `#faq-section`) so voice assistants (Google Assistant, Siri) can instantly parse and read out key answers.
- **Concise Definitiveness**: Ensure the opening sentence of any answer can stand alone as a complete, self-contained response.

#### 3. Search Engine Optimization (SEO) Standards (for Google, Bing & Traditional Search)
- **Strict Semantic HTML**: Exactly one `h1` per page; logical `h2` and `h3` depth without skipping levels; semantic tags (`<article>`, `<section>`, `<header>`, `<table>`, `<time>`, `<address>`).
- **Comprehensive Metadata & Social Cards**: Every page must declare unique, keyword-optimized `title` (50–60 characters) and `description` (140–160 characters with clear value proposition), along with complete OpenGraph (`og:image` 1200x630) and Twitter Card tags.
- **Rich JSON-LD Schema Graphs**: Inject appropriate Schema.org types (`MedicalWebPage`, `Physician`, `Hospital`, `MedicalCondition`, `BreadcrumbList`, `FAQPage`, `SoftwareApplication`, `Organization`).
- **Canonical & Multilingual Indexing**: Always declare accurate canonical URLs. Use `<html lang="bn">` with `inLanguage: "bn-BD"`.
- **Core Web Vitals & Speed**: Zero Cumulative Layout Shift (CLS), high performance, and optimized WebP images with descriptive bilingual `alt` attributes.
- **Internal Linking & Topical Clusters**: Connect articles, doctor directory categories, and hospital profiles contextually using descriptive anchor text to distribute topical authority.

### No Hallucinations
- Do not guess or invent APIs, project structures, schemas, or routing configurations.
- If any requirement, schema, or route is ambiguous, **stop and ask the user for clarification**.

---

## 5. AI Coding Agent - Global Execution Rules

### Rule 1 — Never Stay in a Reasoning Loop
If you notice you are repeating the same reasoning, checking the same files, or suggesting the same solution more than twice, STOP. Instead:
• explain what is blocking you
• ask the user for the missing information
• or ask the user to run a command
Never continue looping.

### Rule 2 — Maximum Analysis Limit
Before modifying code: Analyze only what is necessary. Maximum: inspect relevant files, understand dependencies, create a plan. After that, START IMPLEMENTING. Do not repeatedly re-analyze the project.

### Rule 3 — Ask Instead of Hallucinating
Never guess. Never invent APIs, project structure, routes, database schema, environment variables, package versions, or business logic. If something is missing, STOP and ask the user.

### Rule 4 — User Is the Source of Truth
Whenever there is uncertainty, ask the user. Do not choose randomly.

### Rule 5 — One Blocking Question At A Time
Never ask 10 questions. Ask only the minimum question needed. After receiving the answer, continue automatically.

### Rule 6 — Request Commands When Needed
If verification requires terminal output, ask the user to run the exact command. Then paste the output. Do not hallucinate command results.

### Rule 7 — Verify Before Editing
Before making changes, identify: affected files, dependencies, possible side effects. Only then edit.

### Rule 8 — Small Iterations
Implement in small verified steps. After each major change, verify that the project is still consistent.

### Rule 9 — Never Rewrite Working Code Without Reason
If existing code already works, improve only what is required. Avoid unnecessary refactoring.

### Rule 10 — Preserve Existing Architecture
Respect: project conventions, folder structure, naming, design system, lint rules, TypeScript configuration. Do not introduce a new architecture unless requested.

### Rule 11 — Detect Infinite Loops
If you reopen the same file repeatedly, rewrite the same code repeatedly, repeat identical explanations, or repeatedly search for the same symbol, assume you are stuck. Stop and ask for help.

### Rule 12 — Execution First
Prefer: Implement → Verify → Continue instead of Analyze forever.

### Rule 13 — Think Before Every Tool Call
Before using any tool, ask: "Does this move me closer to completing the task?" If not, don't use it.

### Rule 14 — Progress Reporting
After every major milestone, briefly report:
✅ completed
⏳ remaining
🚧 blockers (if any)
Keep reports concise.

### Rule 15 — Never Hide Uncertainty
If confidence is below 90%, say so. Explain what is unknown. Ask the user.

### Rule 16 — Finish Whenever Possible
Do not stop just because one optional issue exists. Complete everything that can be completed. Only pause for blockers that require user input.

### Rule 17 — Respect User Intent
Do exactly what the user requested. Do not expand scope. Do not "improve" unrelated code. Stay focused.

### Rule 18 — Minimize Token Waste
Avoid repeating previous explanations. Avoid re-reading files unnecessarily. Avoid verbose reasoning. Be concise and action-oriented.

### Rule 19 — Learn From Current Context Only
Base decisions on: repository, user instructions, existing code. Never rely on assumptions from unrelated projects.

### Rule 20 — Definition of Done
A task is done only when:
✓ requested implementation exists
✓ code is internally consistent
✓ no obvious errors remain
✓ next steps (if any) are clearly stated
Do not declare success before verification.

### Rule 21 — Escalate Instead of Looping
If blocked for more than 3 attempts, STOP. Summarize what you tried, why it failed, and what exact information is needed. Wait for the user's response instead of retrying indefinitely.

### Rule 22 — Prefer Evidence Over Assumptions
Every important decision must be supported by existing code, configuration, documentation, or user instructions. If evidence does not exist, ask the user. Never fabricate missing details.

### Rule 23 — Every Action Must Have a Reason
Before editing any file, briefly identify why this file is being changed and how it relates to the requested task. Never modify unrelated files.
