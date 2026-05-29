# TrackHire Frontend Design Specification

## Goal

Build a polished, judge-ready frontend for **TrackHire**, a job application tracker for the #BuildQuik Challenge.

The product must feel like a real SaaS tool, not a hackathon landing page. The app already has working backend/auth/database logic. The frontend should make those features feel complete, useful, and intentional.

Primary judge signal: **usefulness**. Prioritize edit flows, card details, follow-up indicators, empty states, and mobile usability over decorative effects.

---

## Product Summary

TrackHire helps job seekers track every job application from first application to final outcome.

Users can:

- Sign up and sign in.
- Add job applications.
- View applications in a Kanban pipeline.
- Drag applications across stages.
- Open a card to view full details.
- Edit application details.
- Delete applications.
- See dashboard metrics.
- Know which jobs need follow-up.

Pipeline stages:

1. Applied
2. Screening
3. Interview
4. Offer
5. Rejected

---

## Design Direction

Use the QuikDB hackathon inspiration, but make it more mature and product-focused.

### Inspiration to keep

From the QuikDB poster:

- Dark technical background.
- Premium neon accent energy.
- Subtle circuit/grid texture.
- Clear hierarchy.
- Prize/challenge style confidence.

From the Acctual landing page screenshot:

- Clean SaaS spacing.
- Calm cards.
- Minimal UI chrome.
- Simple navigation.
- Functional content over visual noise.

### Final visual style

**Dark, sharp, credible, and useful.**

The interface should feel like a serious productivity tool for job seekers, with subtle hackathon energy from QuikDB-inspired accents.

Avoid:

- Generic purple gradient SaaS look.
- Random glassmorphism everywhere.
- Oversized emoji empty states.
- Inconsistent spacing.
- Decorative UI that does not support the task.
- Fake AI-looking blocks with no purpose.
- “Vibe coded” randomness.

---

## Design Principles

### 1. Function first

Every screen should help the user do one of these quickly:

- Add a job.
- See what stage each job is in.
- Update a job.
- Follow up on old applications.
- Understand progress.

### 2. Make the data feel valuable

A plain card list is not enough. Each card should communicate:

- Company
- Role
- Stage
- Application date
- Follow-up status
- Salary, if available
- Job URL access
- Notes preview, if available

### 3. Mobile is required

The current sidebar + Kanban layout does not work on small screens. Fix this.

Mobile users should be able to:

- Add a job.
- View applications by stage.
- Tap a card.
- Edit details.
- Move stage.
- Use the dashboard.

Do not treat mobile as an afterthought.

### 4. The app should feel complete even with no data

Empty states must be designed and useful. They should explain what to do next and offer a clear action.

---

## Tech Assumptions

Use the existing app stack unless the repository says otherwise.

Expected stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Clerk auth
- Neon Postgres or existing database layer
- Existing API/server actions
- Existing drag-and-drop implementation
- shadcn/ui components if already installed
- lucide-react icons if already installed

Do not rewrite the backend.

Do not change database schema unless absolutely necessary.

Do not break existing auth protection.

Do not introduce a large UI framework if Tailwind/shadcn already exists.

---

## Core Screens

## 1. App Shell

### Desktop layout

Use a persistent left sidebar and main content area.

Sidebar width: around `260px`.

Sidebar content:

- TrackHire logo
- Main navigation:
  - Dashboard
  - Applications
  - Follow-ups
  - Settings, if already available
- Bottom user/account area from Clerk if available

Main content:

- Top header per page
- Primary action button
- Content area

Desktop should feel spacious but not empty.

### Mobile layout

Replace persistent sidebar with:

- Top mobile header
- Menu button
- Sheet/drawer navigation
- Bottom-safe spacing
- Horizontally scrollable Kanban only if necessary, but prefer stage tabs for usability

Mobile applications screen should use either:

- Stage tabs: Applied / Screening / Interview / Offer / Rejected
- Or a compact stage selector dropdown

The user should not have to pinch zoom or fight a desktop Kanban board.

---

## 2. Dashboard

Purpose: show progress and encourage action.

### Header

Title: `Dashboard`

Subtitle example:

> Your job search pipeline at a glance.

Primary button:

- `Add application`

### Metric cards

Show four key metrics:

1. Total Applications
2. Active Applications
3. Response Rate
4. Offer Rate

Each card should include:

- Label
- Big number
- Small helper text
- Small icon

Use consistent card styling.

Example helper text:

- Total Applications: `All jobs you have tracked`
- Active Applications: `Not rejected or closed`
- Response Rate: `Applications that moved past Applied`
- Offer Rate: `Applications that reached Offer`

