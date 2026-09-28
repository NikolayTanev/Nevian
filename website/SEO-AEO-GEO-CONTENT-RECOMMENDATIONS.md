# Nevian SEO, AEO, and GEO Content Recommendations

**Audit date:** August 5, 2026  
**Audited source:** `C:\Users\nikol\source\repos\ITSM_Agent_Site\website` (read-only source copy)  
**Scope:** Content recommendations only. No website source content was changed.

## How to use this document

Each recommendation gives the exact source location, the current wording, and replacement-ready wording.

- **SEO** means discoverability for relevant non-branded searches.
- **AEO** means concise, self-contained answers that search and voice systems can extract.
- **GEO** means clear entities, factual specificity, evidence, and source-worthy explanations that generative systems can summarize and cite.
- Text marked **Verify before publishing** must not be presented as fact until product, security, legal, or customer evidence confirms it.
- Where no current equivalent exists, **Previous** says so explicitly.

## Highest-priority blockers before publishing the copy

1. All 13 Vite entry pages exist and have basic titles and meta descriptions. Replace their generic metadata with the page-specific recommendations below, then add canonical links, Open Graph/Twitter metadata, and verified structured data.
2. Choose one permanent URL format—prefer extensionless URLs such as `/security`—and redirect `.html` URLs server-side. `history.replaceState` changes the address bar but does not solve canonicalization or crawling.
3. Render or prerender meaningful page copy in the initial HTML response. Client-only React output is less dependable for crawlers, answer engines, and AI retrieval systems.
4. Add `robots.txt`, an XML sitemap, canonical links, Open Graph metadata, and indexable page-specific metadata.
5. Remove or isolate `/hyperhedge`: its finance/risk content and the `BitLease` entity are unrelated to Nevian and weaken topical/entity consistency.
6. Verify all security, compliance, integration-availability, and performance claims before publication. Unsupported precision harms trust and GEO citation potential.

---

## 1. Sitewide entity definition

### 1.1 Canonical description of Nevian

**Location:** Sitewide; first paragraph on the homepage, About content, metadata, footer, and structured data  
**Targets:** SEO + AEO + GEO

**Previous:** The site uses several overlapping descriptions, including “AI-powered IT support,” “AI ticket assistant,” “AI Ticketing,” “context-rich IT support,” and “safe automation,” but it does not provide one stable definition.

**Now:**

> Nevian is an AI-powered IT support and ITSM automation platform for lean IT teams. It combines identity verification, live endpoint context, policy-aware automation, ticket routing, and human handoff to resolve routine requests safely and record every action.

**Why:** This gives search engines and generative systems one quotable definition with a stable product category, audience, capabilities, and safety model.
### 1.2 Canonical product terminology

**Location:** Sitewide product copy and navigation  
**Targets:** GEO

**Previous:** “light Windows desk agent,” “Desk Agent,” “endpoint agent,” “AI Ticketing,” “AI ticket assistant,” “Server Agent,” and “Agent Gateway” appear without stable definitions.

**Now:**

> **Nevian platform:** The complete IT support and automation product.  
> **Nevian AI:** The conversational assistant that understands requests, applies approved workflows, and reports outcomes.  
> **Desk Agent:** The endpoint component for user devices. It supplies device context and executes approved device actions.  
> **Server Agent:** The component for approved server-side checks and actions.  
> **Agent Gateway:** The outbound connection used by Nevian agents to exchange context and approved jobs.  
> **Admin Dashboard:** The workspace where IT teams review tickets, devices, identity, automation, audit history, and insights.

**Why:** Stable names help AI systems distinguish the company, product, assistant, and technical components. Confirm each definition with the product team before publication.

---

## 2. Homepage (`/`)

### 2.1 Document title

**Location:** `index.html` → `<title>`  
**Targets:** SEO + GEO

**Previous:**

> Nevian: AI-powered IT support for lean teams

**Now:**

> AI IT Support & Help Desk Automation for Lean Teams | Nevian

**Why:** Leads with high-intent category terms while retaining the audience and brand.

### 2.2 Meta description

**Location:** `index.html` → `<meta name="description">`  
**Targets:** SEO + AEO

**Previous:**

> Nevian pairs a light Windows desk agent with an AI ticket assistant and secure automation so small and mid-sized IT teams resolve tickets in minutes.

**Now:**

> Nevian automates routine IT support with identity verification, live endpoint context, policy checks, secure actions, audit trails, and human handoff.

**Why:** Replaces vague speed language with concrete capabilities and avoids narrowing the platform to one Windows component.

### 2.3 Homepage H1

**Location:** `src/ScratchLanding.jsx` → `.scratch-hero h1`  
**Targets:** SEO + AEO

**Previous:**

> Cut routine IT workload by up to 60%

**Now:**

> AI IT support that resolves routine requests before they reach your queue

**Why:** The current H1 depends on an unsupported percentage. The replacement states the category and outcome in language that matches likely searches.

### 2.4 Homepage hero answer

**Location:** `src/ScratchLanding.jsx` → paragraph immediately below the H1  
**Targets:** SEO + AEO + GEO

**Previous:**

> Nevian combines identity, endpoint context, and policy-aware automation to resolve repetitive requests safely before they enter your team's queue.

**Now:**

> Nevian is an AI-powered IT support platform for lean teams. It verifies the requester, checks live device and directory context, follows your policies, completes approved actions, and hands exceptions to the right person with a full audit trail.

**Why:** This is a concise, extraction-ready answer to “What is Nevian?” and “How does Nevian automate IT support?”

### 2.5 Homepage platform heading

**Location:** `src/ScratchLanding.jsx` → `#features` H2  
**Targets:** SEO + AEO

**Previous:**

> Not just a chatbot, a full platform

**Now:**

> One platform for AI IT support, endpoint context, and secure automation

**Why:** Replaces a comparison slogan with descriptive language that explains the platform’s scope out of context.

### 2.6 Password-reset demo introduction

**Location:** `src/ScratchLanding.jsx` → immediately before `#how` / `PasswordResetDemo`  
**Targets:** SEO + AEO + GEO

**Previous:**

> No equivalent explanatory section currently exists. The demo is introduced only by “Nevian AI Password reset, start to finish” and the section label “Nevian password reset demo.”

**Now:**

> ## How Nevian automates a password reset
>
> Nevian confirms the requester’s identity, checks the account and device against policy, obtains approval when required, performs the approved reset, records each step, and closes the request. If any check fails or the request falls outside policy, Nevian hands it to a person instead of completing it automatically.

**Why:** Turns an animation into crawlable, answer-ready process content and states the safety boundary.
### 2.7 Workload-reduction claim

**Location:** `src/ScratchLanding.jsx` → hero H1 and animated `60%`; `src/components/InsightsPage.jsx` → sample dashboard  
**Targets:** GEO + trust

**Previous:**

> Cut routine IT workload by up to 60%

**Now — publish until evidence exists:**

> Reduce the routine IT work that fills your queue

**Now — publish only when substantiated:**

> Customers in **[named cohort or study]** reduced manually handled routine requests by **[verified percentage or range]** over **[time period]**. The result was calculated from **[sample size and methodology]** and may vary by workflow, policy, and environment.

**Why:** Precise claims are highly reusable by generative systems, but only when the methodology and source are visible. Do not keep `60%` as a decorative sample value if it can be mistaken for a measured result.

### 2.8 Audience-fit copy

**Location:** `src/components/FitSection.jsx` → `fit-intro` and cards  
**Targets:** SEO + AEO

**Previous:**

> Is Nevian right for your team?
>
> Nevian is built for IT teams that want to eliminate repetitive support work without sacrificing security or control.

