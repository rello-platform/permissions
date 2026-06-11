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
    // Narrow custom-fields-only write permission. Distinct from `leads:write`
    // which carries broader lead-CRUD authority. Granted to callers (e.g., The
    // Oven scoring outputs) that only need to attach key/value custom fields to
    // an existing lead — not to mutate the lead's identity, contact channels,
    // co-borrower, or milo-insights. SPEC-OVEN-API-KEY-MINT-9-PAIRS Phase A
    // 2026-05-15.
    CUSTOM_FIELDS_WRITE: {
        slug: "custom-fields:write",
        label: "Write lead custom fields",
        description: "Rello receiver — narrow write access to lead custom-field sub-resource (`/api/leads/[id]/custom-fields/*`). Minimum-grant alternative to `leads:write` for callers that only need to attach scoring outputs or app-derived key/value attributes to an existing lead. Granted to The Oven for ColdLeadRevival + OvenScore attribute writebacks per Q4.1 lock.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Realtor Prospects ────────────────────────────────────────────────────
    // Distinct from `agents:*` (canonical agent-roster CRUD) and `leads:*`
    // (consumer borrower-side prospect). RealtorProspect is the MLO-side
    // referral-courtship target (real-estate agents the MLO is cultivating as
    // referral partners). REALTOR-PROSPECT-PIPELINE workstream §6.4 — granted
    // to PathfinderPro for cross-app intake signals
    // (pathfinder-pro.realtor_prospect.intake_received) routed through
    // /api/signals/batch handler-arm on Rello.
    REALTOR_PROSPECTS_WRITE: {
        slug: "realtor-prospects:write",
        label: "Write realtor prospects",
        description: "Write access to RealtorProspect intake + lifecycle endpoints on Rello. Granted to PathfinderPro for cross-app event-attendee intake signals (pathfinder-pro.realtor_prospect.intake_received) — receiver creates RealtorProspect + Activity + AuditLog inside a single $transaction and invokes the Wave-3 Milo nurture boundary helper post-commit.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Referrals (canonical Rello-side referral graph) ──────────────────────
    // ReferralEdge is Rello's canonical model for past-client → new-prospect
    // referral relationships. The Oven owns referral *surfacing* (ReferralProgram
    // UI, ImplicitReferral detection, NetworkScore composition) per app-ownership
    // matrix, but the underlying graph rows live in Rello's relational model so
    // every spoke sees a consistent edge set. SPEC-OVEN-API-KEY-MINT-9-PAIRS
    // Phase A 2026-05-15.
    REFERRAL_EDGES_WRITE: {
        slug: "referral-edges:write",
        label: "Write referral edges",
        description: "Rello receiver — write access to the canonical ReferralEdge graph via `/api/referral-edges/*`. Used by The Oven to materialize explicit referral relationships (ReferralProgram acknowledgments, ImplicitReferral promotions, NetworkScore inputs) into Rello's relational store. Per ownership matrix: The Oven owns surfacing + scoring; Rello owns the canonical edge rows.",
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
    // ─── Canonical cross-app source-event attribution (relloEventId) ──────────
    SOURCE_EVENTS_WRITE: {
        slug: "source-events:write",
        label: "Mint canonical source event (relloEventId)",
        description: "Spoke → Rello mint of the canonical cross-app origination event. POST /api/events/source idempotently upserts a thin SourceEvent row (== relloEventId) keyed on (tenantId, sourceApp, externalEventId); held by OHH (OPEN_HOUSE_HUB → RELLO) and PFP (PATHFINDER_PRO → RELLO) outbound keys. Distinct from leads:write — minting an attribution event is not a lead write (least-privilege boundary, Kelly-locked 2026-06-01). SPEC-CANONICAL-RELLO-EVENT-ID Phase 1.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    SOURCE_EVENTS_READ: {
        slug: "source-events:read",
        label: "Resolve canonical source event (relloEventId)",
        description: "Spoke → Rello resolution of a canonical relloEventId. GET /api/events/source/[relloEventId] returns the thin tenant-scoped metadata (name/date/host/sourceApp/externalEventId). Rello is the single resolution authority; apps do NOT cross-resolve each other's local event rows. SPEC-CANONICAL-RELLO-EVENT-ID Phase 1.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── Observability / Platform Admin alerting ─────────────────────────────
    ALERT_EVENTS_WRITE: {
        slug: "alert-events:write",
        label: "Write AlertEvent (engine + spoke-self-reported ops alerts)",
        description: "Per-spoke + per-engine writers POST to /api/admin/alert-events to surface ops alerts (schema drift, queue stuck, MLS sync lag, R2 saturation, decision-rate anomaly, etc.) in Platform Admin System Health UI. AlertEvent model at Rello/prisma/schema.prisma:10111; existing read consumers documented in model docstring. First writer added per BUILD-|-WORKSTREAM/PROD-VS-CODE-SCHEMA-DRIFT-DETECTION/ 2026-05-18 (closes Rule M observation that AlertEvent model had zero writers despite UI + helper + GET endpoint shipped).",
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
    // Spoke → Content Engine narrow read of the article corpus. Distinct from
    // the broader `query` slug (CE-internal verb gating) and from `articles:sync`
    // (CE → Rello article sync ingest). Granted to The Oven for Reviving 8-week
    // content selection (`/api/articles/relevant`) and Homeowner Hub content
    // embeds. SPEC-OVEN-API-KEY-MINT-9-PAIRS Phase A 2026-05-15.
    ARTICLES_READ: {
        slug: "articles:read",
        label: "Read articles (CE corpus)",
        description: "Content Engine receiver — narrow read access to article corpus selection endpoints (`POST /api/articles/relevant` and adjacent tiered-selection surfaces). Narrower than the broader `query` slug; explicitly granted to The Oven for Reviving 8-week content selection + Homeowner Hub content embeds per Q4.3 lock.",
        validatedBy: ["content-engine"],
        grantedTo: [],
    },
    // ─── Prompts (Rello-served Milo prompt templates) ─────────────────────────
    // Rello hosts the prompt-template registry that Milo and spoke composers
    // read at compose time. Read-only slug for callers that need to fetch the
    // current template body for a given prompt key (versioned by tenant +
    // template-id). The Oven reads templates for Reviving-step + review-request
    // + referral-thanks + handoff-briefing composition (Q4.2 surfaces) prior to
    // calling Milo's `/api/decide` or `/api/analyze`.
    // SPEC-OVEN-API-KEY-MINT-9-PAIRS Phase A 2026-05-15.
    PROMPTS_READ: {
        slug: "prompts:read",
        label: "Read Milo prompt templates",
        description: "Rello receiver — read access to the prompt-template registry (`/api/prompts/*`). Returns versioned prompt-template bodies for a given key + tenant scope. Granted to spoke composers (The Oven Reviving/review-request/referral-thanks/handoff-briefing surfaces; future surfaces) that fetch the canonical template body prior to invoking Milo composition.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── AI usage logging (Rello-side cost-attribution + telemetry sink) ──────
    // Centralized AI usage logger lives at Rello `/api/admin/ai/usage-log`. Every
    // Milo-composing spoke posts per-call attribution (`sourceApp`, `cronSource`,
    // tokens, latency, decisionTier, etc.) so the platform-admin AI-cost surface
    // can aggregate per-tenant + per-surface spend. The Oven posts from all 5
    // compose surfaces per Q4.2 inventory; Newsletter Studio, Home Stretch, and
    // Harvest Home post from their own Milo callers. SPEC-OVEN-API-KEY-MINT-9-
    // PAIRS Phase A 2026-05-15.
    AI_USAGE_WRITE: {
        slug: "ai-usage:write",
        label: "Write AI usage logs",
        description: "Rello receiver — write per-call AI usage logs to the centralized cost-attribution surface (`/api/admin/ai/usage-log`). Used by Milo-composing spokes (The Oven, Newsletter Studio, Home Stretch, Harvest Home, future composers) to post per-call attribution (tokens, latency, decisionTier, sourceApp, cronSource) for platform-admin AI-cost aggregation.",
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
    // ─── Intake from spoke (Spoke → PFP cross-app per-caller credential) ──────
    INTAKE_FROM_SPOKE_WRITE: {
        slug: "pfp-intake-from-spoke:write",
        label: "Write PFP intake from spoke",
        description: "Spoke → Pathfinder Pro /api/intakes/from-spoke per-caller credential. Used by HS get-pre-approved CTA (and any future spoke-originated PFP LeadIntake creation) to write a row with status: 'QUICK_ESTIMATE' that the MLO sees in the cockpit. Receiver validates via requireServiceBearer + @rello-platform/pfp-intake-from-spoke::PfpIntakeFromSpokePayloadSchema. Topology #4 (Spoke → Spoke) per API-KEY-LIFECYCLE-README §2.",
        validatedBy: ["pathfinder-pro"],
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
    // Spoke → Content Engine write of article-engagement events (sent / opened /
    // clicked / scroll-deep) tied to a leadId. CE upserts to hourly buckets +
    // fires `content-engine.article_<action>` signal back to Rello for downstream
    // ClientSignal handler fanout. Granted to The Oven for Reviving-send +
    // Homeowner Hub article-interaction telemetry per Q4.3 lock.
    // SPEC-OVEN-API-KEY-MINT-9-PAIRS Phase A 2026-05-15.
    ENGAGEMENT_WRITE: {
        slug: "engagement:write",
        label: "Write article engagement",
        description: "Content Engine receiver — write access to article-engagement event ingest (`POST /api/articles/engagement`). Accepts single or batch events with `action: sent|opened|clicked|scroll_deep`; CE collapses session dupes via hourly-bucket upsert and emits `content-engine.article_<action>` signals back to Rello for downstream handler fanout. Granted to The Oven for Reviving send + Homeowner Hub article-interaction telemetry per Q4.3 lock.",
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
    // ─── Co-marketing functional co-branding (RELLO II, 2026-05-28) ───────────
    // Per SPEC-RELLO-II-CO-MARKETING-FUNCTIONAL-CO-BRANDING §4/§6: Rello owns the
    // canonical per-MloPartner brand-asset payload + the joint-advertising
    // consent (attestation) state; spoke render is routed-out. These are a
    // distinct FEATURE surface from the mlo-partner:* proxy-directory CRUD pair
    // (which gates entity identity CRUD) — three-segment feature:sub-resource:verb
    // form per the compliance:phrase-rules:read / homeowner:magic-link:issue
    // precedent. SPEC §4's underscore literals (mlo_partner_branding:*) are
    // superseded by the platform lowercase-hyphenated slug rule; namespace locked
    // to `co-marketing:*` by Kelly 2026-05-28 (KA decision on the PR-2 dispatch).
    CO_MARKETING_BRANDING_READ: {
        slug: "co-marketing:branding:read",
        label: "Read co-marketing brand payload",
        description: "Rello receiver — GET /api/v1/mlo-partners/[id]/branding + GET /api/v1/mlo-partners/[id]/attestation. Read-only render payload (logo/colors/NMLS/license-states/joint-ad-disclosure) + attestation status. Held by spoke render-side outbound keys (newsletter-studio / open-house-hub / the-drumbeat / harvest-home / homeready / the-homestretch / home-scout → rello). Returns 403 when the lender's CoMarketingDisclosureAttestation is not ACTIVE (consent-first render gate, RESPA §8). Granted to spoke pairs in PR-6.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CO_MARKETING_BRANDING_WRITE: {
        slug: "co-marketing:branding:write",
        label: "Write co-marketing brand payload",
        description: "Forward-reserved. No SPEC §4 endpoint consumes this yet — owner brand-asset writes are session-authed (BR/MO/AGENT_OWNER) on /api/admin/mlo-partners/[id]/branding, not ApiKey. Shipped now so a future spoke-suggested brand-change flow can be granted without a package bump. Granted to spoke pairs in PR-6.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CO_MARKETING_ATTESTATION_WRITE: {
        slug: "co-marketing:attestation:write",
        label: "Write co-marketing joint-ad attestation",
        description: "Rello receiver — POST/DELETE /api/v1/mlo-partners/[id]/branding/attest. Lender joint-advertising consent capture + revoke from the HR/HS Guest MLO portal (writes CoMarketingDisclosureAttestation + AuditLog). Additionally gated on a valid GuestMLO session token in the request body. Held by the HR/HS portal outbound keys → rello. Granted to spoke pairs in PR-6.",
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
    // ─── The Oven inbound receivers (Rello → Oven cross-app surfaces) ─────────
    // Two complementary slugs for Platform Admin / Rello-side surfaces that
    // need to push or pull tenant-scoped data on Oven. Both gated by The Oven's
    // requireServiceBearer + per-caller ApiKey row (RELLO → THE_OVEN appSource
    // pair) per Q4.1 lock. SPEC-OVEN-API-KEY-MINT-9-PAIRS Phase A 2026-05-15.
    ENGAGEMENT_CONFIG_WRITE: {
        slug: "engagement-config:write",
        label: "Write engagement config to Oven",
        description: "The Oven receiver — write access to per-tenant EngagementConfig records (`/api/engagement-config/*`). Used by Rello Platform Admin (Tab 5 admin surface) to push tenant-level engagement thresholds, signal-rule overrides, and cadence configuration into The Oven. The Oven stores the canonical config row and re-fans changes downstream into ColdLeadRevival + nurture orchestration. Granted to Rello per Q4.1 lock.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    PAST_CLIENT_READ: {
        slug: "past-client:read",
        label: "Read past-client data from Oven",
        description: "The Oven receiver — read access to past-client activity + scoring + signal aggregates (`/api/past-clients/*`). Used by Rello to render the SeePastClientActivityCard on the Lead Profile (Q1.4 lock) without duplicating Oven's HomeownerProfile + ClientSignal state into Rello. Returns per-tenant + per-lead aggregates only; raw event rows stay on Oven. Granted to Rello per Q4.1 lock.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    // ─── Past-client lead-profile 1-click actions (Rello → Oven, Q4.5 Lock #1) ─
    // ANSWERS Q4.5 (T1-Q4-5-AMENDMENT close 2026-05-15) — five per-purpose
    // permission slugs for the SeePastClientActivityCard 1-click action surface
    // on the Rello Lead Profile. Same Q4.1 inbound ApiKey row as past-client:read
    // + engagement-config:write. Each slug gates exactly one POST endpoint on
    // The Oven, validated by The Oven's requireServiceBearer. grantedTo: []
    // matches the catalog convention for Rello-as-grantee (provenance in
    // description only) — see PAST_CLIENT_READ + ENGAGEMENT_CONFIG_WRITE.
    PAST_CLIENT_REQUEST_REVIEW: {
        slug: "past-client:request-review",
        label: "Past-client review request",
        description: "The Oven receiver — POST /api/past-clients/[leadId]/request-review per-caller credential. Authorizes Rello-proxy to create a ReviewRequest for an Oven past client (lead-profile 1-click action). Granted to Rello per Q4.1 lock + Q4.5 Lock #1.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    PAST_CLIENT_START_REVIVAL: {
        slug: "past-client:start-revival",
        label: "Past-client revival start",
        description: "The Oven receiver — POST /api/past-clients/[leadId]/start-revival per-caller credential. Authorizes start of a ColdLeadRevival campaign on an Oven past client (lead-profile 1-click action). Granted to Rello per Q4.1 lock + Q4.5 Lock #1.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    PAST_CLIENT_HAND_OFF: {
        slug: "past-client:hand-off",
        label: "Past-client handoff initiation",
        description: "The Oven receiver — POST /api/past-clients/[leadId]/hand-off per-caller credential. Authorizes creation of a HandoffEvent for an Oven past client carrying the closing payload (lead-profile 1-click action). Granted to Rello per Q4.1 lock + Q4.5 Lock #1.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    PAST_CLIENT_SEND_EQUITY_DIGEST: {
        slug: "past-client:send-equity-digest",
        label: "Past-client equity digest send",
        description: "The Oven receiver — POST /api/past-clients/[leadId]/send-equity-digest per-caller credential. Authorizes ad-hoc equity-digest send to an Oven past client; ≥25-day cooldown enforced server-side (lead-profile 1-click action). Granted to Rello per Q4.1 lock + Q4.5 Lock #1.",
        validatedBy: ["the-oven"],
        grantedTo: [],
    },
    PAST_CLIENT_SEND_HUB_INVITE: {
        slug: "past-client:send-hub-invite",
        label: "Past-client hub invite",
        description: "The Oven receiver — POST /api/past-clients/[leadId]/send-hub-invite per-caller credential. Authorizes HubInvite send via NS journey enrollment for an Oven past client (lead-profile 1-click action). Granted to Rello per Q4.1 lock + Q4.5 Lock #1.",
        validatedBy: ["the-oven"],
        grantedTo: [],
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
    OVEN_SERVICE_PROVIDERS_READ: {
        slug: "oven:service-providers-read",
        label: "Read Service Providers from The Oven",
        description: "Home Scout → The Oven GET /api/service-providers?tenantId=<id> per-caller credential. Returns the tenant's active ServiceProvider rows (id, name, category, phone, website, description) ordered by sortOrder then name for the Homeowner Hub trusted-providers panel. Agent-curated, tenant-scoped, read-only over the S2S seam. HHUB Round 2a W3 (Service Providers) — mints/extends the HS → Oven Hub direction. Validated by The Oven's requireServiceBearer.",
        validatedBy: ["the-oven"],
        grantedTo: ["home-scout"],
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
    // ─── Rewards platform-config sync (Rello → Home Stretch) ──────────────────
    // Per PA-CLOSEOUT-Q37 + ANSWERS Q3.7 §5 (locked 2026-05-12) — per-purpose
    // slug for the rewards sync surface, NOT reusing HOME_STRETCH_PLATFORM_SYNC
    // umbrella. Reasoning: per-purpose granularity gives separate lastUsedAt
    // attribution, per-purpose revocation without blast-radius, and a separate
    // audit trail vs articles. Articles' use of the umbrella platform-sync
    // slug is a prior naming compromise — this slug does not propagate it.
    //
    // Surface: Rello POST /api/admin/apps/[slug]/rewards/sync (sender) →
    // HS POST /api/admin/rewards/platform (receiver, requireServiceBearer
    // permission gate). Receiver writes the singleton PlatformRewardsConfig
    // row. Per-tenant overrides via TenantAppConfig.rewardsEnabled +
    // rewardTiers continue to win over this platform default.
    HOME_STRETCH_REWARDS_SYNC: {
        slug: "home-stretch:rewards-sync",
        label: "Sync rewards platform-default to Home Stretch",
        description: "Rello → Home Stretch POST /api/admin/rewards/platform per-caller credential. Rello platform admin pushes platform-default rewards config (PlatformRewardsConfig singleton: rewardsEnabled + rewardTiers) to HS. Per-tenant TenantAppConfig overrides still win; this is the platform-default fallback layer in HS's 3-layer coalesce (TenantAppConfig → PlatformRewardsConfig → DEFAULT_REWARD_TIERS). Per-purpose slug per Q3.7 §5 lock — distinct from HOME_STRETCH_PLATFORM_SYNC umbrella. Validated by HS's requireServiceBearer.",
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
    // ─── Notifications (Rello → spoke admin notification-settings, NA-080 pattern) ───
    // Rello platform admin proxies tenant notification-settings reads/writes to
    // the spoke app that owns the cron-send cascade (e.g. Home Ready, Home
    // Stretch). The spoke validates the inbound Bearer via its `requireService
    // Bearer` against Rello's central `ApiKey` table; this scope is the narrow
    // grant on the `(appSource=RELLO, targetApp=<SPOKE>)` ApiKey row. Bundle
    // dispatch: PA-CLOSEOUT-RULEI-003-NOTIFICATIONS-NA-080-BUNDLE retires the
    // legacy shared-secret `HOME_READY_CRON_SECRET` fallback on the Rello
    // outbound call site. Pattern reference: NA-080 (HH outbound auth Bearer
    // cutover) per ~/Rello/CLAUDE.md §92-95.
    NOTIFICATIONS_READ: {
        slug: "notifications:read",
        label: "Read notification settings",
        description: "Read per-tenant notification settings (cron schedules, send windows, channel toggles, role audiences) on a spoke that owns the cron-send cascade. Validated by the spoke's requireServiceBearer (Path A: Bearer rello_*).",
        validatedBy: [],
        grantedTo: [],
    },
    NOTIFICATIONS_WRITE: {
        slug: "notifications:write",
        label: "Write notification settings",
        description: "Update per-tenant notification settings (cron schedules, send windows, channel toggles, role audiences) on a spoke that owns the cron-send cascade. Validated by the spoke's requireServiceBearer (Path A: Bearer rello_*). Initial caller: Rello platform-admin proxy at /api/admin/apps/[slug]/notifications → spoke /api/admin/notification-settings.",
        validatedBy: [],
        grantedTo: [],
    },
    // ─── In-app notification creation (Spoke → Rello, inter-app receiver) ─────
    // Distinct from notifications:read / notifications:write above (Rello →
    // spoke notification-SETTINGS proxying): this is the inverse direction —
    // a spoke creating an in-app Notification ROW for an agent inside Rello's
    // bell/beacon surfaces. Receiver: Rello POST /api/v1/notifications
    // (src/app/api/v1/notifications/route.ts) — requireV1Auth + Zod-strict
    // body + agentId→User existence check + internal sendNotification()
    // dispatcher (coalesceKey same-day idempotency via the partial unique
    // index). Per DISCOVERED-PLATFORM-RELLO-NOTIFICATIONS-INTER-APP-ENDPOINT-
    // MISSING-20260508 + cross-repo walk wave-4b locked endpoint contract
    // (2026-06-10). Initial caller: Harvest Home discovery saved-search alerts
    // (LeadAlert.inAppNotifiedAt flip); future: property-watch / call-list
    // reminders as they launch.
    NOTIFICATIONS_CREATE: {
        slug: "notifications:create",
        label: "Create in-app notification",
        description: "Rello receiver — POST /api/v1/notifications (src/app/api/v1/notifications/route.ts). Spoke → Rello service-to-service creation of an in-app Notification row for an agent (bell/beacon), routed through Rello's internal sendNotification() dispatcher with coalesceKey same-day idempotency. Kept narrow so a compromised key cannot read or mutate leads, settings, or other notification state. Validated by Rello's validateApiKey via requireV1Auth (Path A: Bearer rello_*). Initial caller: Harvest Home saved-search alert in-app delivery.",
        validatedBy: ["rello"],
        grantedTo: [],
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
    // ─── Partnership write (Pathfinder Pro → Rello, SPEC-PFP-MLO-EVENTS) ──────
    // Per PFP ANSWERS Q4.9 lock (2026-05-12) + SPEC-PFP-MLO-EVENTS Hard Prereq
    // #3 — Pathfinder Pro's MLO Events surface classifies attendees as LEAD /
    // AGENT_PARTNER / UNCLASSIFIED. AGENT_PARTNER attendees route to Rello's
    // Partnership surface via the `agent_partner.*` signal family (signal emit
    // from PFP → Rello signal-router). This slug gates the PFP-side ApiKey row
    // that carries the partnership write scope on the (appSource=PATHFINDER_PRO,
    // targetApp=RELLO) direction; Rello-side receiver validates via
    // validateApiKey (Path A: Bearer rello_*). RESPA-discipline for
    // AGENT_PARTNER follow-up is enforced at the Rello Partnership surface,
    // not at this slug grant. Per Q4.9 Part 2 + AOM line 591 OHH-disclaims-MLO-
    // events carve-out — PFP is the canonical owner of MLO-led event capture
    // (`MloEvent` + `MloEventAttendee`); partnership write is the
    // attendee-classification handoff into Rello's canonical Partnership home.
    PARTNERSHIP_WRITE: {
        slug: "partnership:write",
        label: "Write partnership signal (agent_partner.*)",
        description: "Pathfinder Pro → Rello partnership signal emit per-caller credential. Pathfinder Pro's MLO Events surface (per SPEC-PFP-MLO-EVENTS Hard Prereq #3) classifies attendees and routes AGENT_PARTNER attendees to Rello's canonical Partnership surface via the agent_partner.* signal family. Validated by Rello's validateApiKey (Path A: Bearer rello_*). Per PFP ANSWERS Q4.9 lock 2026-05-12 + AOM line 591 OHH-disclaims-MLO-events carve-out — PFP is canonical owner of MLO-led event capture; this slug is the attendee-classification handoff into Rello's Partnership home.",
        validatedBy: ["rello"],
        grantedTo: ["pathfinder-pro"],
    },
    // ─── Credit pull soft (Pathfinder Pro → Rello, SPEC-PFP-CREDIT-PULL-DECISION) ──
    // Per PFP ANSWERS Q4.8 lock (2026-05-12) — Pathfinder Pro is the canonical
    // owner of the credit-data domain (tri-merge soft-pull aggregator
    // chokepoint per `feedback-vendor-key-chokepoint-per-data-domain`). PFP
    // ships `CreditProvider` interface + `MockProvider` registry entry
    // pre-launch; live vendor activation is a single Railway env-var write
    // post-launch (zero code change per Q4.8 chokepoint activation path).
    //
    // Scope: SOFT credit-pull only. Hard-pull at LOS export is a separate
    // post-launch slug (Q4.8 hard-pull deferral). Per Q4.8 lock #8 — future
    // cross-app credit-pull consumers (Harvest Home refi-prospect
    // score-validate, The Drumbeat refi-trigger eligibility, Home Stretch
    // post-launch use-cases) consume via this slug on their (appSource=<SPOKE>,
    // targetApp=PATHFINDER_PRO) ApiKey row. Pre-launch grant is PFP-internal
    // only; cross-app callers grant added at post-launch consumer cutover.
    //
    // Surface: PFP-owned credit-pull endpoint (soft-pull at intake per
    // SPEC-PFP-CREDIT-PULL-DECISION). Validated by PFP's requireServiceBearer
    // (Path A: Bearer rello_*; SHA-256 hash match advances ApiKey.lastUsedAt;
    // per-pair appSource/targetApp isolation enforced).
    CREDIT_PULL_SOFT: {
        slug: "credit:pull-soft",
        label: "Credit pull (soft)",
        description: "Cross-app soft credit-pull consumer scope per PFP ANSWERS Q4.8 lock 2026-05-12 (lock #8). Pathfinder Pro is canonical owner of credit-data domain (tri-merge soft-pull aggregator chokepoint). Soft-pull only — hard-pull at LOS export is a separate post-launch slug. Pre-launch is PFP-internal (PFP's MockProvider registry; no cross-app callers granted yet); post-launch cross-app consumers (Harvest Home refi-prospect score-validate, The Drumbeat refi-trigger eligibility, Home Stretch use-cases) carry this slug on (appSource=<SPOKE>, targetApp=PATHFINDER_PRO) ApiKey rows. Validated by Pathfinder Pro's requireServiceBearer (Path A: Bearer rello_*).",
        validatedBy: ["pathfinder-pro"],
        grantedTo: [],
    },
    // ─── Past borrowers cross-app read (Drumbeat → PFP, SPEC-PFP-PAST-BORROWERS-CANONICAL) ──
    // Per PFP ANSWERS Q4.5 + Q4.8 + D20 close 2026-05-13: PFP is the canonical
    // owner of the past-borrower domain (Pipeline.status = "CLOSED" rows +
    // computed refi-scoring). PFP exposes GET /api/v1/past-borrowers; Drumbeat
    // consumes after retiring its local `RefinanceCandidate` model +
    // `mlo-refi-analyzer` cron + migrating /settings/mlo/refi UI per Rule K
    // rewrite-not-delete (D13-amended 2026-05-13).
    //
    // Surface: PFP GET /api/v1/past-borrowers (and future scoped variants).
    // Validated by PFP's requireServiceBearer (Path A: Bearer rello_*; SHA-256
    // hash match advances ApiKey.lastUsedAt; per-pair appSource/targetApp
    // isolation enforced). Pre-launch grantedTo = ["the-drumbeat"] (first
    // consumer per D13-amended). Newsletter Studio + Content Engine + Home
    // Stretch + future cross-app consumers add via separate per-consumer
    // permission-append micro-dispatches as their consumer surfaces ship —
    // mirrors CREDIT_PULL_SOFT's "grantedTo grows per-consumer" pattern.
    PAST_BORROWERS_READ: {
        slug: "past-borrowers:read",
        label: "Read past-borrower domain (PFP-canonical)",
        description: "Cross-app read access to PFP-canonical past-borrower domain (Pipeline.status = CLOSED rows + computed refi-scoring helper). First consumer: The Drumbeat /settings/mlo/refi surface per D13-amended SPEC-DRUM-PFP-REFI-CONSUMER 2026-05-13. PFP retires Drumbeat's local RefinanceCandidate model + mlo-refi-analyzer cron + migrates UI to fetch from PFP. Per PFP ANSWERS Q4.5/Q4.8 + AOM PFP MLO-workstation lock + D20 PFP-canonical past-borrower domain ownership. Validated by PFP's requireServiceBearer. Future consumers (Newsletter Studio + Content Engine + Home Stretch) granted via separate per-consumer ApiKey row provisioning.",
        validatedBy: ["pathfinder-pro"],
        grantedTo: ["the-drumbeat"],
    },
    // ─── PFP receiver webhook delivery (Rello router → PFP, MLO-EVENTS hop-2) ──
    // Per BPB §9.2 router-to-spoke outbound webhook delivery topology #3 — Rello
    // signal router holds an ApiKey targeting PFP for the canonical hop-2 path
    // when MLO-Events / partnership.* / past-borrowers.* signals delivered to PFP
    // need to traverse Rello's router rather than direct emit. Replaces the
    // placeholder `webhooks:deliver` slug on the D4 row 11 RELLO → PATHFINDER_PRO
    // ApiKey row per DISCOVERED-PFP-SPEC-MLO-EVENTS-HOP-2-KEY-TOPOLOGY-DRIFT-
    // 2026-05-13 disposition.
    //
    // Topology #3 (per BPB §9.2): caller = Rello router; receiver = PFP. PFP
    // validates the slug at its inbound webhook receiver via requireServiceBearer
    // (Path A). Rello holds the slug on its (appSource=RELLO, targetApp=
    // PATHFINDER_PRO) ApiKey row.
    PFP_RECEIVER_WEBHOOK: {
        slug: "pfp-receiver:webhook",
        label: "Deliver outbound webhook to PFP receiver",
        description: "Rello router → PFP /api/webhooks/rello (or per-event-family path) outbound webhook delivery per BPB §9.2 topology #3. Held by Rello on (appSource=RELLO, targetApp=PATHFINDER_PRO) ApiKey row; validated by PFP's requireServiceBearer at receiver. Replaces placeholder webhooks:deliver per DISCOVERED-PFP-SPEC-MLO-EVENTS-HOP-2-KEY-TOPOLOGY-DRIFT-2026-05-13 disposition. Anchors the canonical hop-2 router path when MLO-Events / partnership.* / past-borrowers.* signals routed through Rello before delivery to PFP.",
        validatedBy: ["pathfinder-pro"],
        grantedTo: ["rello"],
    },
    // ─── Effective rate sheets cross-app read (Rello → PFP, MLO Rate Sheet Ingestion) ──
    // Per D1 lock 2026-05-13 + APP-OWNERSHIP-MATRIX:321: PFP is the canonical
    // owner of AgentRateSheet ingestion (MLO uploads daily rate-sheet PDFs to PFP;
    // PFP parses, validates, and exposes CONFIRMED + non-expired + broadcasting
    // rows per rateType). Rello's TodaysRates widget consumes via cross-app
    // Bearer to render the freshest effective rate per rateType on the spoke
    // dashboard (MLO-tier tenants only per D3 lock — gate via TenantApp WHERE
    // app.slug = 'pathfinder-pro' AND isEnabled = true).
    //
    // Surface: PFP GET /api/tenants/[tenantId]/rate-sheets/effective. Validated
    // by PFP's requireServiceBearer (Path A: Bearer rello_*; SHA-256 hash match
    // advances ApiKey.lastUsedAt; per-pair appSource/targetApp isolation
    // enforced). Topology #3 (Spoke-validated, Rello-granted) per API-KEY-
    // LIFECYCLE-README §2 — sibling to pfp-intake-from-spoke:write and
    // credit:pull-soft.
    RATE_SHEETS_READ: {
        slug: "rate-sheets:read",
        label: "Read effective rate sheets",
        description: "Rello → Pathfinder Pro GET /api/tenants/[tenantId]/rate-sheets/effective per-caller credential. Used by Rello's TodaysRates widget cross-app fetch (MLO-tier tenants per D3 lock — gate via TenantApp WHERE app.slug = 'pathfinder-pro' AND isEnabled = true) to read the freshest CONFIRMED + non-expired + broadcasting AgentRateSheet per rateType. PFP is canonical owner of AgentRateSheet ingestion per APP-OWNERSHIP-MATRIX:321 + D1 lock 2026-05-13. Receiver validates via requireServiceBearer (Path A: Bearer rello_*). Topology #3 (Spoke-validated, Rello-granted) per API-KEY-LIFECYCLE-README §2 — sibling to pfp-intake-from-spoke:write and credit:pull-soft.",
        validatedBy: ["pathfinder-pro"],
        grantedTo: ["rello"],
    },
    // ─── Effective rates cross-app read (HS → Rello aggregator, MLO Rate Sheet Ingestion Track B) ──
    // Inverse direction sibling to RATE_SHEETS_READ. Rello is the canonical
    // cross-tenant aggregator of effective per-rateType rates (resolves the
    // PFP AgentRateSheet → FRED fallback cascade per ANSWERS.md B-03 / B-05,
    // applies business-day-aware freshness per B-04, enforces D3 entitlement
    // gate via TenantApp WHERE app.slug = 'pathfinder-pro' AND isEnabled = true
    // — when unmet, response shape is preserved with every row source:
    // "fred_fallback" rather than 404'ing). HS's embed/rates widget consumes
    // via cross-app Bearer to render disclosure-adjacent rates (D5 disclosure
    // invariant per ANSWERS.md:95-108 — every EffectiveRate row carries
    // TILA-compliant disclosureText for its source).
    //
    // Surface: Rello GET /api/tenants/[tenantId]/rates/effective. Validated by
    // Rello's validateEngineAuth / validateApiKey path (Path A: Bearer rello_*;
    // SHA-256 hash match advances ApiKey.lastUsedAt; per-pair
    // appSource/targetApp isolation enforced — appSource=THE_HOME_SCOUT,
    // targetApp=RELLO). Topology #1 (Rello-validated, Rello-granted) per
    // API-KEY-LIFECYCLE-README §2 — sibling to compliance:phrase-rules:read +
    // compliance:scan-rules:read.
    RATES_EFFECTIVE_READ: {
        slug: "rates-effective:read",
        label: "Read Rello-aggregated effective rates",
        description: "HS → Rello GET /api/tenants/[tenantId]/rates/effective per-caller credential. Used by The-Home-Scout's embed/rates widget cross-app fetch to render the freshest per-rateType effective rate (PFP AgentRateSheet cascade → FRED fallback per ANSWERS.md B-03/B-04/B-05; D3 entitlement gate per ANSWERS.md:45-47 — non-MLO tenants receive response shape with source:\"fred_fallback\" rows, not 404; D5 disclosure invariant per ANSWERS.md:95-108 — every row carries disclosureText). Rello is canonical owner of the cross-tenant effective-rates aggregator per APP-OWNERSHIP-MATRIX + Track B 2026-05-13. Receiver validates via validateEngineAuth (Path A: Bearer rello_*). Topology #1 (Rello-validated, Rello-granted) per API-KEY-LIFECYCLE-README §2 — sibling to compliance:phrase-rules:read.",
        validatedBy: ["rello"],
        grantedTo: ["home-scout"],
    },
    // ─── Compliance phrase-rules cross-app read (PFP + Drumbeat → Rello, SPEC-PFP-MLO-COMPLIANCE-GATES + SPEC-DRUM-MLO-COMPLIANCE-GATES) ──
    // Per SPEC-PFP-MLO-COMPLIANCE-GATES B-02 + Drumbeat sibling SPEC: Rello owns
    // the canonical FairLendingPhraseRule registry (versioned phrase-library
    // with regulator-pinned version + effectiveAt + supersededAt). PFP +
    // Drumbeat consumers read the registry via cross-app Bearer to apply phrase
    // matching at compliance-scan time.
    //
    // Surface: Rello GET /api/v1/compliance/phrase-rules (and future scoped
    // variants). Validated by Rello's validateApiKey (Path A: Bearer rello_*;
    // SHA-256 hash match advances ApiKey.lastUsedAt; per-pair appSource/targetApp
    // isolation enforced). Pre-launch grantedTo = ["pathfinder-pro", "the-drumbeat"]
    // (both compliance consumers per their MLO-COMPLIANCE-GATES SPECs).
    COMPLIANCE_PHRASE_RULES_READ: {
        slug: "compliance:phrase-rules:read",
        label: "Read Rello FairLendingPhraseRule registry (versioned phrase-library)",
        description: "Cross-app read access to Rello-canonical FairLendingPhraseRule registry. Consumers: PFP MLO Compliance Gates scan path + Drumbeat MLO Compliance Gates scan path. Both apply Rello-canonical phrase rules at compliance-scan time. Per SPEC-PFP-MLO-COMPLIANCE-GATES B-02 + SPEC-DRUM-MLO-COMPLIANCE-GATES B-02. Versioned per regulator-change; consumers receive effectiveAt + supersededAt for caller-side cache-bust. Validated by Rello's validateApiKey.",
        validatedBy: ["rello"],
        grantedTo: ["pathfinder-pro", "the-drumbeat"],
    },
    // ─── Compliance scan-rules cross-app read (PFP + Drumbeat → Rello) ──
    // Companion to COMPLIANCE_PHRASE_RULES_READ. Rello owns the canonical
    // ComplianceScanRule registry (per-rule type → severity + remediation
    // suggestion mapping). PFP + Drumbeat consumers read at scan time.
    //
    // Surface: Rello GET /api/v1/compliance/scan-rules. Validated by Rello's
    // validateApiKey. Pre-launch grantedTo = ["pathfinder-pro", "the-drumbeat"].
    COMPLIANCE_SCAN_RULES_READ: {
        slug: "compliance:scan-rules:read",
        label: "Read Rello ComplianceScanRule registry (severity + remediation mapping)",
        description: "Cross-app read access to Rello-canonical ComplianceScanRule registry. Consumers: PFP + Drumbeat MLO compliance scanners apply rule severity + remediation mapping at scan time. Per SPEC-PFP-MLO-COMPLIANCE-GATES B-02 + SPEC-DRUM-MLO-COMPLIANCE-GATES B-02. Validated by Rello's validateApiKey.",
        validatedBy: ["rello"],
        grantedTo: ["pathfinder-pro", "the-drumbeat"],
    },
    // ─── Cross-app tenant + agents bootstrap fetch (SPEC OVEN-PATH-B-LAZY-PROVISION-RECEIVER-SELF-HEALING) ──
    // Receiver-side defense-in-depth: when an Oven webhook references an
    // unprovisioned tenant, Oven calls Rello GET
    // /api/provisioning/tenant/[tenantId]/lazy-bootstrap to fetch the canonical
    // tenant + agents payload (same shape POST /api/provisioning/tenant ships),
    // upserts the Tenant + triggering agent inline, and queues remaining agents
    // for async backfill. Eliminates the "Pattern A 409 cascade until
    // provisioning catches up" failure class per the parent recon
    // CROSS-SPOKE-LEAD-UPDATED-403-CASCADE §3.2 (2786 FAILED 409 deliveries
    // over 16h13m).
    //
    // Surface: Rello GET /api/provisioning/tenant/[tenantId]/lazy-bootstrap.
    // Validated by Rello's validateApiKey + hasPermission gate. Pre-launch
    // grantedTo = ["the-oven"] (Phase 1 of the build). Sibling Pattern A-gated
    // spokes can be added to grantedTo when Path B extends to them per spec
    // Follow-ups §3.
    TENANTS_BOOTSTRAP_READ: {
        slug: "tenants:bootstrap-read",
        label: "Read tenant + agents bootstrap payload for receiver-side lazy-provision",
        description: "Spoke → Rello GET /api/provisioning/tenant/[tenantId]/lazy-bootstrap per-caller credential. Used by receiver-side lazy-provision flows (Oven Path B today; sibling Pattern A-gated spokes per spec Follow-ups §3) to fetch the canonical tenantEnablePayloadSchema-shaped { tenant, agents } payload — identical to what POST /api/provisioning/tenant ships — so spokes can self-heal an unprovisioned-Tenant first-delivery race instead of returning 409 TENANT_NOT_READY. Per SPEC-OVEN-PATH-B-LAZY-PROVISION-RECEIVER-SELF-HEALING (2026-05-18). Validated by Rello's validateApiKey (Path A: Bearer rello_*; SHA-256 hash match advances ApiKey.lastUsedAt; per-pair appSource/targetApp isolation enforced). Topology #1 (Rello-validated, Rello-granted) per API-KEY-LIFECYCLE-README §2.",
        validatedBy: ["rello"],
        grantedTo: ["the-oven"],
    },
    // ─── Auth — synthetic-session IdP grant (SPEC-RELLO-SYNTHETIC-SESSION-IDP-CAPABILITY-260610) ──
    // Phase 0a of the synthetic-session IdP capability build. Held by exactly ONE
    // revocable platform-service key (RELLO → RELLO). Mints a one-time, short-TTL
    // OAuthMagicLink for a designated isSyntheticTestUser so agent build-verification
    // + post-launch synthetic monitoring can issue a REAL session through the real
    // magic-link path. Gated by isSyntheticTestUser flag + Big Star test-tenant +
    // role ceiling. Validated by Rello's validateApiKey.
    AUTH_SYNTHETIC_LOGIN: {
        slug: "auth:synthetic-login",
        label: "Synthetic Session Login",
        description: "Mint a one-time, short-TTL OAuthMagicLink (ml_token) for a designated isSyntheticTestUser via POST /api/v1/auth/synthetic-session — the IdP synthetic-session grant for agent build-verification + post-launch synthetic monitoring. Held by exactly ONE revocable platform-service key (RELLO→RELLO). Issues a REAL session through the real magic-link path; gated by isSyntheticTestUser flag + Big Star test-tenant + role ceiling. SPEC-RELLO-SYNTHETIC-SESSION-IDP-CAPABILITY-260610.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    // ─── OHH seller-activity read (OHH-SHOWINGS P3 — HS ↔ OHH cross-spoke surface) ──
    // Per CONTRACT-SELLER-ACTIVITY-PAYLOAD-DRAFT-260610.md (LOCKED 2026-06-11,
    // countersigned by HOMEOWNER-PORTAL-COMPLETION KA) — Home Scout's homeowner
    // hub data-assembly reads the seller-activity aggregation (listing status +
    // showing totals + recent showings + buyer feedback + price positioning +
    // Smart Assistant recommendation) from Open House Hub for the seller-mode
    // hub render. One aggregation feeds two renders (hub + Report-Engine
    // showing-activity PDF). Mints the direction home-scout → open-house-hub.
    // Sibling pattern to OVEN_SERVICE_PROVIDERS_READ (HS → Oven Hub direction).
    OHH_SELLER_ACTIVITY_READ: {
        slug: "ohh:seller-activity-read",
        label: "Read seller activity from Open House Hub",
        description: "Home Scout → Open House Hub GET /api/seller-activity/[relloLeadId]?tenantId=<relloTenantId> per-caller credential. Returns the LOCKED SellerActivityPayload (listing + showing totals + recent showings capped 10 w/ brokerage-only attribution per AM-1 + feedback + pricePositioning + recommendation; onlineInterest always null from OHH per AM-3, HS merges locally) for the Homeowner Hub seller-mode render and the Report-Engine showing-activity PDF. Keyed by relloLeadId + relloTenantId because the consumer session is leadId-scoped. Per CONTRACT-SELLER-ACTIVITY-PAYLOAD-DRAFT-260610.md (OHH-SHOWINGS-AND-TOURS P3). Validated by Open House Hub's requireServiceBearer.",
        validatedBy: ["open-house-hub"],
        grantedTo: ["home-scout"],
    },
    // ─── OHH tours read (OHH-SHOWINGS P4 — buyer Tour Companion surface) ──
    // Per CONTRACT-TOUR-COMPANION-PAYLOAD-260611.md (LOCKED 2026-06-11, single-KA
    // contract per DL4) — Home Scout's consumer-hub Tour Companion sibling routes
    // read the buyer's tours list + per-tour companion payload from Open House
    // Hub. PRIVACY LOCK: Showing.accessInstructions (lockbox/entry details) is
    // agent-only and NEVER crosses this wire; other-party personal names never
    // appear. Same direction + key as OHH_SELLER_ACTIVITY_READ (appended to the
    // existing HOME_SCOUT → OPEN_HOUSE_HUB key, no new key minted).
    OHH_TOURS_READ: {
        slug: "ohh:tours-read",
        label: "Read buyer tours from Open House Hub",
        description: "Home Scout → Open House Hub GET /api/tours/by-lead/[relloLeadId]?tenantId=<relloTenantId> (GetBuyerToursResponse) and GET /api/tours/[tourId]/companion?tenantId=<relloTenantId>&relloLeadId=<relloLeadId> (GetTourCompanionResponse; relloLeadId must match the tour's buyer — fail-closed 404 on mismatch) per-caller credential for the buyer Tour Companion render. Showing.accessInstructions NEVER crosses this wire (agent-only); listingPrice in whole dollars at the edge; CONFIRMED maps to SCHEDULED. Per CONTRACT-TOUR-COMPANION-PAYLOAD-260611.md (OHH-SHOWINGS-AND-TOURS P4). Validated by Open House Hub's requireServiceBearer.",
        validatedBy: ["open-house-hub"],
        grantedTo: ["home-scout"],
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