### Follow-up panel

Add a dashboard panel called:

`Needs follow-up`

Show applications that:

- Are older than 7 days
- Are not Offer
- Are not Rejected
- Have not had a status update recently, if that data exists

If status update timestamp does not exist, use application creation date.

Each item:

- Company
- Role
- Days since applied or updated
- Current stage
- Button/link: `Open`

Empty state:

> No follow-ups due. Your pipeline is up to date.

### Recent activity panel

If activity data exists, show recent updates.

If not, show recent applications.

---

## 3. Applications / Kanban Board

Purpose: primary working screen.

### Desktop Kanban

Use five columns:

- Applied
- Screening
- Interview
- Offer
- Rejected

Each column header should include:

- Stage name
- Count badge
- Short description or icon

Column styling:

- Dark card background
- Thin border
- Rounded corners
- Consistent vertical spacing
- Subtle colored stage accent

Column minimum width: around `280px`.

Allow horizontal scroll on smaller desktop widths.

### Application cards

Each card must look clickable and useful.

Card content:

- Company name
- Role title
- Stage badge or subtle accent
- Applied date
- Salary/range if available
- Job URL icon if available
- Notes indicator if notes exist
- Follow-up warning if due

Card actions:

- Click card opens detail panel.
- Drag card changes stage.
- Small overflow menu may include Edit/Delete if easy.

Do not hide all functionality behind drag-and-drop. Users on mobile or keyboard need another way to change stage.

### Follow-up indicator

Cards older than 7 days without progress should show a small warning.

Example text:

`Follow up · 9d`

Use a calm warning style, not an error state.

### Empty column state

Do not use plain emoji.

Each empty column should have a small designed placeholder:

- Icon
- Short title
- Helpful one-line text

Examples:

Applied:

> No applications yet. Add the first role you applied to.

Interview:

> No interviews yet. Move jobs here when companies start scheduling calls.

Offer:

> No offers yet. Keep tracking momentum.

---

## 4. Application Detail Panel

This is high priority.

When the user clicks an application card, open a right-side drawer on desktop and a full-screen sheet on mobile.

### Detail panel content

Header:

- Company
- Role
- Current stage badge
- Close button

Actions:

- Edit
- Delete
- Copy job URL, if URL exists
- Open job URL, if URL exists

Details section:

- Company
- Role
- Stage
- Application date
- Salary
- Job URL
- Notes
- Created date
- Last updated date, if available

Stage control:

- Dropdown or segmented control to move application between stages without dragging

Follow-up section:

If follow-up is due:

> Follow-up recommended. This application has not moved in 9 days.

If not due:

> No follow-up needed yet.

### Desktop behavior

- Drawer slides from the right.
- Width: around `420px` to `520px`.
- Background should be consistent with app shell.
- Main board remains visible behind it.

### Mobile behavior

- Full-screen sheet.
- Sticky bottom action area if needed.
- Fields and actions must be easy to tap.

---

## 5. Edit Application Flow

This is the most important missing feature.

Add edit functionality using existing backend/update logic if present. If no update action exists, create the smallest safe update handler that uses the existing application model.

The edit flow can be one of:

- Edit mode inside the detail drawer
- Separate edit dialog
- Shared add/edit form component

Preferred approach:

Use a shared `ApplicationForm` component for both Add and Edit.

### Required editable fields

- Company
- Role
- Stage
- Applied date
- Job URL
- Salary
- Notes

Use the actual existing model field names from the codebase.

### Form requirements

- Validation for required fields:
  - Company
  - Role
  - Stage
  - Applied date
- URL validation for job URL if present
- Save button loading state
- Cancel button
- Error state
- Success behavior:
  - Update UI immediately or refresh data
  - Close edit mode/dialog
  - Show toast if toast system exists

### Judge acceptance test

A judge should be able to:

1. Add a new job.
2. Click the card.
3. Edit the role or notes.
4. Save.
5. See the updated value immediately.
6. Move the job to another stage without dragging.
7. Delete it.

---

## 6. Add Application Dialog

Keep the existing add dialog but improve visual quality and consistency.

Required improvements:

- Clear title: `Add application`
- Short helper text
- Group fields logically
- Better spacing
- Loading state
- Validation messages
- Mobile-friendly full-width layout

Optional but useful:

- After adding an application, open the detail panel for the new card.
- Or keep the user on the board with the new card highlighted briefly.

---

## 7. Follow-ups Page or View

If there is time, add a lightweight Follow-ups page.

Purpose: show jobs that need action.

### Content

List applications due for follow-up.