**Now:**

> ## Who is Nevian for?
>
> Nevian is designed for lean internal IT teams and service desks with recurring requests such as password resets, account unlocks, access approvals, software installs, endpoint checks, and routine fixes. It is a strong fit when the team wants faster resolution while retaining policy controls, approvals, audit history, and human ownership of exceptions.

**Why:** Uses a direct question and gives a complete, qualified answer with explicit use cases.

### 2.9 Homepage FAQ answer block

**Location:** Add after `FitSection` and before the contact section in `src/ScratchLanding.jsx`  
**Targets:** AEO + GEO

**Previous:**

> No equivalent section currently exists.

**Now:**

> ## Frequently asked questions
>
> ### What is AI IT support automation?
> AI IT support automation uses request understanding, identity and device context, policies, and approved workflows to complete routine support work. Nevian can carry a request from intake through verification, action, audit, and closure, while handing exceptions to a person.
>
> ### What IT requests can Nevian automate?
> Nevian is designed for repeatable requests such as password and MFA resets, account unlocks, approved access changes, software installs, account provisioning, endpoint checks, routine remediations, and status updates. Available actions depend on the connected systems and policies your team approves.
>
> ### Does Nevian replace the IT team?
> No. Nevian handles approved, repeatable work and escalates requests that need judgment, unavailable access, additional approval, or investigation. The receiving engineer gets the identity, device context, conversation, attempted actions, diagnostics, and audit history.
>
> ### How does Nevian keep automated actions safe?
> Nevian verifies identity, checks device and directory context, evaluates policy, limits actions to approved workflows, pauses sensitive work for approval, and records the decision and result. Publish this answer only after each control is verified against the production architecture.
>
> ### Which systems does Nevian work with?
> The current site lists Microsoft 365, Microsoft Entra ID, Azure, PowerShell, Windows, Windows Server, Jira, and ServiceNow. Publish an integration status beside each system—such as generally available, private preview, planned, or available on request—so readers know what is usable today.
>
> ### How long does Nevian take to deploy?
> Deployment depends on the workflows, systems, policies, and approval requirements in scope. Nevian begins with discovery, selects a focused first rollout, connects the required systems, tests each workflow with the IT team, and expands after the initial workflows are validated.

**Why:** These questions match common discovery and evaluation queries. Add FAQ structured data only when the same questions and answers are visibly present and all claims are verified.

### 2.10 Footer definition

**Location:** `src/components/Footer.jsx` → `.footer-brand-column p`  
**Targets:** SEO + GEO

**Previous:**

> Context-rich IT support and safe automation for lean teams.

**Now:**

> AI-powered IT support and ITSM automation for lean teams, with identity verification, endpoint context, policy controls, and human handoff.

**Why:** Reinforces the canonical entity definition in a sitewide location.

### 2.11 Contact identity

**Location:** `src/components/ContactSection.jsx`, `ContactPage.jsx`, and `Footer.jsx` → email references  
**Targets:** GEO + trust

**Previous:**

> nevian.info@gmail.com

**Now:**

> hello@**[Nevian’s verified primary domain]**

**Why:** A branded email and one canonical domain strengthen organization/entity trust. Do not publish the placeholder; replace it with a working owned address.

---

## 3. Routine workload page (`/workload`)

### 3.1 Page metadata

**Location:** `workload.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Cut routine IT workload

**Previous — meta description:**

> Nevian resolves the repetitive requests that dominate an IT queue — password resets, access, installs — end to end, so routine tickets never reach a person.

**Now — title:**

> Automated IT Ticket Resolution for Routine Requests | Nevian

**Now — meta description:**

> Automate password resets, access requests, software installs, provisioning, endpoint fixes, and updates with policy checks, audit trails, and human handoff.
### 3.2 H1 and hero answer

**Location:** `src/components/WorkloadPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Cut routine IT workload before it reaches the queue

**Now — H1:**

> Automate routine IT tickets from request to resolution

**Previous:** No concise definition appears directly below the H1.

**Now — hero answer:**

> Nevian resolves approved, repeatable IT requests by understanding the request, verifying identity, checking policy and endpoint context, completing the action, updating the ticket, and recording the result. Requests outside policy or confidence thresholds are handed to a person with the context already attached.

### 3.3 “Without a person” qualification

**Location:** `src/components/WorkloadPage.jsx` → `featurePanels.vitals.body`  
**Targets:** AEO + GEO + trust

**Previous:**

> Nevian handles password resets, access requests, and repetitive fixes from start to finish, verifying identity, checking policy, and closing the ticket without a person in the loop.

**Now:**

> Nevian can complete approved password resets, access requests, and repeatable fixes from start to finish when identity, context, policy, and required approvals all pass. If a check fails or the request needs judgment, Nevian pauses and hands the request to the right person.

**Why:** Replaces an absolute autonomy claim with a precise decision boundary.

### 3.4 Speed visualization label

**Location:** `src/components/WorkloadPage.jsx` → `WorkloadSpeed`  
**Targets:** GEO + trust

**Previous:**

> 1.2s to first action

**Now — if illustrative:**

> Example workflow · first action shown after request intake

**Now — if measured:**

> Median time to first action: **[verified value]**, measured across **[sample]** from **[date range]**. Updated **[date]**.

**Why:** A precise number needs a measurement definition and source. Otherwise, label the visual as illustrative.

### 3.5 Answer block

**Location:** Add before the feature grid in `WorkloadPage.jsx`  
**Targets:** AEO

**Previous:**

> No equivalent question-and-answer block currently exists.

**Now:**

> ## Which IT tickets can be automated?
>
> The best candidates are high-volume requests with consistent inputs, clear policies, known actions, and predictable success checks. Examples include password and MFA resets, account unlocks, approved access changes, software installs, account provisioning, endpoint checks, routine remediations, and status updates. Requests that need investigation or judgment should remain human-led.

---

## 4. Device context page (`/device-context`)

### 4.1 Page metadata

**Location:** `device-context.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Device context

**Previous — meta description:**

> Every support request arrives with the device it came from — identity, OS, health, risk, and live signals — so nobody has to stop and ask.

**Now — title:**

> Endpoint Context, Fleet Health & Remote IT Actions | Nevian

**Now — meta description:**

> Attach live device context to every IT request, monitor endpoint health and risk, and run approved PowerShell or shell actions with complete audit history.

### 4.2 H1 and definition

**Location:** `src/components/DeviceContextPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Every request arrives with full device context

**Now — H1:**

> Live endpoint context for every IT support request

**Previous:** No answer-first paragraph appears directly below the H1.

**Now — hero answer:**

> Nevian links each request to the relevant endpoint and gives the support workflow current device identity, owner, operating system, health, risk, patch state, storage, software, compliance, and recent signals. IT teams can diagnose faster and run approved actions without asking the user to collect basic device details.

### 4.3 Remote script claim

**Location:** `src/components/DeviceContextPage.jsx` → `featurePanels.script.body`  
**Targets:** SEO + AEO + GEO

**Previous:**

> Send a PowerShell or shell script to one device or a whole group and Nevian runs it as SYSTEM through the endpoint agent. No SSH, no remote desktop, no walking over to the machine. Every run is scoped to the right devices, policy-checked, and written to the audit log.

**Now:**

> Send an approved PowerShell or shell script to one endpoint or a selected group. The Nevian endpoint agent executes the action with the permissions required by the approved workflow, checks target and policy constraints, and records the command, device, requester, authorization, and result. No inbound SSH or remote-desktop session is required.

**Why:** Keeps the useful technical specificity while avoiding the implication that every script always runs as SYSTEM. If SYSTEM execution is universally accurate, document the safeguards and retain it as a verified technical fact.

