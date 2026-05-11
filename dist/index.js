/**
 * Canonical permission registry for the Rello ecosystem.
 *
 * Single source of truth for the inter-app permission slugs that gate every
 * service-to-service auth boundary across Rello + 10 spokes + 6 engines.
 *
 * v0.1.0 sourcing: content (slug / label / description / validatedBy) is
 * lifted verbatim from `@rello-platform/api-client@1.10.1`'s embedded
 * `src/permissions.ts` (the bridge state shipped via Rello commit f0e741e5
 * a.k.a. "Doc B"). The api-client embedding retires in a future phase when
 * Rello receivers re-target imports from `@rello-platform/api-client` to
 * `@rello-platform/permissions` (one-line per receiver).
 *
 * Shape (Doc A): Doc A's `PermissionDefinition` interface adds `grantedTo`
 * to the api-client shape — every entry now carries the per-spoke
 * "which callers' keys hold this permission" metadata. v0.1.0 ships every
 * `grantedTo` as `[]` because the value is hand-authored from current
 * `ApiKey` table state and refined post-publish without a major version bump.
 *
 * `validatedBy` arrays are CI-derived (see `scripts/regenerate-validatedby.ts`).
 * v0.1.0 carries the api-client snapshot's hand-authored values intentionally
 * — they reflect accurate semantic state today (api-client receivers gate
 * accordingly), and the codegen against current consumers (most of which still
 * reference api-client's PERMISSIONS, not this package's PERMISSIONS) would
 * produce empty arrays. As consumers re-target to this package in subsequent
 * phases, the codegen takes over and overwrites these values from receiver
 * grep results.
 *
 * Provenance:
 *   - Spec:   ~/RELLO TO BE BUILT/PERMISSIONS-CANONICALIZATION.md (Doc A, 2026-04-25)
 *   - Bridge: rello-platform/api-client@v1.10.1 src/permissions.ts (Doc B)
 *   - Pattern reference: @rello-platform/slugs
 */
