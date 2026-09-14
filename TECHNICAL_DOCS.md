# FreelanceFlow - Technical Architecture & System Specification

## 1. Executive Summary
**FreelanceFlow** is a modern, mobile-first SaaS platform engineered for international agencies managing global subcontractors and remote talent. The platform abstracts the complexities of cross-border compliance, multi-currency invoicing, time-tracking, and escrow milestone disbursements into a unified, high-performance interface.

---

## 2. Core Architecture & Tech Stack
* **Frontend Framework:** React (with TypeScript / Functional Components & Hooks).
* **Styling & Design System:** Inline CSS-in-JS architecture combined with utility-first responsive layouts, adhering to a "True Black" Dark SaaS aesthetic (`#09090b` palette with `#34d399` Emerald accents).
* **State Management:** React Native & Web state hooks (`useState`, `useEffect`) simulating real-time transactional synchronization.
* **Localization & Target Audience:** 100% US English interface tailored exclusively for international agency-contractor operations.

---

## 3. System Modules & Functional Specifications

### 3.1. Onboarding & Compliance Engine
* **Real-Time Tax ID / VIES Validation:** Dynamic regex and format verification for US Employer Identification Numbers (EIN), European VAT structures, and international tax identifiers. Provides instant UI feedback (`VIES Validated`).
* **Digital Document Repository:** Secure tracking of compliance artifacts (e.g., W-8BEN tax forms, Professional Liability Insurance policies) with automated expiration status indicators (`Valid`, `Pending`, `Expiring`).

### 3.2. Time & Task Tracking Suite
* **Live Time Tracker (Start/Stop):** A high-precision stopwatch utility allowing contractors to log billable hours in real-time, syncing directly with agency task workflows.
* **Kanban Task Board:** Interactive lifecycle management across four operational states: `To Do`, `In Progress`, `In Review`, and `Completed`.
* **Contractor Utilization Metrics:** Weekly capacity tracking dashboards comparing logged hours against maximum weekly thresholds.

### 3.3. Invoice & Payment Management (Escrow & Payouts)
* **Multi-Currency Payout Engine:** Native support for cross-border transactions across USD (`$`), EUR (`€`), and GBP (`£`).
* **Secure Escrow Milestone Funding:** Dedicated liquidity widget allowing agency administrators to lock funds for active milestones safely.
* **Quick-Trigger Payouts:** One-click disbursement execution changing invoice states from `Submitted` to `Paid` instantly.
* **Simulated PDF Invoice Generation:** Instantaneous document compilation engine for tax auditing and receipt archiving.

### 3.4. Security, Governance & Audit Trail
* **Immutable Activity Audit Log:** Chronological event tracking recording all critical actions (tax profile updates, document uploads, invoice approvals, and escrow deposits) complete with actor metadata and timestamps.
* **Two-Factor Authentication (2FA) Status:** Enforceable security compliance toggle for contractor payout eligibility.
* **Global Entity HQ Switcher:** Multi-jurisdictional management supporting entities across US Delaware HQ, UK Branch, and EU operational branches.

---

## 4. User Role Matrix

| Capability / Module | Agency View (Admin) | Contractor Portal |
| :--- | :---: | :---: |
| **Dashboard & Cash Flow Analytics** | Full Read/Write | N/A |
| **Task Kanban & Hour Approval** | Full Control | Live Timer / Submission |
| **Invoice Workflow & Fast Payouts** | Approve & Trigger Pay | Submit & Track Status |
| **Tax & Compliance Profile** | Directory View | Edit EIN, Currency, 2FA |
| **Security Audit Trail** | Full System Log | Personal Activity History |

---

## 5. Future Roadmap & Scaling
1. **Real API Integration:** Connect VIES European VAT validation webhooks and Stripe Connect for automated multi-currency escrow payouts.
2. **Backend Persistence:** Integrate Supabase or PostgreSQL for robust multi-tenant data storage.
3. **Automated Webhooks:** Slack/Discord webhook alerts for real-time compliance expiration warnings.