### 4.4 Answer block

**Location:** Add before the feature grid in `DeviceContextPage.jsx`  
**Targets:** AEO

**Previous:**

> No equivalent question-and-answer block currently exists.

**Now:**

> ## What endpoint context does Nevian collect?
>
> Nevian can provide endpoint inventory, operating system and build, owner and department, hardware, storage, installed applications, patch and compliance state, network context, recent logins and reboots, health signals, and risk indicators. Exact fields depend on the deployed agent, operating system, permissions, and connected management systems.

### 4.5 Sample fleet figures

**Location:** `DeviceContextPage.jsx` → fleet visual  
**Targets:** GEO + trust

**Previous:**

> 204 endpoints monitored
>
> Laptops, desktops, and servers, continuously monitored.

**Now:**

> Illustrative fleet view · sample data
>
> View supported laptops, desktops, and servers from the Nevian dashboard. Signal freshness and available telemetry depend on agent connectivity, operating system, configuration, and connected services.

**Why:** Prevents sample UI data and “continuous” monitoring from being interpreted as a customer result or universal guarantee.
---

## 5. Identity verification page (`/identity-verification`)

### 5.1 Page metadata

**Location:** `identity-verification.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Identity verification

**Previous — meta description:**

> Nevian verifies who's asking before it acts — step-up MFA, directory checks, approvals, and risk signals stop social engineering before a request is resolved.

**Now — title:**

> Identity Verification for Automated IT Support | Nevian

**Now — meta description:**

> Verify IT requesters with Entra ID, MFA, passkeys, device trust, risk signals, and approvals before sensitive support actions can run.

### 5.2 H1 and answer-first introduction

**Location:** `src/components/IdentityVerificationPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Verify who's asking, before you act

**Now — H1:**

> Verify every requester before an automated IT action

**Previous:** No concise explanatory paragraph appears directly below the H1.

**Now — hero answer:**

> Nevian checks the requester against the connected identity provider and can require MFA, a one-time code, passkey, trusted device, risk check, manager approval, or another step-up challenge before an action proceeds. The verification method and outcome are recorded with the request.

### 5.3 Social-engineering claim

**Location:** `IdentityVerificationPage.jsx` → `featurePanels.risk`  
**Targets:** GEO + trust

**Previous:**

> Social engineering stops at the door.
>
> Mismatched devices, impossible travel, and out-of-policy asks are flagged and held for a human instead of quietly resolved.

**Now:**

> Reduce social-engineering risk before an action runs.
>
> Nevian can flag mismatched devices, unusual sign-in signals, failed verification, and requests outside policy, then hold the action for human review. These controls reduce risk but do not eliminate social-engineering attacks.

**Why:** Security copy should describe controls and limits rather than promise complete prevention.

### 5.4 Answer block

**Location:** Add before the feature grid in `IdentityVerificationPage.jsx`  
**Targets:** AEO

**Previous:**

> No equivalent question-and-answer block currently exists.

**Now:**

> ## How does Nevian verify identity for IT support?
>
> Nevian matches the requester to the connected directory, evaluates available session, device, and risk context, and applies the verification rule configured for the requested action. Low-risk requests may use an existing verified session; sensitive actions can require step-up MFA, a passkey, a one-time code, device trust, or approval from a manager or resource owner.

---

## 6. Integrations page (`/integrations`)

### 6.1 Page metadata

**Location:** `integrations.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Integrations

**Previous — meta description:**

> Nevian connects to the tools your team already uses — Jira, ServiceNow, Microsoft 365, Entra ID, Azure, PowerShell, and Windows.

**Now — title:**

> IT Support Integrations: Microsoft 365, Entra, Jira & More | Nevian

**Now — meta description:**

> Connect Nevian with Microsoft 365, Entra ID, Azure, PowerShell, Windows, Windows Server, Jira, and ServiceNow for contextual IT automation.

### 6.2 H1 and supporting answer

**Location:** `src/components/IntegrationsPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Works with the tools your team already uses

**Now — H1:**

> Connect Nevian to your IT service, identity, and endpoint tools

**Previous:** No supporting paragraph or H2 appears on the page.

**Now — supporting answer:**

> Nevian uses connected systems to understand requests, verify identity, read relevant context, perform approved actions, update tickets, and record outcomes. The current integration catalog includes Microsoft 365, Microsoft Entra ID, Azure, PowerShell, Windows, Windows Server, Jira, and ServiceNow.

### 6.3 Integration availability disclosure

**Location:** Add above the integration card grid in `IntegrationsPage.jsx`  
**Targets:** AEO + GEO + trust

**Previous:**

> No integration status or availability information currently exists.

**Now:**

> **Integration availability:** Each integration below should display one verified status: **Generally available**, **Private preview**, **Planned**, or **Available as a custom integration**. Capabilities vary by connected product, license, API permissions, tenant configuration, and Nevian plan. Contact Nevian for the current supported actions and prerequisites.

**Why:** Generative systems need factual boundaries, not a logo wall that implies every connector and action is production-ready.

### 6.4 Individual integration card format

**Location:** `src/components/IntegrationsPage.jsx` → each item in `integrations`  
**Targets:** SEO + AEO + GEO

**Previous — Microsoft 365 example:**

> Reset passwords, manage mailboxes, and handle account tasks across Microsoft 365.

**Now — reusable format:**

> **Microsoft 365 integration**  
> **Status:** [verified availability]  
> **What Nevian can do:** [verified actions only].  
> **Context Nevian can read:** [verified fields only].  
> **Requirements:** [license, Graph permissions, tenant role, agent, or network requirements].  
> **Limitations:** [unsupported actions, regions, versions, or approval constraints].  
> **Last verified:** [date].

**Why:** This format creates source-worthy integration facts and supports long-tail searches. Apply it to every listed integration rather than publishing unqualified capability sentences.

### 6.5 Integration FAQ

**Location:** Add after the integration grid  
**Targets:** AEO

**Previous:**

> No equivalent section currently exists.

**Now:**

> ## Integration questions
>
> ### Does Nevian replace Jira or ServiceNow?
> No. Nevian works with the service-management system your team uses. It can use ticket context, perform approved workflow steps, and update the existing issue or request so the system of record remains current.
>
> ### Can Nevian work with tools that are not listed?
> Nevian can evaluate additional integrations when a system provides a suitable API, authentication model, and auditable action path. Availability depends on the product, required actions, security review, and implementation scope.
>
> ### What permissions do Nevian integrations need?
> Permissions depend on the connected system and workflow. Nevian should request only the scopes required for approved read or action capabilities. Publish a per-integration permissions table so administrators can review every requested scope before connecting.
---

## 7. Smart routing page (`/smart-routing`)

### 7.1 Page metadata

**Location:** `smart-routing.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Smart routing

**Previous — meta description:**

> Nevian reads every request, works out the intent, and routes it to the right specialist agent or resolves it automatically.

**Now — title:**

> AI Ticket Triage & Smart IT Request Routing | Nevian

**Now — meta description:**

> Classify IT requests by intent, context, urgency, and policy, then route them to automation, the right specialist, or a human handoff.

### 7.2 H1 and answer-first paragraph

**Location:** `src/components/SmartRoutingPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Every request, routed to the right place

**Now — H1:**

> AI ticket triage that routes every IT request by context and urgency

**Previous:** No supporting paragraph appears directly below the H1.

**Now — hero answer:**

> Nevian identifies a request’s intent, category, affected service, device and identity context, urgency, and applicable policy. It then sends the request to an approved automated workflow, the Desk Agent, the Server Agent, or the appropriate human owner, and records why the route was selected.

### 7.3 Confidence figure