export const PERMISSIONS = {
    // ─── Leads ────────────────────────────────────────────────────────────────
    // Per platform "Lead not Contact" rule: code references use `lead`. The
    // legacy `contacts:*` triplet retired in v0.7.0 — DISCOVERED-RELLO-LEADS-
    // PERMISSION-SLUG-SPLIT-2026-04-30. Cross-platform grep confirmed no live
    // ApiKey row held a `contacts:*`-only permission set at retirement time.
    LEADS_READ: {
        slug: "leads:read",
        label: "Read leads",
        description: "Read lead records via `/api/leads/*` (sub-resources: emails, phones, custom-fields, etc.).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    LEADS_WRITE: {
        slug: "leads:write",
        label: "Write leads",
        description: "Create or update lead records via `/api/leads/*` (sub-resources: emails, phones, custom-fields, co-borrower, milo-insights, etc.).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    LEADS_DELETE: {
        slug: "leads:delete",
        label: "Delete leads",
        description: "Delete lead records via `/api/leads/*`.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Journeys ─────────────────────────────────────────────────────────────
    JOURNEYS_READ: {
        slug: "journeys:read",
        label: "Read journeys",
        description: "Read journey definitions and enrollments.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    JOURNEYS_WRITE: {
        slug: "journeys:write",
        label: "Write journeys",
        description: "Create or update journey definitions and enrollments.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    JOURNEYS_EXECUTE: {
        slug: "journeys:execute",
        label: "Execute journeys",
        description: "Trigger journey execution steps.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Webhooks ─────────────────────────────────────────────────────────────
    WEBHOOKS_READ: {
        slug: "webhooks:read",
        label: "Read webhooks",
        description: "Read webhook subscription configuration.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    WEBHOOKS_WRITE: {
        slug: "webhooks:write",
        label: "Write webhooks",
        description: "Create or update webhook subscriptions.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    WEBHOOKS_DELIVER: {
        slug: "webhooks:deliver",
        label: "Deliver outbound webhook",
        description: "Rello → spoke outbound webhook delivery. Attached to per-spoke (appSource=RELLO, targetApp=<SPOKE>) keys; checked by the spoke's receiver after the Bearer hash matches. Replaces the HMAC signature pattern per DISCOVERED-WEBHOOK-SIGNATURE-HEADER-MISMATCH-042226.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    // ─── Events ───────────────────────────────────────────────────────────────
    EVENTS_WRITE: {
        slug: "events:write",
        label: "Write events",
        description: "Write events into Rello's event stream — used by spoke webhooks (Rello receives newsletter open/click/bounce/unsubscribe, drumbeat post events, etc.) and by Rello-internal callers.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Engines (platform service auth) ──────────────────────────────────────
    ENGINE_ACCESS: {
        slug: "engine:access",
        label: "Engine access",
        description: "Allows a key to call platform-service engine endpoints (Milo, Property, Content, Report, Journey, Drumbeat Video). Required for any engine-cluster receiver per Auth-Fragmentation Phase 2.",
        validatedBy: [
            "milo-engine",
            "property-engine",
            "content-engine",
            "report-engine",
            "journey-engine",
            "drumbeat-video-engine",
        ],
        grantedTo: [],
    },
    // ─── Newsletter Studio (Rello → NS dispatch) ──────────────────────────────
    NEWSLETTERS_SEND: {
        slug: "newsletters:send",
        label: "Send newsletter (per-recipient nurture)",
        description: "Rello → NS dispatch via /api/newsletters/blueprint-send. Required for per-recipient nurture sends to flow through the centralized NS pipeline. Closed a SHAPE-01-class env-var Bearer compare per DISCOVERED-RELLO-NS-ENV-DRIFT-042426.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    NEWSLETTERS_SEND_LIFECYCLE: {
        slug: "newsletters:send-lifecycle",
        label: "Send lifecycle email (spoke-emitted)",
        description: "Spoke → NS dispatch via /api/newsletters/lifecycle-send. Distinct from newsletters:send (Milo-curated nurture via blueprint-send) — this covers spoke-emitted lifecycle emails (MI subscribe-welcome first; HS/HR/OHH welcomes; PA-004 hot-rate-alert) that share the SendAttempt idempotency invariant but are token-substituted templates triggered by spoke events rather than nurture decision flow. Closes the LIFECYCLE_SEND_API_KEY env-var Bearer bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    PREVIEW_READ: {
        slug: "preview:read",
        label: "Read newsletter preview",
        description: "Spoke → NS dispatch via /api/preview/blueprint and /api/preview/content-package. Render-only HTML preview surfaces — no Mailgun, no DB writes, no SendAttempt. Used by Harvest Home and other spokes to preview Milo-composed nurture emails before send. Closes the NS_APP_SECRET X-App-Secret env-var bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    LAB_SEND_TEST: {
        slug: "lab:send-test",
        label: "Send lab test newsletter",
        description: "Spoke → NS dispatch via /api/lab/send-test. One-off test sends from the design lab with up to 10 recipients per request — creates a real NewsletterSend row so footer links resolve. Closes the NS_APP_SECRET X-App-Secret env-var bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    TENANTS_VALIDATE: {
        slug: "tenants:validate",
        label: "Validate tenants",
        description: "Cross-app tenant validation lookups.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Newsletter Studio — Flow CRUD (LEAD-COHORT-CAMPAIGN-BUILDER Phase 3) ─
    FLOWS_CREATE: {
        slug: "flows:create",
        label: "Create flow",
        description: "NS receiver — POST /api/flows. Used by Rello → NS launchCampaign. Kept narrow so a compromised key cannot exfiltrate newsletters / messaging / contacts.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    FLOWS_MANAGE: {
        slug: "flows:manage",
        label: "Manage flow",
        description: "NS receiver — GET/PUT/DELETE /api/flows/[id]. Used by Rello → NS launchCampaign + addLeadsToCampaign.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    FLOWS_SUBSCRIBE: {
        slug: "flows:subscribe",
        label: "Subscribe leads to flow",
        description: "NS receiver — POST /api/flows/[id]/leads. Used by Rello → NS addLeadsToCampaign.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    FLOWS_READ_MILO_MANAGED: {
        slug: "flows:read-milo-managed",
        label: "Read Milo-managed flows",
        description: "NS receiver — GET /api/flows/milo-managed/leads. Used by Rello to read enrollment state on Milo-managed flows during nurture decisions.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    // Narrow per-lead enrollment-read added for SPEC-OVEN-NS-NURTURE-ORCHESTRATION-
    // RECEIVERS Phase A. Distinct from flows:read-milo-managed (Milo-scoped fan-out
    // read) — flows:read is the spoke-scoped per-lead read: "what flows is THIS lead
    // currently enrolled in?". Used by The Oven (and future spokes) to check
    // FlowSubscription state before enrolling / unenrolling / acting on a lead.
    FLOWS_READ: {
        slug: "flows:read",
        label: "Read lead flow subscriptions",
        description: "NS receiver — GET /api/leads/[id]/flows. Returns the active FlowSubscription rows + recent FlowTransition history for a given lead. Spoke-scoped per-lead enrollment read (distinct from flows:read-milo-managed Milo fan-out read). Used by The Oven monthly equity digest, post-close welcome, scheduled review requests etc. to check enrollment state before acting. Validated by NS's platform-key-validator.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    // ─── Newsletter Studio — engagement / preferences / suppression ───────────
    ENGAGEMENT_READ: {
        slug: "engagement:read",
        label: "Read engagement",
        description: "NS receiver — GET /api/leads/[id]/engagement. Used by Milo Engine and Rello to read NS-side engagement summaries (open/click history, last-engagement timestamps).",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    INJECTIONS_READ: {
        slug: "injections:read",
        label: "Read content injections",
        description: "NS receiver — GET /api/injections/active. Used by Milo Engine and Rello to read the active content-injection rules NS will apply at compose time.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    SUBJECT_PREFERENCES_READ: {
        slug: "subject-preferences:read",
        label: "Read subject preferences",
        description: "NS receiver — GET /api/internal/subject-preferences. Used by Milo Engine to read tenant-level subject-line generation preferences.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    SUPPRESSION_LIFT: {
        slug: "suppression:lift",
        label: "Lift suppression (NS receiver)",
        description: "NS receiver — POST /api/webhooks/rello/suppression-lift. Used by Rello to confirm a re-opt-in has happened so NS can clear the local Suppression row.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    // ─── Agent-domain warmup state (The Oven → NS read receiver) ──────────────
    // Per SPEC-OVEN-NS-NURTURE-ORCHESTRATION-RECEIVERS Phase C — the 7th
    // endpoint that completes the canonical Bearer cutover. The Oven's
    // `domain-check.resolveAgentDomain()` (signal-driven nurture pre-send hook)
    // calls GET /api/domains/agent/[agentId] to decide whether to use the
    // per-agent warmed Mailgun subdomain or fall back to the brokerage-level
    // domain. Receiver maps NS's AgentDomainStatus (PENDING|WARMING|ACTIVE|
    // FAILED) into Oven's DomainStatus contract (PROVISIONING|WARMING|READY|
    // SUSPENDED): PENDING→PROVISIONING, WARMING→WARMING, ACTIVE→READY,
    // FAILED→SUSPENDED — preserves Oven's `status === "READY"` gating
    // semantics. Validated by NS's requireServiceBearer.
    DOMAINS_READ: {
        slug: "domains:read",
        label: "Read agent-sending-domain warmup state",
        description: "NS receiver — GET /api/domains/agent/[agentId]. Returns the per-agent Mailgun-subdomain warmup state (PROVISIONING|WARMING|READY|SUSPENDED + warmupProgress + estimatedReadyDate) so callers can decide whether to route a send through the warmed agent subdomain or fall back to the brokerage-level domain. Closes the legacy X-API-Key bypass on The Oven's `domain-check.ts` per CENTRALIZED-API-KEY-MIGRATION Phase C — restores the agent-custom-warmed-domain feature (was silently always falling back to brokerage because the receiver was missing). Validated by NS's requireServiceBearer.",
        validatedBy: ["newsletter-studio"],
        grantedTo: ["the-oven"],
    },
    // ─── Per-agent warmed sending domain provisioning ─────────────────────────
    // NS owns per-agent Mailgun subdomain provisioning + the 60-day warmup state
    // machine. Rello (platform admin) initiates provisioning via the admin UI
    // surface at /admin/agents/warmed-domains. This permission gates the NS POST
    // receiver that creates the AgentDomain row + calls Mailgun to provision the
    // {slug}.mg.nsmail.app subdomain + sets status WARMING with warmupStarted,
    // kicking off the existing daily warmup-domains Trigger.dev task which
    // advances WARMING → ACTIVE over 60 days. Receiver also calls
    // provisionInboundRoute(domain) so replies on the agent subdomain route back
    // to NS's inbound webhook (without it, email_replied CRITICAL signals are
    // lost). Paired with domains:read (Phase C — Oven reads the warmup state to
    // decide warmed-subdomain vs brokerage-level fallback). Closes the
    // writer-path gap documented in DISCOVERED
    // ns-agent-domain-no-writer-path-2026-05-11 (Phase D).
    DOMAINS_WRITE: {
        slug: "domains:write",
        label: "Provision a per-agent warmed sending domain",
        description: "NS receiver — POST /api/domains/agent. Creates AgentDomain row in WARMING + calls Mailgun provisionSendingDomain(agentSlug) to create the {slug}.mg.nsmail.app subdomain + provisions the reply-tracking inbound route + sets warmupStarted=now. Kicks off the existing warmup-domains daily Trigger.dev task which advances WARMING → ACTIVE over 60 days. Idempotent: returns the existing row if one is already present for the agent. Initiated by Rello platform admin UI. Validated by NS's requireServiceBearer.",
        validatedBy: ["newsletter-studio"],
        grantedTo: ["rello"],
    },
    // ─── Agents ───────────────────────────────────────────────────────────────
    AGENTS_READ: {
        slug: "agents:read",
        label: "Read agents",
        description: "Read agent profile / roster records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    AGENTS_WRITE: {
        slug: "agents:write",
        label: "Write agents",
        description: "Create or update agent profile records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Articles ─────────────────────────────────────────────────────────────
    ARTICLES_SYNC: {
        slug: "articles:sync",
        label: "Sync articles",
        description: "Content Engine → Rello article sync ingest.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Messaging ────────────────────────────────────────────────────────────
    MESSAGING_READ: {
        slug: "messaging:read",
        label: "Read messaging",
        description: "Read SMS / message thread records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    MESSAGING_SEND: {
        slug: "messaging:send",
        label: "Send messaging",
        description: "Send SMS / message via Rello's messaging path.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    MESSAGING_ADMIN: {
        slug: "messaging:admin",
        label: "Administer messaging",
        description: "Administrative messaging operations (provider config, etc.).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Conversations ────────────────────────────────────────────────────────
    CONVERSATIONS_READ: {
        slug: "conversations:read",
        label: "Read conversations",
        description: "Read conversation thread records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CONVERSATIONS_WRITE: {
        slug: "conversations:write",
        label: "Write conversations",
        description: "Create or update conversation thread records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CONVERSATIONS_CALL: {
        slug: "conversations:call",
        label: "Initiate calls",
        description: "Initiate or update voice-call conversation records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Documents ────────────────────────────────────────────────────────────
    DOCUMENTS_READ: {
        slug: "documents:read",
        label: "Read documents",
        description: "Read document/asset records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    DOCUMENTS_WRITE: {
        slug: "documents:write",
        label: "Write documents",
        description: "Upload or update document/asset records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Signals ──────────────────────────────────────────────────────────────
    SIGNALS_WRITE: {
        slug: "signals:write",
        label: "Write signals",
        description: "Spoke → Rello signal ingest via /api/signals/batch and /api/signals/ingest. Held by every spoke's outbound key.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Intake (Rello → HH per-caller credential, NA-080) ────────────────────
    INTAKE_WRITE: {
        slug: "intake:write",
        label: "Write intake",
        description: "Rello → Harvest Home /api/intake[/re-enrich[-batch]] per-caller credential. Replaces the shared INTAKE_APP_SECRET env var per NA-080 (Plan-A2). HH's requireIntakeBearer enforces this permission via createPlatformKeyValidator.",
        validatedBy: ["harvest-home"],
        grantedTo: [],
    },
    // ─── Provisioning (Rello → spoke per-caller credential, NA-080 pattern) ───
    PROVISIONING_WRITE: {
        slug: "provisioning:write",
        label: "Write provisioning",
        description: "Rello → spoke per-spoke provisioning push (agent / tenant / template). Replaces the per-spoke RELLO_PROVISIONING_SECRET env-var compare. Held by per-spoke (appSource=RELLO, targetApp=<SPOKE>) keys; checked by each spoke's receiver after the Bearer hash matches.",
        validatedBy: ["newsletter-studio", "harvest-home", "home-ready", "home-stretch", "home-scout", "the-drumbeat", "open-house-hub", "the-oven", "market-intel", "pathfinder-pro"],
        grantedTo: [],
    },
    // ─── Admin internal (Rello → spoke admin/skip-trace/raw-import per-caller credential) ───
    ADMIN_INTERNAL: {
        slug: "admin:internal",
        label: "Internal admin operations",
        description: "Rello → spoke /api/admin/* + /api/skip-trace/* + /api/leads/[id]/raw-import per-caller credential. M2M cron + scoring + BYOL admin + skip-trace ledger callers. Replaces RELLO_PROVISIONING_SECRET env-var compare for HH's 15 admin-gate routes per DISCOVERED-HH-ADMIN-AUTH-MIGRATION-043026 + parent audit Phase 5.4-B unblock.",
        validatedBy: ["harvest-home"],
        grantedTo: [],
    },
    // ─── Parcel-graph (Property Engine receiver, INVESTOR-PORTFOLIO-DATA-MODEL) ──
    PARCEL_READ: {
        slug: "parcel:read",
        label: "Read parcel-graph",
        description: "Property Engine receiver — GET /api/parcel-graph/by-lead/[leadId] and /api/parcel-graph/by-parcel/[parcelId]. Returns the joined Parcel + Mortgage + LeadProperty graph for a tenant-scoped lead. Held by Rello + Milo Engine outbound keys per the INVESTOR-PORTFOLIO-DATA-MODEL spec (Phase 2, Lock #7).",
        validatedBy: ["property-engine"],
        grantedTo: [],
    },
    PARCEL_WRITE: {
        slug: "parcel:write",
        label: "Write parcel-graph",
        description: "Property Engine receiver — POST /api/parcel-graph/upsert-from-byol, POST /api/parcel-graph/upsert-from-intake, DELETE /api/parcel-graph/lead-property/[id]. Used by Harvest Home BYOL+intake writers and Rello lead-deletion cleanup per the INVESTOR-PORTFOLIO-DATA-MODEL spec (Phase 2, Lock #7).",
        validatedBy: ["property-engine"],
        grantedTo: [],
    },
    // ─── Tags ─────────────────────────────────────────────────────────────────
    TAGS_READ: {
        slug: "tags:read",
        label: "Read tags",
        description: "Read tag records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    TAGS_WRITE: {
        slug: "tags:write",
        label: "Write tags",
        description: "Create or update tag records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    TAGS_DELETE: {
        slug: "tags:delete",
        label: "Delete tags",
        description: "Delete tag records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Routing ──────────────────────────────────────────────────────────────
    ROUTING_EVALUATE: {
        slug: "routing:evaluate",
        label: "Evaluate routing rules",
        description: "Run lead-routing rule evaluation.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    ROUTING_READ: {
        slug: "routing:read",
        label: "Read routing rules",
        description: "Read lead-routing rule definitions.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Pools ────────────────────────────────────────────────────────────────
    POOLS_READ: {
        slug: "pools:read",
        label: "Read lead pools",
        description: "Read lead-pool records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    POOLS_WRITE: {
        slug: "pools:write",
        label: "Write lead pools",
        description: "Create or update lead-pool records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Segments ─────────────────────────────────────────────────────────────
    SEGMENTS_READ: {
        slug: "segments:read",
        label: "Read segments",
        description: "Read saved-segment records via /api/segments and /api/segments/[id]. Used by NS targeting paths to enumerate Rello segments.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SEGMENTS_WRITE: {
        slug: "segments:write",
        label: "Write segments",
        description: "Create, update, or delete saved-segment records.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Scoring (Auth-Fragmentation Phase 3) ─────────────────────────────────
    SCORING_READ: {
        slug: "scoring:read",
        label: "Read scoring config",
        description: "HomeReady scoring-engine receivers — GET /api/scoring/{config,dpa,guidelines,programs}. Phase 3 of Auth-Fragmentation.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SCORING_WRITE: {
        slug: "scoring:write",
        label: "Write scoring",
        description: "HomeReady scoring-engine receivers — POST /api/scoring/{calculate,live-updates}. Phase 3 of Auth-Fragmentation.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Reports / app scores (Auth-Fragmentation Phase 3) ────────────────────
    REPORTS_WRITE: {
        slug: "reports:write",
        label: "Write reports",
        description: "Spoke → Rello daily report ingest via /api/reports/ingest.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    APP_SCORES_WRITE: {
        slug: "app-scores:write",
        label: "Write app scores",
        description: "Spoke → Rello per-lead score ingest via /api/leads/[id]/app-scores.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    DAILY_REPORT_READ: {
        slug: "daily-report:read",
        label: "Read daily report (pull-summary receiver)",
        description: "Rello app-daily-report-orchestrator → spoke outbound — GET /api/summary/daily?tenantId=&date= returns the day's tenant-scoped activity summary. Pull direction (Rello calls spoke); distinct from reports:write which is the legacy push direction (spoke calls Rello). Held by Rello's outbound key per DISCOVERED-PLATFORM-DAILY-REPORT-ORCHESTRATOR-GAP-042926; first validator is home-scout per DISCOVERED-PLATFORM-MILO-SERVICE-KEY-DISTRIBUTION-GAP-042926.",
        validatedBy: ["home-scout"],
        grantedTo: [],
    },
    // ─── Scout receiver — CTA registry + survey gate (Milo Engine → Scout) ────
    CTA_REGISTRY_READ: {
        slug: "cta-registry:read",
        label: "Read CTA registry definitions",
        description: "Milo Engine → Scout outbound — GET /api/cta-registry/definitions returns effective CTAs for a (tenantId, agentId) pair via cascade resolution. Used by Milo's blueprint composer when picking outbound CTAs for newsletter sections.",
        validatedBy: ["home-scout"],
        grantedTo: [],
    },
    CTA_REGISTRY_WRITE: {
        slug: "cta-registry:write",
        label: "Write CTA registry impressions",
        description: "Milo Engine → Scout outbound — POST /api/cta-registry/impression increments impression counters on Scout's CtaDefinition records. Fire-and-forget after blueprint assembly; CTR data feeds Milo's selection scoring.",
        validatedBy: ["home-scout"],
        grantedTo: [],
    },
    SURVEY_GATE_WRITE: {
        slug: "survey-gate:write",
        label: "Write survey-gate pending question",
        description: "Milo Engine → Scout outbound — POST /api/survey-gate/pending-question creates a PENDING question request for a lead, injected into the lead's next tool survey flow by Scout's SurveyGate component.",
        validatedBy: ["home-scout"],
        grantedTo: [],
    },
    // ─── Scout receiver — homeowner Hub magic-link issuance (Rello → Scout, HHUB-HOTFIX-D) ───
    HOMEOWNER_MAGIC_LINK_ISSUE: {
        slug: "homeowner:magic-link:issue",
        label: "Issue homeowner Hub magic-link",
        description: "Rello → Scout outbound — POST /api/internal/homeowner/magic-link/issue mints a one-time magic-link token for a homeowner Lead and dispatches the email via Newsletter Studio. Service transport for the HHUB Send-Hub-Link path; siblings the public browser transport at /api/homeowner/auth/magic-link (which has no bearer auth and preserves never-leak-Lead-existence semantics).",
        validatedBy: ["home-scout"],
        grantedTo: [],
    },
    // ─── SMS (Twilio chokepoint) ──────────────────────────────────────────────
    // Rello is the platform's SMS chokepoint per
    // feedback-vendor-key-chokepoint-per-data-domain — the Twilio account, sender pool,
    // STOP suppression, and sender reputation all live at Rello. This permission gates
    // the service-to-service SMS-send surface used by spokes that need to dispatch
    // MLO-internal transactional SMS (initially: PathfinderPro view-notifier MLO
    // view-of-deliverable notifications). Distinct from the session-auth
    // /api/inbox/sms/send receiver which handles user-initiated lead-reply SMS —
    // sms:send is service-to-service, payload-resolved recipient, default-from sender.
    // Per-MLO sender provisioning is a documented gap (DISCOVERED
    // per-agent-twilio-sender-provisioning-gap-2026-05-11) — today all sends go from
    // platform TWILIO_DEFAULT_FROM.
    SMS_SEND: {
        slug: "sms:send",
        label: "Send transactional SMS via Rello Twilio chokepoint",
        description: "Rello receiver — POST /api/sms/service-send. Service-to-service Twilio SMS dispatch for spoke MLO-internal notifications (e.g. PathfinderPro view-notifier). Payload carries resolved recipient `to`; sender is platform TWILIO_DEFAULT_FROM. Restores PathfinderPro view-notifier MLO SMS path (was silently 404ing NS /api/emails/send). Validated by Rello's validateApiKey.",
        validatedBy: ["rello"],
        grantedTo: ["pathfinder-pro"],
    },
    // ─── Social integrations ──────────────────────────────────────────────────
    SOCIAL_READ: {
        slug: "social:read",
        label: "Read social credentials",
        description: "Drumbeat runtime OAuth credential fetch via /api/admin/integrations/social-credentials.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Re-opt-in / suppression-lift (SPAM-COMPLAINT-REOPT-IN-PATH §4.5) ─────
    REOPT_IN_DISPATCH: {
        slug: "reopt-in:dispatch",
        label: "Dispatch re-opt-in",
        description: "Rello → NS outbound permission allowing the complianceExempt: true body flag on blueprint-send. Without it, NS ignores the flag (fail-safe).",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    REOPT_IN_CONFIRM: {
        slug: "reopt-in:confirm",
        label: "Confirm re-opt-in",
        description: "NS → Rello inbound permission for POST /api/reopt-in/confirm.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    REOPT_IN_LOOKUP: {
        slug: "reopt-in:lookup",
        label: "Lookup re-opt-in",
        description: "NS → Rello inbound permission for GET /api/reopt-in/lookup.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SUPPRESSION_LIFT_WRITE: {
        slug: "suppression-lift:write",
        label: "Write suppression-lift webhook",
        description: "Rello → NS outbound permission for POST /api/webhooks/rello/suppression-lift. Different from suppression:lift — that's NS's receiver permission; this is the slug Rello's outbound key holds to call it. Distinct slugs preserved per Phase 1 inventory.",
        validatedBy: ["newsletter-studio"],
        grantedTo: [],
    },
    // ─── Lifestyle (Content Engine receiver, Q7.1) ────────────────────────────
    LIFESTYLE_READ: {
        slug: "lifestyle:read",
        label: "Read lifestyle data",
        description: "Content Engine receiver — GET /api/local-spots/* (canonical lifestyle-data owner per APP-OWNERSHIP-MATRIX). Held by Rello admin proxy outbound key per Q7.1 lock 2026-05-01. Replaces PE-side LocalSpot admin proxy retiring per DISCOVERED-PLATFORM-LIFESTYLE-DATA-OWNERSHIP-DRIFT-042926.",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    LIFESTYLE_WRITE: {
        slug: "lifestyle:write",
        label: "Write lifestyle data",
        description: "Content Engine receiver — POST/PATCH/DELETE /api/local-spots/* (canonical lifestyle-data owner per APP-OWNERSHIP-MATRIX). Held by Rello admin proxy outbound key per Q7.1 lock 2026-05-01.",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    // ─── Property Engine receiver narrows (Q7.7 Path A migration) ─────────────
    LOOKUPS_READ: {
        slug: "lookups:read",
        label: "Read property lookups",
        description: "Property Engine receiver — GET /api/lookups/* + /api/attom-lookup + /api/neighborhood-lookup (read-side property/parcel/attom lookup endpoints). Held by Rello → PE outbound key per Q7.7 lock 2026-05-01 to prevent over-grant relative to engine:access.",
        validatedBy: ["property-engine"],
        grantedTo: [],
    },
    LISTINGS_READ: {
        slug: "listings:read",
        label: "Read property listings",
        description: "Property Engine receiver — GET /api/listings/* (MLS listings serving). Held by Rello → PE outbound key per Q7.7 lock 2026-05-01 to prevent over-grant relative to engine:access.",
        validatedBy: ["property-engine"],
        grantedTo: [],
    },
    // ─── Content Engine receiver narrows (Q7.7 Path A migration) ──────────────
    WEBSITES_READ: {
        slug: "websites:read",
        label: "Read website diagnostics",
        description: "Content Engine receiver — GET /api/websites/diagnose + /api/websites/* read endpoints. Held by Rello → CE outbound key per Q7.7 lock 2026-05-01 to prevent over-grant relative to engine:access.",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    // ─── Signals — read + admin (Q8.6 SignalRulesManager gates) ───────────────
    SIGNALS_READ: {
        slug: "signals:read",
        label: "Read signals + signal rules",
        description: "Rello receiver — GET /api/admin/signal-rules/* + /api/admin/signals/* read endpoints. Cross-tenant signal-rules data + unhandled-signals view. Gates the read-only paths of the canonical <SignalRulesManager> component (Q8.6 lock 2026-05-01) shared between S&I Tab 2 + Tags Tab 3.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SIGNALS_ADMIN: {
        slug: "signals:admin",
        label: "Administer signals + signal rules",
        description: "Rello receiver — POST/PUT/DELETE /api/admin/signal-rules/* + seed/test endpoints. Gates the mutation paths of the canonical <SignalRulesManager> component (Q8.6 lock 2026-05-01).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Admin-domain role permissions (Q9.9 — retires /admin/settings/security/page.tsx:18-27 hardcoded array) ─
    TENANTS_READ: {
        slug: "tenants:read",
        label: "Read tenants (admin role)",
        description: "Rello admin-role permission — read-side access to tenant records via Platform Admin tenant management surfaces. Distinct from tenants:validate which is the cross-app tenant lookup S2S surface.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    TENANTS_WRITE: {
        slug: "tenants:write",
        label: "Write tenants (admin role)",
        description: "Rello admin-role permission — write-side access to tenant records (create, update) via Platform Admin tenant management surfaces.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    TENANTS_DELETE: {
        slug: "tenants:delete",
        label: "Delete tenants (admin role)",
        description: "Rello admin-role permission — delete tenant records via Platform Admin tenant management surfaces.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    BILLING_READ: {
        slug: "billing:read",
        label: "Read billing (admin role)",
        description: "Rello admin-role permission — read-side access to billing/Stripe surfaces via Platform Admin Billing pages.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    BILLING_WRITE: {
        slug: "billing:write",
        label: "Write billing (admin role)",
        description: "Rello admin-role permission — write-side access to billing/Stripe surfaces (plan config, invoice ops) via Platform Admin Billing pages.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    BILLING_ADMIN: {
        slug: "billing:admin",
        label: "Administer billing (admin role)",
        description: "Rello admin-role permission — most-privileged billing scope (cancel subscriptions, issue refunds, grant trial extensions) via Platform Admin Billing pages. Per CROSS-APP-BILLING-V2.md §Permissions.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SUPPORT_READ: {
        slug: "support:read",
        label: "Read support (admin role)",
        description: "Rello admin-role permission — read-side access to support ticket surfaces via Platform Admin Support pages.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SUPPORT_WRITE: {
        slug: "support:write",
        label: "Write support (admin role)",
        description: "Rello admin-role permission — write-side access to support tickets (status changes, notes) via Platform Admin Support pages.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    ANALYTICS_READ: {
        slug: "analytics:read",
        label: "Read analytics (admin role)",
        description: "Rello admin-role permission — read-side access to platform analytics + Insights surfaces.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SETTINGS_READ: {
        slug: "settings:read",
        label: "Read platform settings (admin role)",
        description: "Rello admin-role permission — read-side access to Platform Admin settings surfaces (api-keys list, security roles, feature flags).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SETTINGS_WRITE: {
        slug: "settings:write",
        label: "Write platform settings (admin role)",
        description: "Rello admin-role permission — write-side access to Platform Admin settings (mint api keys, edit security roles, toggle features).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SYSTEM_READ: {
        slug: "system:read",
        label: "Read system health (admin role)",
        description: "Rello admin-role permission — read-side access to System Health surfaces (operations, infrastructure, alerts, jobs, audit log).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SYSTEM_WRITE: {
        slug: "system:write",
        label: "Write system health (admin role)",
        description: "Rello admin-role permission — write-side access to System Health (alert config, job triggering, system actions).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    USERS_READ: {
        slug: "users:read",
        label: "Read users (admin role)",
        description: "Rello admin-role permission — read-side access to platform-user records via Platform Admin Users surfaces.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    USERS_WRITE: {
        slug: "users:write",
        label: "Write users (admin role)",
        description: "Rello admin-role permission — write-side access to platform-user records (create, update, role changes).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    IMPERSONATE: {
        slug: "impersonate",
        label: "Impersonate tenant users (admin role)",
        description: "Rello admin-role permission — exercise impersonation flow to view a tenant's UI as one of its users for support/diagnosis. High-trust permission; audit-logged on every use per § Audit Logging on Mutations.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── MLO Partner directory (D-2 lock — Tier 1B.6 / Wave 2) ────────────────
    // Per SPEC-MLOPARTNER-RELLO-CANONICAL.md (2026-05-03): per-tenant MLO
    // directory centralized in Rello. Two separate slugs per Q7.1
    // lifestyle:read/write pattern — supports role-tiered admin access
    // (support-tier read-only vs ops-tier write).
    MLO_PARTNER_READ: {
        slug: "mlo-partner:read",
        label: "Read MLO partner directory",
        description: "Rello receiver — GET /api/proxy/mlo-partners* + /api/admin/mlo-partners*. Held by Rello → spoke admin proxies and by HR/HS → Rello directory proxy adapters per SPEC-MLOPARTNER-RELLO-CANONICAL.md (2026-05-03). Separate from mlo-partner:write per Q7.1 lifestyle:read/write pattern — supports role-tiered admin access (support-tier read-only vs ops-tier write).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    MLO_PARTNER_WRITE: {
        slug: "mlo-partner:write",
        label: "Write MLO partner directory",
        description: "Rello receiver — POST/PATCH/DELETE /api/proxy/mlo-partners* + /api/admin/mlo-partners* + magic-link issuance. Held by HR/HS → Rello directory proxy adapter per SPEC-MLOPARTNER-RELLO-CANONICAL.md (2026-05-03).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Content Engine internal verbs (Q7.1-CE-RECONCILIATION Phase 1c) ──────
    // Per SPEC-Q7-1-CE-PERMISSION-SURFACE-RECONCILIATION.md (2026-05-06): the
    // canonical Rello → CE ApiKey mint shape covers both forward-looking
    // domain-scope slugs (engine:access + lifestyle:read/write + websites:read)
    // AND CE-internal verbs (query/ingest/generate) that CE's `hasPermission()`
    // calls actually gate on across 32 source files. Promoting the verbs to
    // the canonical registry pulls them under the same write-time validator
    // (api-key-create.ts:VALID_PERMISSIONS) as every other slug — future
    // re-mints via the admin UI will accept the full ≥7-slug shape without a
    // target-app-aware carve-out (Option 1c-A per the spec). Mirrors the
    // engine:access + lifestyle:read/write + parcel:read/write precedent
    // (per-engine narrow permissions with validatedBy = ["content-engine"]).
    QUERY: {
        slug: "query",
        label: "Query Content Engine read routes",
        description: "Content Engine receiver — GET /api/articles/* + /api/content/* + /api/voices/* + /api/sources/* + /api/confirmations/* + /api/websites/* + /api/tenants/[id]/* + /api/logs/* read endpoints. CE-internal verb gating every list/get route per CE's auth.ts:145-149 hasPermission() string-compare. Held by Rello → CE outbound key per SPEC-Q7-1-CE-PERMISSION-SURFACE-RECONCILIATION.md (2026-05-06).",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    INGEST: {
        slug: "ingest",
        label: "Ingest Content Engine write routes",
        description: "Content Engine receiver — POST/PUT/PATCH/DELETE /api/articles/ingest + /api/sources/* + /api/websites/* + /api/confirmations/confirm + /api/confirmations/dismiss write endpoints. CE-internal verb gating every write route per CE's auth.ts:145-149 hasPermission() string-compare. Held by Rello → CE outbound key per SPEC-Q7-1-CE-PERMISSION-SURFACE-RECONCILIATION.md (2026-05-06).",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    GENERATE: {
        slug: "generate",
        label: "Generate Content Engine output routes",
        description: "Content Engine receiver — POST /api/generate/digest + /api/generate/email-summary + /api/generate/podcast + /api/generate/newsletter + POST/PATCH /api/voices/* + POST /api/tenants/[id]/voices + POST /api/tenants/[id]/content-preferences. CE-internal verb gating every generation/voice route per CE's auth.ts:145-149 hasPermission() string-compare. Held by Rello → CE outbound key per SPEC-Q7-1-CE-PERMISSION-SURFACE-RECONCILIATION.md (2026-05-06).",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    // ─── Lead Marketplace (PE receiver, SPEC-PE-LEAD-PROVIDERS-FRAMEWORK §4.7) ──
    // Per SPEC-PE-LEAD-PROVIDERS-FRAMEWORK.md (2026-05-07) — Property Engine
    // serves Harvest Home's commercial Discovery Marketplace via Path A inter-app
    // auth. Verify shares lead-marketplace:search per §4.5 lock (preview-tier
    // read pairs cleanly with search semantics). grantedTo: ["harvest-home"] is
    // pre-launch over-granted on the existing HARVEST_HOME → PROPERTY_ENGINE
    // ApiKey row at Phase 4 (per pre-launch over-grant tolerance + §4.8 lock).
    LEAD_MARKETPLACE_SEARCH: {
        slug: "lead-marketplace:search",
        label: "Search lead-marketplace inventory",
        description: "PE serving endpoints `GET /api/lead-providers/search` + `POST /api/lead-providers/verify` (verify shares search permission per §4.5 lock).",
        validatedBy: ["property-engine"],
        grantedTo: ["harvest-home"],
    },
    LEAD_MARKETPLACE_UNLOCK: {
        slug: "lead-marketplace:unlock",
        label: "Unlock lead-marketplace record",
        description: "PE serving endpoint `POST /api/lead-providers/unlock`.",
        validatedBy: ["property-engine"],
        grantedTo: ["harvest-home"],
    },
    // ─── Homeowner Sync (The Oven receiver, HH → Oven post-close profile push) ──
    // Per CENTRALIZED-API-KEY-MIGRATION.md Phase 5 receiver-first session — Harvest
    // Home pushes homeowner-profile records to The Oven for retention tracking +
    // equity-digest enrollment after lead transitions to closed. Closes the
    // silently-dead OVEN_APP_SECRET X-App-Secret pattern (HH outbound's header
    // never matched any Oven receiver gate; feature was 401'ing in prod). Pre-launch
    // over-grant tolerance: grantedTo: ["harvest-home"] is the only minted caller at
    // ship time; future spoke→Oven retention pushers may also acquire this slug.
    HOMEOWNER_SYNC_WRITE: {
        slug: "homeowner-sync:write",
        label: "Sync homeowner profile to retention spoke",
        description: "Harvest Home → The Oven POST /api/homeowners per-caller credential for post-close homeowner-profile sync (retention tracking + equity-digest enrollment). Replaces the silently-dead OVEN_APP_SECRET X-App-Secret pattern per CENTRALIZED-API-KEY-MIGRATION Phase 5 receiver-first session. The Oven's requireServiceBearer enforces this permission via createServiceBearerGuard.",
        validatedBy: ["the-oven"],
        grantedTo: ["harvest-home"],
    },
    // ─── Meetings (Rello inbound — booking surface, cross-app HS → Rello) ─────
    // RCAL Phase 2 — POST /api/meetings/book is the cross-app booking entry
    // point: HS booking page authors a meeting against a Rello-hosted
    // BookingLink, creating Lead-if-new + Meeting + AuditLog + outbound
    // rello.meeting_booked signal. Permission also gates the meeting-state
    // mutation surface (cancel via cancellation token, reschedule, complete,
    // no-show) and the BookingLink + TeamPool CRUD endpoints. Naming follows
    // the noun-plural:write precedent (leads:write, signals:write, intake:write).
    MEETINGS_WRITE: {
        slug: "meetings:write",
        label: "Write meetings",
        description: "Rello booking + meeting surface — POST /api/meetings/book (cross-app inter-app booker, e.g. HS booking page → Rello), POST /api/meetings/[id]/{complete,cancel,no-show}, PATCH /api/meetings/[id], plus BookingLink + TeamPool + TeamPoolMember CRUD endpoints under /api/booking-links/* and /api/team-pools/*. Held by per-spoke ApiKey rows whose surface authors meetings into Rello (HS booking page is the canonical caller; future cross-app integrations may also acquire).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // RCAL Phase 7 — read-side counterpart that gates the public-booking
    // discovery surface: HS server components rendering
    // (public)/[agentSlug]/tools/book-a-call/* call Rello to list active
    // BookingLinks for an agent slug and to resolve a specific BookingLink by
    // (agentSlug, meetingTypeSlug). Token-bearer paths (cancellation-token
    // meeting reads, ?token= cancel) and POST /api/availability/[agentId]/slots
    // remain unauthenticated as in Phase 2; meetings:read is the explicit gate
    // for the BookingLink discovery surface where ApiKey traceability is
    // required even though the data is public-facing.
    MEETINGS_READ: {
        slug: "meetings:read",
        label: "Read meetings",
        description: "Rello booking discovery surface — GET /api/booking-links/by-agent/[agentSlug] (lists active BookingLinks for a public agent slug) + GET /api/booking-links/by-slug?agentSlug=X&meetingTypeSlug=Y (resolves a single BookingLink for the slot-picker page). Held by HS → Rello ApiKey rows whose public-route components need to enumerate booking surfaces without an agent session. Naming follows the noun-plural:read precedent (signals:read, leads:read).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Metrics (Rello inbound — engine-side metric snapshot ingest proxy) ────
    METRICS_INGEST: {
        slug: "metrics:ingest",
        label: "Ingest platform metric snapshots",
        description: "Rello inbound — POST /api/metrics/snapshot/ingest. Engine-side daily metric writer crons (Report Engine, Drumbeat Video Engine, Property Engine, Content Engine) emit batch records into PlatformMetricSnapshot via this endpoint. Held by each AUTHOR engine's <ENGINE> → RELLO ApiKey row per SPEC-METRICS-INGEST-PROXY.md §Phase C. Milo Engine writes direct shared-Neon and does NOT hold this permission. Journey Engine is SKIP/empty-state per SPEC-ENGINE-SIDE-METRIC-EMITTERS-TRIAGE.md §Journey-Skip.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Homeowner Hub (HHUB Phase 4 — HS ↔ Oven cross-spoke surface) ─────────
    // Per SPEC HOMEOWNER-HUB.md (2026-05-08) — the consumer-facing past-client
    // engagement surface in Home Scout's `(owner)` route group reads CTA
    // selection + visit tracking + HomeownerProfile from The Oven, and Oven's
    // cta-selector reads CtaDefinition rows from Home Scout. Three slugs gate
    // the HS → Oven direction; one slug gates the new Oven → HS direction
    // (cta-definitions read). Atomic per Rule C with the cta-selector +
    // visit-tracker bundle. Pre-launch over-grant tolerance: grantedTo arrays
    // reflect the only minted callers at ship time.
    OVEN_CTA_SELECT: {
        slug: "oven:cta-select",
        label: "Select Hub CTAs from The Oven",
        description: "Home Scout → The Oven POST /api/homeowner-cta-select per-caller credential. The Oven's deterministic ranker reads HomeownerProfile + OvenScore + recent ClientSignal rows + HS CtaDefinition registry and returns the top-N CTA slugs for the Hub render. Per spec § BLOCKERS B-03 lock — pull-architecture, signal-driven, no pinning. Validated by The Oven's requireServiceBearer.",
        validatedBy: ["the-oven"],
        grantedTo: ["home-scout"],
    },
    OVEN_VISIT_TRACK: {
        slug: "oven:visit-track",
        label: "Track Hub visits to The Oven",
        description: "Home Scout → The Oven POST /api/homeowner-hub/visit-track per-caller credential. Records HomeownerHubVisit rows (ctas shown / clicked / duration / referrer) for telemetry attribution and ranker feedback. Fire-and-forget with RelloSyncQueue retry path per spec § Durable Pattern Analysis #6. Validated by The Oven's requireServiceBearer.",
        validatedBy: ["the-oven"],
        grantedTo: ["home-scout"],
    },
    OVEN_HOMEOWNER_PROFILE_READ: {
        slug: "oven:homeowner-profile-read",
        label: "Read HomeownerProfile from The Oven",
        description: "Home Scout → The Oven GET /api/homeowner-profile/[leadId] per-caller credential. Returns HomeownerProfile + OvenScore + recent (30d) ClientSignal rows for the Hub data-assembly to populate the homeowner block (name + score + temperature + lifeEvents). Lock E commitment from HHUB Phase 3 — atomic with cta-selector cross-repo work. Validated by The Oven's requireServiceBearer.",
        validatedBy: ["the-oven"],
        grantedTo: ["home-scout"],
    },
    HOME_SCOUT_CTA_DEFINITIONS_READ: {
        slug: "home-scout:cta-definitions-read",
        label: "Read CTA definitions from Home Scout",
        description: "The Oven → Home Scout GET /api/cta-definitions?audiences=OWNER per-caller credential. Lets Oven's cta-selector enumerate active OWNER-audience CtaDefinition rows (slug + label + priority + applicableIntents/Goals/Stages + excludeIfSignals + requireSignals + audiences) without crossing the canonical-owner boundary on HS's CtaDefinition table. First Oven → HS inter-app path; mints the direction. Validated by Home Scout's requireServiceBearer.",
        validatedBy: ["home-scout"],
        grantedTo: ["the-oven"],
    },
    // ─── Milo Compose-Homeowner-Hub (Milo receiver, HHUB Phase 5) ──────────────
    // Per HOMEOWNER-HUB.md § Build Plan Phase 5 — Home Scout's Hub data-assembly
    // calls Milo's pure composition layer (greeting + per-CTA bodies) using the
    // Oven-selected slugs from Phase 4 + the homeowner profile context. Milo
    // composes tone only — never reorders, adds, or drops Oven's selection
    // (B-03 lock). Pure composition: input contract { homeownerProfileId,
    // dormantStage, ovenScore, selectedCtaSlugs[], context }, output contract
    // { greeting, ctaBodies: Record<slug, body> }. Mints the direction
    // home-scout → milo-engine for Hub render. Validated by Milo's centralized
    // ApiKey middleware (validatePlatformBearer).
    MILO_COMPOSE_HOMEOWNER_HUB: {
        slug: "milo:compose-homeowner-hub",
        label: "Compose Homeowner Hub greeting + CTA bodies via Milo",
        description: "Home Scout → Milo Engine POST /api/compose-homeowner-hub per-caller credential. Returns Sonnet-composed greeting (1-2 sentences) + per-CTA body text (1-2 sentences each) keyed by Oven-selected CTA slug. Pure composition layer — Milo never reorders / adds / drops Oven's selection per spec § BLOCKERS B-03. Validated by Milo's centralized ApiKey middleware (Path A: Bearer rello_*). HHUB Phase 5.",
        validatedBy: ["milo-engine"],
        grantedTo: ["home-scout"],
    },
    // ─── Drumbeat content-cadence read (RCAL Phase 4 — Rello → Drumbeat) ───────
    // Per RELLO-CALENDAR.md § Build Plan Phase 4 — Rello's multi-source calendar
    // event aggregator (`GET /api/calendar/events?layers=…`) calls Drumbeat's
    // `GET /api/calendar/content-cadence-feed` to fetch ContentCalendarEntry
    // rows for the Drumbeat layer of the Calendar UI. Read-only; tenant-scoped
    // by the receiver via the inbound x-tenant-id query param resolved against
    // the caller's session-derived tenant. Mints the direction rello →
    // the-drumbeat for cross-app calendar aggregation. Validated by Drumbeat's
    // requireServiceBearer (createServiceBearerGuard against centralized
    // ApiKey table; SHA-256 hash match advances ApiKey.lastUsedAt).
    DRUMBEAT_CONTENT_CADENCE_READ: {
        slug: "drumbeat:content-cadence-read",
        label: "Read Drumbeat content cadence for calendar aggregation",
        description: "Rello → The Drumbeat GET /api/calendar/content-cadence-feed per-caller credential. Returns ContentCalendarEntry rows (id, title, scheduledDate, channelType) for a given (tenantId, agentId, from, to) window so Rello's calendar event aggregator can render the Drumbeat layer of the multi-source Calendar UI. Per spec § External contracts line 476-482. Validated by The Drumbeat's requireServiceBearer. RCAL Phase 4.",
        validatedBy: ["the-drumbeat"],
        grantedTo: ["rello"],
    },
    // ─── Home Stretch platform-default config sync (Rello → HS) ────────────────
    // Per SPEC-HS-INBOUND-AUTH-CANONICALIZATION.md (2026-05-09) — closes the
    // SHAPE-01-class non-canonical SHA-256-hash X-API-Key compare on HS's articles
    // and rewards platform-default sync receivers. Single slug covers both
    // receivers; both surfaces are platform-default config push from Rello to HS
    // (articles to populate StepArticle module rows, rewards config to populate
    // TenantAppConfig.rewardsEnabled + rewardTiers). Mints the direction
    // rello → home-stretch for platform-default config push. Validated by HS's
    // existing requireServiceBearer (createServiceBearerGuard against centralized
    // ApiKey table; SHA-256 hash match advances ApiKey.lastUsedAt).
    HOME_STRETCH_PLATFORM_SYNC: {
        slug: "home-stretch:platform-sync",
        label: "Sync platform-default config to Home Stretch",
        description: "Rello → Home Stretch POST /api/admin/articles/platform + POST /api/admin/rewards/sync per-caller credential. Rello platform admin pushes platform-default articles (StepArticle source=PLATFORM) and platform-default rewards config (TenantAppConfig.rewardsEnabled + rewardTiers) to HS. Validated by HS's requireServiceBearer.",
        validatedBy: ["home-stretch"],
        grantedTo: ["rello"],
    },
    // ─── Scout receiver — landing-page library read (Drumbeat → Scout) ─────────
    // Per SPEC-DRUM-LANDING-PAGES-RETIRE-LOCAL.md (2026-05-09) Phase 0b — closes
    // Drumbeat's local landing-page surface by routing the Pages tab (formerly
    // local /api/landing-pages CRUD on LandingPage / LandingPageVersion /
    // LandingPagePublish models) to Home Scout's canonical landing-page library
    // via GET /api/landing-pages. Mirrors cta-registry:read shape verbatim per
    // ~API-KEY-LIFECYCLE-README.md:101 (validatedBy: home-scout, grantedTo: peer
    // spoke). Mints the direction the-drumbeat → home-scout for landing-page
    // library reads. Validated by Scout's validateApiKey (SHA-256 hash match
    // advances ApiKey.lastUsedAt; per-pair appSource/targetApp isolation
    // enforced).
    LANDING_PAGE_READ: {
        slug: "landing-page:read",
        label: "Read Home Scout landing-page library",
        description: "The Drumbeat → Home Scout GET /api/landing-pages per-caller credential. Returns Scout's canonical LandingPage rows (id, title, slug, status, updatedAt) for a (tenantId, agentId) pair so Drumbeat's Pages tab can render Scout's landing-page library in place of Drumbeat's retired local landing-page CRUD. Mirrors cta-registry:read shape per ~API-KEY-LIFECYCLE-README.md:101. Validated by Home Scout's validateApiKey.",
        validatedBy: ["home-scout"],
        grantedTo: ["the-drumbeat"],
    },
    // ─── Hub magic-link issuance (Milo Engine → Rello) ────────────────────────
    // Per HHUB Phase 7 Step 8b — Milo Engine's HOMEOWNER_HUB_INTRODUCE flow
    // (Path 2) calls Rello's POST /api/leads/[id]/send-hub-link to mint a
    // homeowner-hub magic-link session token. The Rello receiver (widened in
    // Step 6.3b) branches on auth: session-auth + source: 'agent-manual' (the
    // existing path, DNC-bypass allowed) vs ApiKey-auth + source:
    // 'milo-introduce' (the new path, DNC suppression enforced). This slug
    // gates the ApiKey-auth branch. Mints the direction milo-engine → rello
    // for autonomous hub-link issuance during introduce-flow execution.
    // Validated by Rello's validateApiKey (Path A: Bearer rello_*; SHA-256
    // hash match advances ApiKey.lastUsedAt; per-pair appSource/targetApp
    // isolation enforced).
    HUB_ISSUE_MAGIC_LINK: {
        slug: "hub:issue-magic-link",
        label: "Issue homeowner-hub magic-link session token",
        description: "Milo Engine → Rello POST /api/leads/[id]/send-hub-link per-caller credential. Mints a homeowner-hub magic-link session token for the lead so Milo's HOMEOWNER_HUB_INTRODUCE flow (Path 2) can autonomously enroll a homeowner into the Hub. Distinct from the session-auth + source: 'agent-manual' path (DNC-bypass allowed); this ApiKey-auth + source: 'milo-introduce' path enforces DNC suppression at the issueMagicLink library layer. Validated by Rello's validateApiKey (Path A: Bearer rello_*). HHUB Phase 7.",
        validatedBy: ["rello"],
        grantedTo: ["milo-engine"],
    },
    // ─── Cross-app AuditLog write (Spoke → Rello, MI-PUBLICATION-MODEL DL6) ───
    // Spoke writes its own admin-managed tenant-policy mutation locally (its own
    // Prisma client), then POSTs to Rello's /api/internal/audit so Rello writes
    // the AuditLog row via Rello's Prisma client. Required because Prisma
    // $transaction is single-client — atomic [prismaSpoke.X.update,
    // prismaRello.auditLog.create] is structurally impossible across two Neon
    // databases. Pattern B (non-fatal-on-audit-failure) per
    // ~AUDIT-LOGGING-DRIFT-PREVENTION-README.md §4 — spoke wraps fetch in
    // try/catch + console.error and continues on audit failure. Initial caller:
    // market-intel Publication / Branding / future tenant-policy mutations.
    // Per Rule I D-4 narrow-per-purpose: held by spoke-side ApiKey rows
    // (appSource=<SPOKE>, targetApp=RELLO) — NOT extending the spoke's existing
    // MILO_API_KEY or PROVISIONING key.
    AUDIT_WRITE: {
        slug: "audit:write",
        label: "Write cross-app AuditLog row",
        description: "Spoke → Rello POST /api/internal/audit per-caller credential. Authenticates the caller via narrow ApiKey, validates the body against AuditLog field shape, then writes prisma.auditLog.create on Rello's Prisma client. Pattern B (non-fatal-on-audit-failure) per ~AUDIT-LOGGING-DRIFT-PREVENTION-README.md §4 — caller swallows audit-fetch errors with console.error and continues. Used when a spoke is Neon-isolated from Rello's Prisma client and cross-Prisma-client atomic $transaction is structurally impossible (single-client constraint). Initial caller: market-intel Publication / Branding / future tenant-policy mutations per MI-PUBLICATION-MODEL DL6. Validated by Rello's validateApiKey (Path A: Bearer rello_*).",
        validatedBy: ["rello"],
        grantedTo: ["market-intel"],
    },
    // ─── Public-pricing checkout (Spoke → Rello, CROSS-APP-BILLING-V2 §A3) ────
    // Spoke renders its own public /pricing page; when a visitor clicks "Buy",
    // the spoke POSTs to Rello's hub-side Stripe Checkout session creator on
    // behalf of an unauthenticated visitor (no Rello session). Per §A3 lock,
    // this replaces the prior parallel HMAC keyspace — the spoke→Rello ApiKey
    // row IS the public-checkout credential. Granted to every spoke that
    // exposes a public /pricing surface (Per Rule I D-4 narrow-per-purpose).
    PUBLIC_CHECKOUT_WRITE: {
        slug: "public-checkout:write",
        label: "Initiate public Stripe Checkout session",
        description: "Spoke → Rello POST /api/v1/billing/public-checkout per-caller credential. Initiates a Stripe Checkout session for an unauthenticated visitor of the spoke's public /pricing page; Rello returns the hosted Checkout URL. Replaces the parallel HMAC keyspace previously proposed for the public-pricing flow per CROSS-APP-BILLING-V2.md §A3 lock — the spoke→Rello ApiKey row carries this scope as a narrow-per-purpose permission. Validated by Rello's validateApiKey (Path A: Bearer rello_*).",
        validatedBy: ["rello"],
        grantedTo: [],
    },
};
/**
 * Frozen list of every canonical permission slug — the universe a write-time
 * validator or DB CHECK constraint can enforce membership against.
 */
export const ALL_PERMISSION_SLUGS = Object.freeze(Object.values(PERMISSIONS).map((p) => p.slug));
/**
 * Reverse lookup from wire-format slug → canonical key. Used by ESLint
 * `no-string-permission` autofix and runtime decoding paths.
 *
 * Built on a null-prototype object so `isPermissionSlug` cannot return true
 * for `toString` / `constructor` / `__proto__` / other prototype-chain
 * inherited names when callers pass untrusted input from URL params, form
 * fields, persisted JSON, or saved-view payloads.
 */
const slugToKeyMap = Object.create(null);
for (const [key, def] of Object.entries(PERMISSIONS)) {
    slugToKeyMap[def.slug] = key;
}
export const SLUG_TO_KEY = Object.freeze(slugToKeyMap);
/**
 * Type guard for runtime validation at decoding boundaries.
 *
 * Uses `Object.prototype.hasOwnProperty.call` against the null-prototype
 * `SLUG_TO_KEY` map — both layers are required to defend against untrusted
 * lookup keys that might match prototype-chain inherited names.
 */
export function isPermissionSlug(value) {
    return Object.prototype.hasOwnProperty.call(SLUG_TO_KEY, value);
}
