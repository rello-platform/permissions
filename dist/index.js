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