**Location:** `SmartRoutingPage.jsx` → sample routing visual  
**Targets:** GEO + trust

**Previous:**

> 98% confidence

**Now — if illustrative:**

> Example classification · illustrative confidence

**Now — if measured:**

> Classification confidence: **[verified value]** for **[defined task and dataset]**, evaluated on **[sample size/date]** using **[methodology]**.

**Why:** “Confidence” is not equivalent to accuracy and should not be presented without a defined model, task, threshold, and evaluation set.

### 7.4 Answer block

**Location:** Add before `From request to resolution`  
**Targets:** AEO

**Previous:**

> No equivalent section currently exists.

**Now:**

> ## How does AI ticket routing work?
>
> AI ticket routing analyzes the request and combines it with directory, endpoint, service, priority, policy, and workload context. Nevian uses that context to choose an approved destination. If the request is ambiguous, risky, outside policy, or below the configured confidence threshold, it should be routed for human review rather than auto-resolved.

---

## 8. Audit trail page (`/audit-trail`)

### 8.1 Page metadata

**Location:** `audit-trail.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Audit trail

**Previous — meta description:**

> Every action Nevian takes is written to an append-only audit log, with who, what, which device, the method, and the result on every line.

**Now — title:**

> IT Automation Audit Trail & Action History | Nevian

**Now — meta description:**

> Record identity checks, approvals, policies, device actions, outcomes, and exports for automated and human IT support workflows in Nevian.

### 8.2 H1 and answer-first paragraph

**Location:** `src/components/AuditTrailPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> A record of every action

**Now — H1:**

> A complete audit trail for every IT support action

**Previous:** No definition appears directly below the H1.

**Now — hero answer:**

> Nevian records who requested an action, how identity was verified, which policy and approval applied, what device or account was affected, what action ran, and whether it succeeded. Audit records can be reviewed with the ticket and exported through supported destinations.

### 8.3 Immutability and export claims

**Location:** `AuditTrailPage.jsx` → `points`  
**Targets:** GEO + trust

**Previous:**

> Immutable by default. Entries are append-only. Nothing can be quietly edited or deleted.
>
> Exportable anytime. Stream to your SIEM or export to CSV whenever you need it.

**Now — publish only after architecture verification:**

> **Append-only audit history:** Nevian writes new audit events without modifying earlier event content. **[Document retention, deletion authority, correction handling, integrity verification, storage boundary, and administrator permissions.]**
>
> **Supported exports:** Export audit events to **[verified CSV/API/SIEM destinations]**. **[Document delivery method, field mapping, latency, plan availability, and retention limits.]**

**Why:** “Immutable” has a strong technical meaning. Explain the mechanism and administrative limits so the statement can be trusted and cited.

### 8.4 Answer block

**Location:** Add before the audit log visual  
**Targets:** AEO

**Previous:**

> No equivalent section currently exists.

**Now:**

> ## What does an IT automation audit log record?
>
> A useful automation audit log records the requester, verified identity, timestamp, target account or device, requested action, policy decision, approver, execution method, result, error details, and integrity information. Nevian keeps this context with the support request so teams can reconstruct both automated and human decisions.

---

## 9. Insights page (`/insights`)

### 9.1 Page metadata

**Location:** `insights.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Insights

**Previous — meta description:**

> See where the work goes: ticket volume, automation rate, response time, and backlog, broken down by team, request type, and device.

**Now — title:**

> IT Support Analytics & Automation Insights | Nevian

**Now — meta description:**

> Track ticket volume, auto-resolution, response and resolution time, backlog, CSAT, request types, teams, devices, and support trends in Nevian.

### 9.2 H1 and explanation

**Location:** `src/components/InsightsPage.jsx` → feature hero  
**Targets:** SEO + AEO

**Previous:**

> See where the work goes

**Now — H1:**

> Measure IT support workload, automation, and resolution outcomes

**Previous:** No answer-first paragraph appears below the H1.

**Now — hero answer:**

> Nevian shows how support demand changes over time, which requests are resolved automatically, where backlogs form, how quickly requests receive action, and which teams, request types, or devices create the most work. Use the same definitions and time range across every metric so comparisons remain meaningful.
### 9.3 Dashboard numbers

**Location:** `InsightsPage.jsx` → sample dashboard and chart  
**Targets:** GEO + trust

**Previous:**

> Resolved · 30d 842; Auto-resolved 60%; Avg. first response 1.2s; CSAT 4.8/5; Automated 525; Resolved 385.

**Now — if these are product-demo values:**

> Illustrative dashboard · sample data, not customer results

**Now — if these are verified aggregate results:**

> **[Metric]: [verified result]** across **[defined cohort]** from **[start date]** to **[end date]**. Definition: **[formula]**. Sample: **[number of organizations/tickets]**. Last updated: **[date]**.

**Why:** Labeling and methodology turn decorative numbers into trustworthy evidence; without them, the figures should remain clearly illustrative.

### 9.4 Metric definitions

**Location:** Add after `Everything you can measure`  
**Targets:** AEO + GEO

**Previous:**

> The page lists Ticket volume, Auto-resolve rate, First response, Time to resolve, Open backlog, CSAT, By team, By request type, By device, and Trends over time, but does not define them.

**Now:**

> ## How Nevian defines support metrics
>
> **Ticket volume:** Requests created during the selected period.  
> **Auto-resolution rate:** The percentage of eligible requests completed without manual execution. State whether approval-only interactions count as human handling.  
> **Time to first action:** Time from request creation to the first recorded automated or human action.  
> **Time to resolution:** Time from request creation to the final resolved state, excluding **[state any paused periods]**.  
> **Open backlog:** Unresolved requests at the end of the selected period.  
> **CSAT:** The average score from submitted satisfaction responses, shown with response count and scale.  
> **Breakdowns:** The same metrics grouped by team, request type, or device without changing the underlying definition.

**Why:** Explicit metric definitions are essential for source-quality analytics content. Finalize the bracketed definition with the product team.

---

## 10. Security page (`/security`)

### 10.1 Page metadata

**Location:** `security.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO + GEO

**Previous — title:**

> Security

**Previous — meta description:**

> Nevian acts inside your environment with least-privilege, signed agents, end-to-end encryption, and an immutable audit trail. Security built into every layer.

**Now — title:**

> Nevian Security: Identity, Agent, Encryption & Audit Controls

**Now — meta description:**

> Review how Nevian scopes IT actions, verifies requesters and agents, encrypts data, requires approvals, limits network access, and records audit events.

### 10.2 Hero copy