Each row/card:

- Company
- Role
- Current stage
- Days since applied/updated
- Job URL button
- Open details button
- Mark as followed up if supported

If there is no follow-up timestamp in the database, do not add complex schema. Instead, compute due status from `createdAt`, `appliedAt`, or `updatedAt`.

Empty state:

> Nothing needs follow-up right now.

This page is nice-to-have. Dashboard follow-up panel is higher priority.

---

## Components to Build or Refactor

### `AppShell`

Responsible for:

- Sidebar on desktop
- Mobile header and nav drawer
- Main content wrapper

### `PageHeader`

Props:

- title
- description
- action

### `MetricCard`

Props:

- label
- value
- helper
- icon
- trend optional

### `ApplicationCard`

Props:

- application
- onOpen
- onEdit optional
- onDelete optional
- isDragging optional

Must show follow-up state.

### `KanbanColumn`

Props:

- stage
- applications
- count
- droppable props from existing DnD implementation

### `ApplicationDetailDrawer`

Props:

- application
- open
- onOpenChange
- onEdit
- onDelete
- onStageChange

### `ApplicationForm`

Shared for add and edit.

Props:

- mode: `create` or `edit`
- initialValues
- onSubmit
- onCancel

### `EmptyState`

Reusable designed empty state.

Props:

- icon
- title
- description
- action optional

---

## Visual System

## Color Palette

Use a dark base with restrained accents.

### Base

- App background: near-black navy
- Surface: dark slate
- Elevated surface: slightly lighter slate
- Border: slate with low opacity
- Text primary: near-white
- Text secondary: muted gray
- Text tertiary: darker muted gray

Suggested Tailwind feel:

- Background: `slate-950`
- Surface: `slate-900`
- Card: `slate-900/80`
- Border: `slate-800`
- Text: `slate-50`
- Muted text: `slate-400`

### Accent

Use QuikDB-inspired accents:

- Emerald / mint for positive action
- Violet for brand energy
- Amber for follow-up warning
- Red only for destructive actions

Use accents sparingly.

Primary CTA should be mint/emerald or bright neutral depending on current app style.

### Stage colors

Keep stage color subtle.

- Applied: blue
- Screening: violet
- Interview: amber
- Offer: emerald
- Rejected: rose/slate

Do not make the board look like a rainbow. Use small dots, top borders, or badges only.

---

## Typography

Use a clean sans-serif already available in the project.

Hierarchy:

- Page title: large, bold
- Section title: medium, semibold
- Card title: semibold
- Metadata: small, muted

Avoid huge marketing headlines inside the app. Save that for the landing page.

---

## Spacing and Layout

Use an 8px spacing system.

General:

- Page padding desktop: `24px` to `32px`
- Page padding mobile: `16px`
- Card padding: `16px`
- Section gaps: `24px`
- Column gap: `16px`

Border radius:

- Main cards: `16px`
- Buttons: `10px` to `12px`
- Small badges: pill radius

Shadows:

- Subtle only.
- Prefer borders and elevation over heavy glow.

---

## Motion

Use minimal, purposeful motion.

Allowed:

- Drawer slide in/out
- Button hover
- Card hover elevation
- Drag state
- Toast appearance
- Brief highlight after add/edit

Avoid:

- Constant animated gradients
- Floating particles over the product UI
- Slow transitions that make the app feel sluggish

All interactions should feel fast.

---

## Accessibility Requirements

Must have:

- Keyboard-accessible buttons and menus
- Visible focus states
- Labels for form fields
- Proper dialog/sheet focus handling
- Sufficient text contrast
- Non-drag way to change stage
- Touch-friendly controls on mobile

Do not rely on color alone for follow-up or status.

---

## Landing Page Improvements

The landing page is already done, but if touching it, make it align with the app.

Goal: Explain why TrackHire is useful.

Hero:

Title:

> Track every job application from applied to offer.

Subtitle:

> TrackHire gives job seekers a clean pipeline, follow-up reminders, and progress metrics so no opportunity gets lost.

CTA:

- `Start tracking`
- `View demo` if demo route exists

Feature cards:

1. Kanban pipeline
2. Follow-up reminders
3. Job search analytics
4. Notes and job links

Add a small #BuildQuik badge:

> Built for the #BuildQuik Challenge on QuikDB.

Avoid making the landing page the main deliverable. The actual app experience matters more.

---

## Data and Logic Rules

### Active applications

Active means applications not in:

- Rejected
- Offer, depending on existing app logic

Prefer:

- Active = Applied + Screening + Interview

### Response rate

Response rate means:

