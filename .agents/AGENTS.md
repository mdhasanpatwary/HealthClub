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
- **Bangla**: Use `Hind Siliguri` font.
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

## 4. AI Coding Agent - Global Execution Rules

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