**Location:** `src/components/SecurityPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> Security built into every layer
>
> Nevian acts inside your environment, so every action is scoped, verified, and recorded. Automation without handing over the keys.

**Now — H1:**

> Security controls for AI-powered IT support and automation

**Now — hero answer:**

> Nevian applies identity verification, least-privilege access, signed agent communication, encrypted transport and storage, policy checks, approvals, tenant isolation, and audit logging to IT support workflows. This page should document each control’s scope, prerequisites, limitations, and verification status.

### 10.3 Signed-agent claim

**Location:** `SecurityPage.jsx` → `layers` → `Signed, verified agents`  
**Targets:** GEO + trust

**Previous:**

> The Desk and Server Agents only execute code-signed, approved scripts. Anything unsigned is rejected before it can run, verified with Ed25519 and SHA-256.

**Now — verify before publishing:**

> Nevian agents verify **[identify exactly what is signed: command envelope, script, binary, or release]** before execution using **[verified algorithm and key-management design]**. A job that fails signature, authorization, target, expiry, replay, or policy checks is rejected and recorded. Agent releases are verified through **[document release-signing and update mechanism]**.

**Why:** The current sentence conflates code signing, approval, Ed25519 signatures, and SHA-256 hashing. Precise architecture is more credible and more citable.

### 10.4 Encryption claim

**Location:** `SecurityPage.jsx` → `layers` → `Encrypted end to end`  
**Targets:** AEO + GEO + trust

**Previous:**

> Context in transit and state at rest are encrypted at all times. No plain traffic ever leaves your environment: TLS 1.3 on the wire, AES-256 at rest.

**Now — verify before publishing:**

> Data sent between **[document endpoints]** is encrypted in transit with **[verified protocol and minimum version]**. Stored **[identify data classes and stores]** is encrypted at rest with **[verified service or cipher]**. Document where TLS terminates, which metadata may be processed, how keys are managed, and any exceptions or customer responsibilities.

**Why:** “End to end” and “no plain traffic ever leaves” are absolute statements that require a clear trust boundary.

### 10.5 Approval claim

**Location:** `SecurityPage.jsx` → `layers` → `Approvals & step-up auth`  
**Targets:** GEO + trust

**Previous:**

> Nothing privileged runs without MFA and an approval.

**Now:**

> Sensitive actions can be configured to require step-up identity verification and approval before execution. Publish a policy matrix showing which actions require MFA, approval, both, or neither by default, and which settings administrators can change.

**Why:** The replacement remains strong while avoiding an unverified universal claim.

### 10.6 Configuration claim

**Location:** `SecurityPage.jsx` → `Secure by default, end to end` paragraph  
**Targets:** GEO + trust

**Previous:**

> From the browser to the endpoint, connections are verified and encrypted before any work happens. There is nothing to configure and no certificate to renew.

**Now:**

> Nevian manages **[verified certificate or key operations]** for the connection between the dashboard, service, and agents. Customers configure **[required network, identity, permissions, policy, and deployment steps]**; routine certificate renewal for **[defined component]** is handled automatically.

**Why:** “Nothing to configure” conflicts with tenant consent, agent deployment, integrations, permissions, and policy setup.
### 10.7 Compliance statement

**Location:** `SecurityPage.jsx` → `Enterprise compliance` and FAQ  
**Targets:** SEO + AEO + GEO + legal trust

**Previous:**

> Aligned with ... SOC 2, ISO 27001, and GDPR ...
>
> Nevian is aligned with SOC 2 Type II, ISO 27001, GDPR, and CCPA. We can share our reports ... under NDA.

**Now — use only the version matching verified status:**

> **If certified/attested:** Nevian **[has completed / is certified to] [exact standard and scope]**. The **[report/certificate]** covers **[legal entity, product, systems, locations, and period]**. Eligible customers can request **[document]** under NDA. Last verified: **[date]**.
>
> **If preparing but not certified/attested:** Nevian’s security program is designed with controls informed by **[frameworks]**. Nevian has not yet claimed certification or attestation for **[framework]**. Contact us for the current readiness status and available security documentation.
>
> **Privacy:** Nevian supports customer obligations under **[verified laws]** through **[DPA, subprocessors, retention controls, deletion process, residency options]**. Compliance depends on the customer’s configuration and use.

**Why:** “Aligned with” is ambiguous, and SOC 2 Type II is an attestation report rather than a certification. Legal/security review is mandatory.

### 10.8 Security FAQ replacement

**Location:** `SecurityPage.jsx` → `faqs`  
**Targets:** AEO + GEO

**Previous:** The page has five useful questions, but several answers contain absolute or unverified claims about standing access, inbound access, storage, immutability, and compliance.

**Now:**

> ## Frequently asked security questions
>
> ### Does Nevian keep standing administrator access?
> Nevian is designed to use scoped authorization for approved actions rather than unrestricted standing access. Document the exact credential type, scope, lifetime, storage location, revocation path, and exceptions for every integration and agent action before publishing this answer as a production guarantee.
>
> ### How does Nevian prevent an automated action from exceeding policy?
> Before an action runs, Nevian should validate the requester, target, requested capability, policy, authorization, expiry, and required approval. Signed or otherwise authenticated jobs that fail a check are rejected and recorded. Publish the actual enforcement points and failure behavior from the production architecture.
>
> ### Does Nevian require inbound network access?
> **[Verified answer]** Nevian agents initiate outbound connections to **[document destinations and ports]**. State whether any feature requires inbound access, a relay, webhook, VPN, allow-list entry, proxy change, or firewall rule. Include a network diagram and last-reviewed date.
>
> ### Where is customer data stored?
> Customer data is stored in **[verified regions and services]** for **[retention period]**. It is encrypted **[verified details]**, access is limited through **[verified access controls]**, and deletion follows **[verified process and timeline]**. List subprocessors, backup handling, support access, and available residency options.
>
> ### Which security and compliance reports are available?
> Nevian currently provides **[verified reports, certifications, penetration-test summary, DPA, subprocessors, security questionnaire, or none]**. State the covered entity, scope, report period, availability conditions, and last-reviewed date. Do not use framework logos or “Type II” language until verified.

**Why:** These answers are intentionally publication templates. Replace every bracketed field with verified facts before using visible FAQ content or `FAQPage` schema.

### 10.9 New trust-center content

**Location:** New `/trust` or `/security/trust-center` page linked from Security and Footer  
**Targets:** SEO + GEO

**Previous:**

> No equivalent page currently exists.

**Now:**

> # Nevian Trust Center
>
> Find Nevian’s current security architecture, data handling, privacy documents, subprocessors, vulnerability reporting process, availability history, and verified compliance materials in one place.
>
> ## Security documentation
> - Architecture and data-flow overview — **[link and last reviewed date]**
> - Encryption and key management — **[link and last reviewed date]**
> - Identity, authorization, and agent security — **[link and last reviewed date]**
> - Data retention and deletion — **[link and last reviewed date]**
> - Business continuity and incident response — **[link and last reviewed date]**
>
> ## Privacy and compliance
> - Data Processing Addendum — **[link]**
> - Subprocessor list — **[link and change-notification process]**
> - Privacy policy — **[link]**
> - Verified reports and certifications — **[exact status and scope]**
>
> ## Report a security issue
> Send security reports to **security@[verified-domain]**. Include the affected component, steps to reproduce, impact, and a secure way to contact you. Nevian will acknowledge valid reports within **[verified response target]**.

**Why:** A maintained trust center is stronger GEO evidence than unsupported badges or broad security slogans.
---

## 11. Human handoff page (`/human-handoff`)

### 11.1 Page metadata

**Location:** `human-handoff.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Human handoff

**Previous — meta description:**

> When a request needs a person, Nevian hands off to the right engineer with identity, full history, and every attempted action already in context.

**Now — title:**

> Human Handoff for AI IT Support & Automation | Nevian

**Now — meta description:**

> Escalate IT requests with verified identity, device context, conversation history, diagnostics, attempted actions, approvals, priority, and audit records attached.

### 11.2 H1 and hero paragraph

**Location:** `src/components/HumanHandoffPage.jsx` → feature hero  
**Targets:** SEO + AEO + GEO

**Previous:**

> When it needs a person, the person has everything
>
> Nevian works a ticket as far as it safely can. When a human is the right call, it hands off to the right engineer with the full picture already in place.

**Now — H1:**

> AI-to-human handoff with the full IT request context attached

**Now — hero answer:**

> Nevian escalates a request when it needs judgment, additional access, an approval, or investigation. The receiving engineer gets the verified identity, device details, conversation, actions already attempted, diagnostics, linked ticket, priority, suggested next step, approver, and audit history, so the handoff continues the work instead of restarting it.

### 11.3 Routing claim