`applications in Screening, Interview, Offer, or Rejected / total applications`

If this differs from existing logic, keep existing logic but make label clear.

### Offer rate

Offer rate means:

`applications in Offer / total applications`

### Follow-up due

An application is due for follow-up if:

- Stage is Applied, Screening, or Interview
- Last meaningful update is more than 7 days ago

Use available fields in this priority:

1. `updatedAt`
2. `lastStatusChangeAt`
3. `appliedAt`
4. `createdAt`

Do not block implementation if only one date field exists.

---

## Implementation Priority

Build in this order.

### Phase 1: Make the existing app look intentional

- App shell polish
- Sidebar/mobile nav
- Page headers
- Card styling
- Kanban column styling
- Better empty states

### Phase 2: Add detail drawer

- Click card opens drawer/sheet
- Show full application details
- Add non-drag stage control
- Add copy/open job URL actions

### Phase 3: Add edit flow

- Shared add/edit form
- Update application mutation/server action
- Validation
- Loading/error states
- Update UI immediately

### Phase 4: Follow-up usefulness

- Due follow-up computation
- Card warning badge
- Dashboard follow-up panel
- Optional follow-ups page

### Phase 5: Mobile polish

- Stage tabs/dropdown
- Full-screen detail sheet
- Form spacing
- Tap targets
- Scroll behavior

---

## Must-Fix Items Before Submission

These are non-negotiable.

- User can edit an existing application.
- User can open a card and see full details.
- User can change stage without dragging.
- Empty states look designed.
- Mobile layout is usable.
- Dashboard metrics are visually clear.
- Follow-up indicator exists.
- No broken routes.
- No console errors.
- No placeholder lorem ipsum.
- No obvious copied template sections.
- Loading and error states exist where mutations happen.

---

## QA Checklist

Test these flows manually.

### Auth

- Signed-out users cannot access dashboard.
- Signed-in users can access dashboard.
- User data is scoped correctly.

### Add application

- Required field validation works.
- New application appears in correct stage.
- Empty state disappears after adding.

### Edit application

- Card opens detail drawer.
- Edit mode opens.
- User changes role, notes, stage, or salary.
- Save updates UI.
- Cancel does not change data.

### Delete application

- Delete requires confirmation.
- Deleted card disappears.
- Metrics update.

### Drag and drop

- Drag card between stages.
- Stage persists after refresh.
- Drag state looks clean.

### Non-drag stage change

- Change stage from detail drawer.
- Stage persists after refresh.

### Follow-up

- Old applications show follow-up warning.
- Rejected/Offer applications do not show follow-up warning.
- Dashboard follow-up panel matches card warnings.

### Mobile

Test at:

- 390px width
- 430px width
- 768px width

Mobile must support:

- Navigation
- Add application
- Open card
- Edit card
- Change stage
- Delete card
- Read dashboard metrics

---

## Claude Code Instructions

When implementing this design:

1. First inspect the repository structure.
2. Identify existing components, routes, server actions, and database model names.
3. Reuse existing logic whenever possible.
4. Do not rewrite working backend/auth/database code.
5. Build the UI in small commits or clear steps.
6. Keep TypeScript strict and avoid `any` unless unavoidable.
7. Use existing design primitives before adding dependencies.
8. If a dependency is missing, prefer plain React/Tailwind over installing a new package.
9. Do not remove existing working features.
10. After each major change, run lint/typecheck/build if available.

---

## Suggested Claude Code Prompt

Use this prompt after placing this file in the repo as `DESIGN.md`:

```text
Read DESIGN.md and inspect the current repository. The backend, auth, database, add/delete, dashboard, and drag-and-drop Kanban already work. Your job is to upgrade the frontend so it feels like a real production SaaS app for the #BuildQuik Challenge.

Prioritize:
1. edit application flow,
2. application detail drawer/sheet,
3. designed empty states,
4. follow-up indicators for stale applications,
5. responsive mobile layout.

Do not rewrite the backend. Reuse existing server actions, API routes, Clerk auth, database types, and drag-and-drop logic. If update functionality is missing, add the smallest safe update path using the existing application model.

Implement in phases. Before coding, summarize the files you will touch and the current data model. After each phase, run the available lint/typecheck/build commands and fix errors.
```

---

## Definition of Done

The frontend is done when a judge can use TrackHire on desktop or mobile and immediately understand:

- What the app does.
- How to add an application.
- How to edit an application.
- Which jobs need follow-up.
- How their job search is progressing.

It should look intentionally designed, feel fast, and clearly demonstrate a real useful product deployed for the #BuildQuik Challenge.
