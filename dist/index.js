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
    // ─── Leads / contacts ─────────────────────────────────────────────────────
    CONTACTS_READ: {
        slug: "contacts:read",
        label: "Read contacts",
        description: "Read lead/contact records via /api/contacts and related read paths.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CONTACTS_WRITE: {
        slug: "contacts:write",
        label: "Write contacts",
        description: "Create or update lead/contact records via /api/contacts.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    CONTACTS_DELETE: {
        slug: "contacts:delete",
        label: "Delete contacts",
        description: "Delete lead/contact records via /api/contacts.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    LEADS_READ: {
        slug: "leads:read",
        label: "Read leads",
        description: "Read lead records via /api/leads and related read paths.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    LEADS_WRITE: {
        slug: "leads:write",
        label: "Write leads",
        description: "Create or update lead records via /api/leads.",
        validatedBy: ["rello"],
        grantedTo: [],
    },
    LEADS_DELETE: {
        slug: "leads:delete",
        label: "Delete leads",
        description: "Delete lead records via /api/leads.",
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