**Location:** `HumanHandoffPage.jsx` → `points` → `Routed to the right person`  
**Targets:** GEO + trust

**Previous:**

> It picks the owner by skill, workload, and the systems involved, not a round-robin queue.

**Now:**

> Nevian can route a handoff using configured ownership rules such as team, skill, service, system, priority, availability, or workload. Document which signals are supported today, how ties are resolved, and whether administrators can override the result.

### 11.4 Answer block

**Location:** Add before `A handoff, not a restart`  
**Targets:** AEO

**Previous:**

> No equivalent section currently exists.

**Now:**

> ## When should AI IT support hand a request to a person?
>
> A request should be handed to a person when identity cannot be verified, required context is missing, policy blocks the action, approval is denied or unavailable, the request is ambiguous, the workflow reports an unexpected result, the required access is unavailable, or the task needs human judgment. The handoff should preserve every verified fact and attempted step.

---

## 12. Process page (`/process`)

### 12.1 Page metadata

**Location:** `process.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Nevian Process

**Previous — meta description:**

> See how Nevian moves from discovery and planning through launch and ongoing support.

**Now — title:**

> Nevian Implementation Process: From Discovery to Launch

**Now — meta description:**

> See how Nevian selects an initial IT automation workflow, connects required systems, configures policies, tests outcomes, launches, and improves over time.

### 12.2 Add a real H1

**Location:** `src/components/ProcessPage.jsx` / `ProcessJourney.jsx` → page introduction  
**Targets:** SEO + AEO

**Previous:**

> No H1 exists. The highest visible heading is “How we get Nevian running.”

**Now — H1:**

> How Nevian is implemented in your IT environment

**Now — introductory answer:**

> Nevian implementation starts with a focused, repeatable support workflow. The team documents the current process and success criteria, connects only the required systems and permissions, configures policies and approvals, tests normal and failure paths, launches to a controlled audience, and reviews results before expanding.

### 12.3 Process step copy

**Location:** `src/components/ProcessJourney.jsx` → `steps`  
**Targets:** AEO + GEO

**Previous:**

> Discovery; Planning; Setup; Launch; Support.

**Now:**

> **1. Discover the workflow** — Identify the highest-volume repeatable requests, current systems, owners, policies, risks, exceptions, and baseline metrics.  
> **2. Define scope and success** — Select the first workflow, specify what Nevian may read or change, define approvals and handoff rules, and agree on measurable success criteria.  
> **3. Connect and configure** — Deploy the required agent or integration, grant reviewed permissions, configure policy and routing, and map audit fields.  
> **4. Test before launch** — Validate normal requests, denied requests, unavailable systems, failed actions, revoked access, human handoff, and audit output with the IT team.  
> **5. Launch and improve** — Release to the agreed audience, monitor outcomes, review exceptions, adjust policy, and expand only after the initial workflow meets its criteria.

**Why:** The expanded steps answer practical implementation questions and provide source-worthy operational detail.

---

## 13. Contact page (`/contact`)

### 13.1 Page metadata

**Location:** `contact.html` → `<title>` and `<meta name="description">`  
**Targets:** SEO

**Previous — title:**

> Contact Nevian

**Previous — meta description:**

> Talk to Nevian about AI-powered IT support, endpoint context, and safe automation for your team.

**Now — title:**

> Book a Nevian AI IT Support Demo

**Now — meta description:**

> Tell Nevian about your support workload, devices, systems, and automation goals. Get a focused walkthrough of suitable workflows, controls, and human handoff.

### 13.2 Hero copy

**Location:** `src/components/ContactPage.jsx` → page hero  
**Targets:** SEO + AEO + conversion

**Previous:**

> Let's talk about your support workload.
>
> Tell us what takes up your team's time today. We'll explain how Nevian could handle the routine work and where your team would stay involved.

**Now — H1:**

> Book a Nevian AI IT support demo

**Now — body:**

> Tell us which requests consume the most time, which systems and endpoints you manage, and where policy or approval matters. We’ll show the workflows Nevian could automate, what context and permissions they require, when a person stays involved, and how each action is recorded.

### 13.3 Demo expectations

**Location:** `ContactPage.jsx` → `details`  
**Targets:** AEO + GEO + conversion

**Previous:**

> A focused 30 minute walkthrough  
> An honest look at whether Nevian fits your environment  
> A reply within one business day

**Now:**

> **A focused walkthrough:** Review one or two high-volume workflows using your current environment as context.  
> **A fit and gap review:** Identify required integrations, permissions, policies, approvals, unsupported needs, and human handoff points.  
> **Clear next steps:** Receive the proposed first rollout, validation requirements, and current product availability.  
> **Response time:** We aim to reply within one business day. **[Publish only if this service target is monitored and consistently met.]**

**Why:** Adds useful evaluation detail and properly qualifies the response-time claim.
---

## 14. HyperHedge route (`/hyperhedge`)

### 14.1 Remove or isolate unrelated content

**Location:** `vite.config.js`, `src/hyperhedge-main.jsx`, and `src/components/HyperHedgePage.jsx`  
**Targets:** SEO + GEO

**Previous:**

> The HyperHedge Flow  
> Raw market data travels through eight gold paths into the HyperHedge Filter and exits as clean, calibrated risk data.  
> BitLease

**Now:**

> No Nevian replacement copy is recommended. Remove this route from the Nevian public site and sitemap, return an appropriate redirect or `410 Gone` if it was accidentally published, or move it to a separate verified brand/domain with its own metadata and entity graph.

**Why:** Finance/risk terminology and the BitLease entity create severe topical and organizational ambiguity on an IT support product site.

---

## 15. New high-value content to add

### 15.1 Automated password reset use-case page

**Location:** New `/use-cases/automated-password-reset` page, linked from the homepage demo and workload page  
**Targets:** SEO + AEO + GEO

**Previous:**

> No equivalent crawlable use-case page currently exists; the workflow is primarily shown as an animation.

**Now:**

> # Automated password resets with identity verification and audit history
>
> Nevian automates approved password-reset requests by identifying the user, checking directory and device context, applying the configured verification and approval policy, performing the supported reset, recording the outcome, and handing exceptions to a person.
>
> ## How an automated password reset works
> 1. **Understand the request.** Nevian identifies the affected account and reset intent from the support conversation or connected ticket.  
> 2. **Match the requester.** Nevian links the requester to the connected identity record and relevant device context.  
> 3. **Verify identity.** The workflow requires the configured method, such as an existing verified session, MFA, passkey, one-time code, trusted device, or approval.  
> 4. **Check policy.** Nevian confirms that the account, request, risk signals, and required approvals meet the organization’s reset policy.  
> 5. **Perform the supported action.** Nevian uses the connected identity system to complete the approved reset or recovery step.  
> 6. **Record and close.** The request stores the verification, policy decision, action, result, and any handoff.
>
> ## When Nevian does not reset the password
> Nevian should stop and hand the request to a person when identity cannot be verified, the account is outside scope, risk or policy blocks the action, approval is missing, the identity service is unavailable, or the action returns an unexpected result.
>
> ## Requirements
> - **Identity system:** [verified supported providers and versions]  
> - **Permissions:** [verified minimum scopes]  
> - **Verification methods:** [verified methods]  
> - **Licensing:** [verified customer/product requirements]  
> - **Audit and retention:** [verified behavior]
>
> ## Frequently asked questions
> **Can Nevian reset Microsoft 365 or Entra ID passwords?** [Verified answer with supported account types, methods, exclusions, and required Graph permissions.]  
> **Can Nevian automate MFA recovery?** [Verified answer with supported recovery operations and safeguards.]  
> **What happens if verification fails?** The workflow stops, records the failed or incomplete check according to policy, and hands the request to the configured support owner without performing the reset.

**Why:** This page targets a high-intent problem, makes the animated workflow extractable, and provides facts an AI system can summarize.

### 15.2 Evidence and methodology page

**Location:** New `/evidence` or `/research/automation-results` page; link from every quantified claim  
**Targets:** GEO + trust

**Previous:**

> No evidence page, case study, benchmark method, or named customer source currently supports claims such as 60%, 1.2 seconds, 98% confidence, or sample CSAT figures.

**Now:**

> # Nevian automation results and methodology
>
> This page explains how Nevian measures automated resolution, response time, workload reduction, routing performance, and customer outcomes. Figures are published only when the metric definition, sample, period, exclusions, and source can be reviewed.
>
> ## Metric record template
> **Claim:** [exact public claim]  
> **Result:** [verified value or range]  
> **Metric definition:** [formula and event boundaries]  
> **Population:** [customers, tickets, workflows, regions, plans]  
> **Sample size:** [number]  
> **Measurement period:** [dates]  
> **Exclusions:** [test data, abandoned tickets, outages, unsupported workflows]  
> **Comparison baseline:** [how baseline was calculated]  
> **Source:** [case study, anonymized aggregate, controlled evaluation, or product telemetry]  
> **Last reviewed:** [date]  
> **Limitations:** Results vary by workflow design, environment, policy, integration availability, and request mix.

**Why:** GEO systems favor claims with transparent provenance. This page should be maintained whenever a number changes.

### 15.3 Customer case-study template

**Location:** New `/customers/[customer-name]` pages after customer permission  
**Targets:** SEO + GEO

**Previous:**

> No customer stories, named testimonials, or implementation evidence currently exist.

**Now:**

> # How [Customer] automated [specific IT workflow] with Nevian
>
> **Customer:** [legal or approved public name]  
> **Industry and scale:** [verified description, employee/device/support volume]  
> **Environment:** [relevant systems and endpoint mix]  
> **Problem:** [baseline workflow, volume, delay, risk, or manual steps]  
> **Nevian deployment:** [integrations, first workflow, rollout period, controls, human handoff]  
> **Measured result:** [verified outcome with metric definition, dates, sample, and comparison]  
> **Customer quote:** “[approved verbatim quote]” — [name, role]  
> **Limitations:** [what remained manual, exceptions, or scope constraints]  
> **Last verified:** [date]

**Why:** Named, attributable, bounded evidence is among the strongest inputs for GEO authority.
### 15.4 About Nevian page

**Location:** New `/about` page; update Footer → “About Nevian” to point here  
**Targets:** SEO + GEO

**Previous:**

> “About Nevian” currently links to the homepage. No dedicated organization page exists.

**Now:**

> # About Nevian
>
> Nevian builds AI-powered IT support and ITSM automation software for lean IT teams. The platform combines requester identity, endpoint and directory context, policy-aware actions, routing, audit history, analytics, and human handoff.
>
> ## Company facts
> **Legal name:** [verified legal entity]  
> **Founded:** [verified year]  
> **Headquarters:** [verified city and country, if publicly disclosed]  
> **Product:** Nevian  
> **Primary website:** [canonical HTTPS URL]  
> **Support contact:** [branded email]  
> **Security contact:** [branded security email]  
> **Leadership:** [names, roles, profile links, and approved bios]  
> **Company registrations:** [only identifiers appropriate for public disclosure]
>
> ## What Nevian does
> Nevian helps IT teams automate repeatable support requests while retaining identity checks, policies, approvals, audit records, and human ownership of exceptions. Available capabilities depend on the deployed components, integrations, permissions, and product plan.

**Why:** A factual About page gives search and generative systems a stable organization entity. Do not publish placeholders or unverifiable founder/location claims.

### 15.5 Architecture and deployment page

**Location:** New `/docs/architecture` or `/platform/architecture` page  
**Targets:** SEO + AEO + GEO

**Previous:**

> Architecture details are fragmented across feature and security slogans. No single technical source defines components, data flow, trust boundaries, or deployment requirements.

**Now:**

> # Nevian architecture and deployment
>
> Nevian consists of **[verified hosted services]**, the **Desk Agent**, the **Server Agent**, the **Agent Gateway**, connected identity and IT systems, and the **Admin Dashboard**. This page documents where each component runs, what data it reads or changes, how it authenticates, and how approved work reaches a device or service.
>
> ## Components
> For each component, publish: purpose; hosting boundary; supported operating systems; required permissions; inbound and outbound connections; update mechanism; authentication; logging; failure behavior; and data retained.
>
> ## Request-to-action data flow
> 1. A request enters through **[verified channels]**.  
> 2. Nevian identifies intent and gathers permitted identity, endpoint, ticket, and policy context.  
> 3. The workflow evaluates authorization, approval, target, and safety conditions.  
> 4. An approved integration or agent performs the scoped action.  
> 5. Nevian verifies the result, updates the request, and records the audit event.  
> 6. Any blocked, ambiguous, or failed step follows the configured human-handoff path.
>
> ## Deployment requirements
> Publish supported operating systems and versions, network destinations and ports, proxy support, required tenant roles, integration scopes, agent update policy, browser support, data regions, and rollback/uninstall instructions. Include “Last reviewed: [date].”

**Why:** Detailed architecture content supports technical evaluation, security review, and expert-source citations.

### 15.6 Individual integration pages

**Location:** New pages such as `/integrations/microsoft-365`, `/integrations/entra-id`, `/integrations/servicenow`, and `/integrations/jira`  
**Targets:** SEO + AEO + GEO

**Previous:**

> Each integration currently has only a short card on one page.

**Now:**

> # Nevian integration with [Product]
>
> Nevian connects with **[Product]** to **[verified primary purpose]**. This page lists the actions, read context, permissions, prerequisites, limitations, availability, and security behavior supported today.
>
> ## Supported capabilities
> | Capability | Read or write | Required permission | Approval available | Status |
> |---|---|---|---|---|
> | [verified capability] | [read/write] | [exact scope/role] | [yes/no/configurable] | [GA/preview/custom/planned] |
>
> ## Requirements
> - Supported editions and versions: [verified]  
> - Customer licenses: [verified]  
> - Tenant or administrator role: [verified]  
> - Network or agent requirement: [verified]  
> - Nevian plan: [verified]
>
> ## Data and security
> State which fields Nevian reads, which objects it can change, token storage and rotation, audit events, data residency, retention, revocation, and uninstall/disconnect behavior.
>
> ## Limitations
> List unsupported account types, actions, versions, clouds, regions, and rate limits. Last verified: [date].

**Why:** Dedicated pages can rank for integration-specific searches and provide facts AI systems can quote without inferring capabilities from logos.

---

## 16. Proposed structured-data content

Structured data must match visible, verified page content. Do not add properties solely for search engines.

### 16.1 Organization entity

**Location:** Sitewide JSON-LD, ideally generated from one verified source  
**Targets:** SEO + GEO

**Previous:**

> No Organization JSON-LD currently exists.

**Now — content fields:**

```text
@type: Organization
name: Nevian
legalName: [verified legal entity]
url: [canonical HTTPS origin]
logo: [absolute canonical logo URL]
description: Nevian builds AI-powered IT support and ITSM automation software for lean IT teams.
email: [verified branded contact email]
sameAs: [verified official company profiles only]
contactPoint: [verified sales/support/security contact points]
```

### 16.2 Software product entity

**Location:** Homepage JSON-LD and visible product definition  
**Targets:** SEO + GEO

**Previous:**

> No SoftwareApplication or Product JSON-LD currently exists.

**Now — content fields:**

```text
@type: SoftwareApplication
name: Nevian
applicationCategory: BusinessApplication
applicationSubCategory: IT support and ITSM automation
operatingSystem: [verified supported operating systems]
description: Nevian combines identity verification, endpoint context, policy-aware automation, ticket routing, audit history, analytics, and human handoff for IT support teams.
url: [canonical product URL]
offers: [include only when real, public pricing and currency are available]
```

### 16.3 FAQ content

**Location:** Homepage and Security page only after visible, verified answers are published  
**Targets:** AEO

**Previous:**

> The Security page has visible FAQs but no inspectable FAQ structured data; the homepage has no FAQ section.

**Now:**

> Use the exact visible question as `Question.name` and the exact visible answer as `acceptedAnswer.text`. Do not mark hidden, sales-only, placeholder, or unverified answers as FAQ structured data. Do not repeat the same FAQ block across many pages.

### 16.4 Breadcrumb content

**Location:** Every feature, use-case, integration, trust, and case-study page  
**Targets:** SEO + GEO

**Previous:**

> No breadcrumb content or BreadcrumbList structured data currently exists.

**Now — visible examples:**

> Home → Platform → Device context  
> Home → Integrations → Microsoft 365  
> Home → Use cases → Automated password reset  
> Home → Security → Trust Center

**Why:** Breadcrumbs clarify the site’s topic hierarchy and entity relationships.
---

## 17. Sitewide content hygiene changes

### 17.1 Replace generic footer links with descriptive destinations

**Location:** `src/components/Footer.jsx` → `footerGroups`  
**Targets:** SEO + information architecture

**Previous:**

> AI Ticketing → `/#features`  
> Endpoint Agent → `/#features`  
> Admin Dashboard → `/#features`  
> Security & Automation → `/#features`  
> Workflow → `/#how`  
> Integrations → `/#how`  
> About Nevian → `/`

**Now:**

> AI IT support automation → `/workload`  
> Endpoint context and fleet → `/device-context`  
> IT support analytics → `/insights`  
> Security controls → `/security`  
> Implementation process → `/process`  
> Integrations → `/integrations`  
> About Nevian → `/about`

**Why:** Descriptive internal anchors and dedicated destinations improve crawl paths and topical relationships.

### 17.2 Newsletter value proposition

**Location:** `src/components/Footer.jsx` → `footer-newsletter-title`  
**Targets:** SEO + conversion

**Previous:**

> Useful notes on IT support and new work from Nevian.

**Now:**

> Practical guidance on AI IT support, service-desk automation, endpoint operations, identity verification, and new Nevian capabilities.

**Why:** Names the subject areas subscribers and search systems can expect.

### 17.3 Sample-data disclosure

**Location:** Every product mockup containing figures, names, domains, confidence values, response times, endpoints, tickets, or CSAT  
**Targets:** GEO + trust

**Previous:**

> Sample values are presented without a consistent disclosure.

**Now:**

> **Illustrative product view · sample data**

**Why:** Use one consistent disclosure unless the figures are verified customer or aggregate results with a linked methodology.

### 17.4 Last-reviewed and ownership labels

**Location:** Security, integrations, architecture, support matrix, trust center, metric definitions, and evidence pages  
**Targets:** GEO + trust

**Previous:**

> No consistent review date or content owner is shown.

**Now:**

> **Last reviewed:** [Month Day, Year]  
> **Owner:** [Nevian Security / Product / Engineering / Legal]  
> **Applies to:** [product version, plan, region, or deployment model]

**Why:** Time-sensitive technical facts become more dependable when scope and freshness are explicit.

---

## 18. Claims that require verification before publication

| Current claim | Source location | Required evidence or safer action |
|---|---|---|
| “Cut routine IT workload by up to 60%” | Homepage H1 | Publish cohort, sample, period, baseline, calculation, and limitations; otherwise remove the number. |
| “1.2s to first action” | Workload and Insights visuals | Define the event boundary, sample, percentile/average, environment, and period; otherwise label as sample data. |
| “98% confidence” | Smart Routing visual | Define the model task, confidence meaning, threshold, evaluation set, accuracy/calibration, and date; otherwise label illustrative. |
| “204 endpoints monitored” and “continuously monitored” | Device Context visual | Label as sample data and document actual signal intervals, offline behavior, supported devices, and freshness. |
| “Anything unsigned is rejected” | Security page | Document signed object, verification path, algorithms, key custody, replay/expiry handling, and exceptions. |
| “No plain traffic ever leaves your environment” | Security page | Produce a data-flow and trust-boundary review covering TLS termination, metadata, logs, proxies, and subprocessors. |
| “Nothing privileged runs without MFA and an approval” | Security page | Publish an action-policy matrix and verify defaults/configurability. |
| “There is nothing to configure” | Security page | Replace with actual deployment, network, tenant, permission, and policy requirements. |
| “Immutable” / “Nothing can be ... deleted” | Audit Trail page | Document storage design, retention, deletion rights, corrections, backups, integrity checks, and administrator access. |
| “Stream to your SIEM” | Audit Trail and Security pages | List supported SIEMs/protocols, latency, fields, plan, and availability. |
| “SOC 2 Type II, ISO 27001, GDPR, and CCPA” | Security FAQ | Legal/security confirmation of exact report, certification, scope, entity, period, and privacy position. |
| Integration action claims | Integrations page | Show availability, supported versions, exact actions, required permissions, prerequisites, and limitations per integration. |
| “Usually replies within one business day” | Contact sections | Confirm monitoring and historical attainment or phrase as a non-guaranteed target. |

---

## 19. Recommended publishing order

1. **Fix indexability and canonical URLs:** keep the 13 entry documents, replace generic metadata, choose canonical extensionless routes, add redirects, prerender meaningful content, and publish sitemap/robots.
2. **Publish the canonical entity definition:** homepage hero, footer, About page, and verified Organization/SoftwareApplication data.
3. **Replace or substantiate high-risk claims:** 60%, 1.2s, 98%, monitoring, immutability, encryption, agent signing, approvals, compliance, and integration availability.
4. **Publish answer-first page introductions:** use the H1 and hero paragraphs proposed for Workload, Device Context, Identity, Integrations, Routing, Audit, Insights, Security, Handoff, Process, and Contact.
5. **Add the homepage FAQ and verified Security FAQ:** keep answers visible and add FAQ structured data only after factual review.
6. **Create evidence-led depth:** automated password reset, individual integration pages, architecture, trust center, and methodology.
7. **Add third-party proof:** customer-approved case studies, named expert authors, review dates, and source links.
8. **Expand by demonstrated demand:** account unlock, MFA recovery, access requests, onboarding/offboarding, software deployment, Windows remediation, and PowerShell automation.

## 20. Final editorial rules for SEO, AEO, and GEO

- Put the direct answer in the first one or two sentences after each question or H1.
- Use one stable definition for Nevian and each named product component.
- Prefer concrete nouns and documented behavior over slogans such as “secure,” “smart,” “full,” or “enterprise.”
- State prerequisites, supported systems, limitations, failure paths, and human escalation behavior.
- Label sample UI data as illustrative; link measured claims to methodology.
- Attribute expert and company facts to named, reviewable sources.
- Include a visible author or owner and last-reviewed date on technical content.
- Do not claim a partnership, certification, integration status, performance result, or security guarantee without evidence.
- Keep FAQs page-specific and genuinely useful; do not mass-produce near-duplicate questions.
- Review every public claim with Product, Engineering, Security, and Legal before adding structured data.

---

**Deliverable note:** This document proposes content only. No JSX, JavaScript, HTML, CSS, metadata, schema, route, or website content file was edited during this audit.
