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
import type { PlatformSlug } from "@rello-platform/slugs";
export interface PermissionDefinition {
    /** Wire-format slug as it appears on `ApiKey.permissions` and in receiver checks. */
    readonly slug: string;
    /** Short human-readable label for picker UI options. */
    readonly label: string;
    /** Sentence-form description shown in picker tooltips and minted-key audits. */
    readonly description: string;
    /**
     * Apps/engines that gate on this permission in their receiver code.
     * CI-derived (`scripts/regenerate-validatedby.ts`) — do not hand-edit.
     */
    readonly validatedBy: readonly PlatformSlug[];
    /**
     * Apps/engines whose currently-active `ApiKey` rows carry this permission.
     * Hand-authored from current `ApiKey` table state; refined post-publish
     * as Rello's picker UI surfaces grant patterns. v0.1.0 entries are `[]`
     * pending the picker UI work in a later phase of Doc A.
     */
    readonly grantedTo: readonly PlatformSlug[];
}
export declare const PERMISSIONS: {
    readonly LEADS_READ: {
        readonly slug: "leads:read";
        readonly label: "Read leads";
        readonly description: "Read lead records via `/api/leads/*` (sub-resources: emails, phones, custom-fields, etc.).";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly LEADS_WRITE: {
        readonly slug: "leads:write";
        readonly label: "Write leads";
        readonly description: "Create or update lead records via `/api/leads/*` (sub-resources: emails, phones, custom-fields, co-borrower, milo-insights, etc.).";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly LEADS_DELETE: {
        readonly slug: "leads:delete";
        readonly label: "Delete leads";
        readonly description: "Delete lead records via `/api/leads/*`.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly JOURNEYS_READ: {
        readonly slug: "journeys:read";
        readonly label: "Read journeys";
        readonly description: "Read journey definitions and enrollments.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly JOURNEYS_WRITE: {
        readonly slug: "journeys:write";
        readonly label: "Write journeys";
        readonly description: "Create or update journey definitions and enrollments.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly JOURNEYS_EXECUTE: {
        readonly slug: "journeys:execute";
        readonly label: "Execute journeys";
        readonly description: "Trigger journey execution steps.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly WEBHOOKS_READ: {
        readonly slug: "webhooks:read";
        readonly label: "Read webhooks";
        readonly description: "Read webhook subscription configuration.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly WEBHOOKS_WRITE: {
        readonly slug: "webhooks:write";
        readonly label: "Write webhooks";
        readonly description: "Create or update webhook subscriptions.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly WEBHOOKS_DELIVER: {
        readonly slug: "webhooks:deliver";
        readonly label: "Deliver outbound webhook";
        readonly description: "Rello → spoke outbound webhook delivery. Attached to per-spoke (appSource=RELLO, targetApp=<SPOKE>) keys; checked by the spoke's receiver after the Bearer hash matches. Replaces the HMAC signature pattern per DISCOVERED-WEBHOOK-SIGNATURE-HEADER-MISMATCH-042226.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly EVENTS_WRITE: {
        readonly slug: "events:write";
        readonly label: "Write events";
        readonly description: "Write events into Rello's event stream — used by spoke webhooks (Rello receives newsletter open/click/bounce/unsubscribe, drumbeat post events, etc.) and by Rello-internal callers.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly ENGINE_ACCESS: {
        readonly slug: "engine:access";
        readonly label: "Engine access";
        readonly description: "Allows a key to call platform-service engine endpoints (Milo, Property, Content, Report, Journey, Drumbeat Video). Required for any engine-cluster receiver per Auth-Fragmentation Phase 2.";
        readonly validatedBy: readonly ["milo-engine", "property-engine", "content-engine", "report-engine", "journey-engine", "drumbeat-video-engine"];
        readonly grantedTo: readonly [];
    };
    readonly NEWSLETTERS_SEND: {
        readonly slug: "newsletters:send";
        readonly label: "Send newsletter (per-recipient nurture)";
        readonly description: "Rello → NS dispatch via /api/newsletters/blueprint-send. Required for per-recipient nurture sends to flow through the centralized NS pipeline. Closed a SHAPE-01-class env-var Bearer compare per DISCOVERED-RELLO-NS-ENV-DRIFT-042426.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly NEWSLETTERS_SEND_LIFECYCLE: {
        readonly slug: "newsletters:send-lifecycle";
        readonly label: "Send lifecycle email (spoke-emitted)";
        readonly description: "Spoke → NS dispatch via /api/newsletters/lifecycle-send. Distinct from newsletters:send (Milo-curated nurture via blueprint-send) — this covers spoke-emitted lifecycle emails (MI subscribe-welcome first; HS/HR/OHH welcomes; PA-004 hot-rate-alert) that share the SendAttempt idempotency invariant but are token-substituted templates triggered by spoke events rather than nurture decision flow. Closes the LIFECYCLE_SEND_API_KEY env-var Bearer bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly PREVIEW_READ: {
        readonly slug: "preview:read";
        readonly label: "Read newsletter preview";
        readonly description: "Spoke → NS dispatch via /api/preview/blueprint and /api/preview/content-package. Render-only HTML preview surfaces — no Mailgun, no DB writes, no SendAttempt. Used by Harvest Home and other spokes to preview Milo-composed nurture emails before send. Closes the NS_APP_SECRET X-App-Secret env-var bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly LAB_SEND_TEST: {
        readonly slug: "lab:send-test";
        readonly label: "Send lab test newsletter";
        readonly description: "Spoke → NS dispatch via /api/lab/send-test. One-off test sends from the design lab with up to 10 recipients per request — creates a real NewsletterSend row so footer links resolve. Closes the NS_APP_SECRET X-App-Secret env-var bypass per CENTRALIZED-API-KEY-MIGRATION Phase 5b.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly TENANTS_VALIDATE: {
        readonly slug: "tenants:validate";
        readonly label: "Validate tenants";
        readonly description: "Cross-app tenant validation lookups.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly FLOWS_CREATE: {
        readonly slug: "flows:create";
        readonly label: "Create flow";
        readonly description: "NS receiver — POST /api/flows. Used by Rello → NS launchCampaign. Kept narrow so a compromised key cannot exfiltrate newsletters / messaging / contacts.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly FLOWS_MANAGE: {
        readonly slug: "flows:manage";
        readonly label: "Manage flow";
        readonly description: "NS receiver — GET/PUT/DELETE /api/flows/[id]. Used by Rello → NS launchCampaign + addLeadsToCampaign.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly FLOWS_SUBSCRIBE: {
        readonly slug: "flows:subscribe";
        readonly label: "Subscribe leads to flow";
        readonly description: "NS receiver — POST /api/flows/[id]/leads. Used by Rello → NS addLeadsToCampaign.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly FLOWS_READ_MILO_MANAGED: {
        readonly slug: "flows:read-milo-managed";
        readonly label: "Read Milo-managed flows";
        readonly description: "NS receiver — GET /api/flows/milo-managed/leads. Used by Rello to read enrollment state on Milo-managed flows during nurture decisions.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly ENGAGEMENT_READ: {
        readonly slug: "engagement:read";
        readonly label: "Read engagement";
        readonly description: "NS receiver — GET /api/leads/[id]/engagement. Used by Milo Engine and Rello to read NS-side engagement summaries (open/click history, last-engagement timestamps).";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly INJECTIONS_READ: {
        readonly slug: "injections:read";
        readonly label: "Read content injections";
        readonly description: "NS receiver — GET /api/injections/active. Used by Milo Engine and Rello to read the active content-injection rules NS will apply at compose time.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly SUBJECT_PREFERENCES_READ: {
        readonly slug: "subject-preferences:read";
        readonly label: "Read subject preferences";
        readonly description: "NS receiver — GET /api/internal/subject-preferences. Used by Milo Engine to read tenant-level subject-line generation preferences.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly SUPPRESSION_LIFT: {
        readonly slug: "suppression:lift";
        readonly label: "Lift suppression (NS receiver)";
        readonly description: "NS receiver — POST /api/webhooks/rello/suppression-lift. Used by Rello to confirm a re-opt-in has happened so NS can clear the local Suppression row.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly AGENTS_READ: {
        readonly slug: "agents:read";
        readonly label: "Read agents";
        readonly description: "Read agent profile / roster records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly AGENTS_WRITE: {
        readonly slug: "agents:write";
        readonly label: "Write agents";
        readonly description: "Create or update agent profile records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly ARTICLES_SYNC: {
        readonly slug: "articles:sync";
        readonly label: "Sync articles";
        readonly description: "Content Engine → Rello article sync ingest.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly MESSAGING_READ: {
        readonly slug: "messaging:read";
        readonly label: "Read messaging";
        readonly description: "Read SMS / message thread records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly MESSAGING_SEND: {
        readonly slug: "messaging:send";
        readonly label: "Send messaging";
        readonly description: "Send SMS / message via Rello's messaging path.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly MESSAGING_ADMIN: {
        readonly slug: "messaging:admin";
        readonly label: "Administer messaging";
        readonly description: "Administrative messaging operations (provider config, etc.).";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly CONVERSATIONS_READ: {
        readonly slug: "conversations:read";
        readonly label: "Read conversations";
        readonly description: "Read conversation thread records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly CONVERSATIONS_WRITE: {
        readonly slug: "conversations:write";
        readonly label: "Write conversations";
        readonly description: "Create or update conversation thread records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly CONVERSATIONS_CALL: {
        readonly slug: "conversations:call";
        readonly label: "Initiate calls";
        readonly description: "Initiate or update voice-call conversation records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly DOCUMENTS_READ: {
        readonly slug: "documents:read";
        readonly label: "Read documents";
        readonly description: "Read document/asset records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly DOCUMENTS_WRITE: {
        readonly slug: "documents:write";
        readonly label: "Write documents";
        readonly description: "Upload or update document/asset records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SIGNALS_WRITE: {
        readonly slug: "signals:write";
        readonly label: "Write signals";
        readonly description: "Spoke → Rello signal ingest via /api/signals/batch and /api/signals/ingest. Held by every spoke's outbound key.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly INTAKE_WRITE: {
        readonly slug: "intake:write";
        readonly label: "Write intake";
        readonly description: "Rello → Harvest Home /api/intake[/re-enrich[-batch]] per-caller credential. Replaces the shared INTAKE_APP_SECRET env var per NA-080 (Plan-A2). HH's requireIntakeBearer enforces this permission via createPlatformKeyValidator.";
        readonly validatedBy: readonly ["harvest-home"];
        readonly grantedTo: readonly [];
    };
    readonly PROVISIONING_WRITE: {
        readonly slug: "provisioning:write";
        readonly label: "Write provisioning";
        readonly description: "Rello → spoke per-spoke provisioning push (agent / tenant / template). Replaces the per-spoke RELLO_PROVISIONING_SECRET env-var compare. Held by per-spoke (appSource=RELLO, targetApp=<SPOKE>) keys; checked by each spoke's receiver after the Bearer hash matches.";
        readonly validatedBy: readonly ["newsletter-studio", "harvest-home", "home-ready", "home-stretch", "home-scout", "the-drumbeat", "open-house-hub", "the-oven", "market-intel", "pathfinder-pro"];
        readonly grantedTo: readonly [];
    };
    readonly ADMIN_INTERNAL: {
        readonly slug: "admin:internal";
        readonly label: "Internal admin operations";
        readonly description: "Rello → spoke /api/admin/* + /api/skip-trace/* + /api/leads/[id]/raw-import per-caller credential. M2M cron + scoring + BYOL admin + skip-trace ledger callers. Replaces RELLO_PROVISIONING_SECRET env-var compare for HH's 15 admin-gate routes per DISCOVERED-HH-ADMIN-AUTH-MIGRATION-043026 + parent audit Phase 5.4-B unblock.";
        readonly validatedBy: readonly ["harvest-home"];
        readonly grantedTo: readonly [];
    };
    readonly PARCEL_READ: {
        readonly slug: "parcel:read";
        readonly label: "Read parcel-graph";
        readonly description: "Property Engine receiver — GET /api/parcel-graph/by-lead/[leadId] and /api/parcel-graph/by-parcel/[parcelId]. Returns the joined Parcel + Mortgage + LeadProperty graph for a tenant-scoped lead. Held by Rello + Milo Engine outbound keys per the INVESTOR-PORTFOLIO-DATA-MODEL spec (Phase 2, Lock #7).";
        readonly validatedBy: readonly ["property-engine"];
        readonly grantedTo: readonly [];
    };
    readonly PARCEL_WRITE: {
        readonly slug: "parcel:write";
        readonly label: "Write parcel-graph";
        readonly description: "Property Engine receiver — POST /api/parcel-graph/upsert-from-byol, POST /api/parcel-graph/upsert-from-intake, DELETE /api/parcel-graph/lead-property/[id]. Used by Harvest Home BYOL+intake writers and Rello lead-deletion cleanup per the INVESTOR-PORTFOLIO-DATA-MODEL spec (Phase 2, Lock #7).";
        readonly validatedBy: readonly ["property-engine"];
        readonly grantedTo: readonly [];
    };
    readonly TAGS_READ: {
        readonly slug: "tags:read";
        readonly label: "Read tags";
        readonly description: "Read tag records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly TAGS_WRITE: {
        readonly slug: "tags:write";
        readonly label: "Write tags";
        readonly description: "Create or update tag records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly TAGS_DELETE: {
        readonly slug: "tags:delete";
        readonly label: "Delete tags";
        readonly description: "Delete tag records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly ROUTING_EVALUATE: {
        readonly slug: "routing:evaluate";
        readonly label: "Evaluate routing rules";
        readonly description: "Run lead-routing rule evaluation.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly ROUTING_READ: {
        readonly slug: "routing:read";
        readonly label: "Read routing rules";
        readonly description: "Read lead-routing rule definitions.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly POOLS_READ: {
        readonly slug: "pools:read";
        readonly label: "Read lead pools";
        readonly description: "Read lead-pool records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly POOLS_WRITE: {
        readonly slug: "pools:write";
        readonly label: "Write lead pools";
        readonly description: "Create or update lead-pool records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SEGMENTS_READ: {
        readonly slug: "segments:read";
        readonly label: "Read segments";
        readonly description: "Read saved-segment records via /api/segments and /api/segments/[id]. Used by NS targeting paths to enumerate Rello segments.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SEGMENTS_WRITE: {
        readonly slug: "segments:write";
        readonly label: "Write segments";
        readonly description: "Create, update, or delete saved-segment records.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SCORING_READ: {
        readonly slug: "scoring:read";
        readonly label: "Read scoring config";
        readonly description: "HomeReady scoring-engine receivers — GET /api/scoring/{config,dpa,guidelines,programs}. Phase 3 of Auth-Fragmentation.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SCORING_WRITE: {
        readonly slug: "scoring:write";
        readonly label: "Write scoring";
        readonly description: "HomeReady scoring-engine receivers — POST /api/scoring/{calculate,live-updates}. Phase 3 of Auth-Fragmentation.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly REPORTS_WRITE: {
        readonly slug: "reports:write";
        readonly label: "Write reports";
        readonly description: "Spoke → Rello daily report ingest via /api/reports/ingest.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly APP_SCORES_WRITE: {
        readonly slug: "app-scores:write";
        readonly label: "Write app scores";
        readonly description: "Spoke → Rello per-lead score ingest via /api/leads/[id]/app-scores.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly DAILY_REPORT_READ: {
        readonly slug: "daily-report:read";
        readonly label: "Read daily report (pull-summary receiver)";
        readonly description: "Rello app-daily-report-orchestrator → spoke outbound — GET /api/summary/daily?tenantId=&date= returns the day's tenant-scoped activity summary. Pull direction (Rello calls spoke); distinct from reports:write which is the legacy push direction (spoke calls Rello). Held by Rello's outbound key per DISCOVERED-PLATFORM-DAILY-REPORT-ORCHESTRATOR-GAP-042926; first validator is home-scout per DISCOVERED-PLATFORM-MILO-SERVICE-KEY-DISTRIBUTION-GAP-042926.";
        readonly validatedBy: readonly ["home-scout"];
        readonly grantedTo: readonly [];
    };
    readonly CTA_REGISTRY_READ: {
        readonly slug: "cta-registry:read";
        readonly label: "Read CTA registry definitions";
        readonly description: "Milo Engine → Scout outbound — GET /api/cta-registry/definitions returns effective CTAs for a (tenantId, agentId) pair via cascade resolution. Used by Milo's blueprint composer when picking outbound CTAs for newsletter sections.";
        readonly validatedBy: readonly ["home-scout"];
        readonly grantedTo: readonly [];
    };
    readonly CTA_REGISTRY_WRITE: {
        readonly slug: "cta-registry:write";
        readonly label: "Write CTA registry impressions";
        readonly description: "Milo Engine → Scout outbound — POST /api/cta-registry/impression increments impression counters on Scout's CtaDefinition records. Fire-and-forget after blueprint assembly; CTR data feeds Milo's selection scoring.";
        readonly validatedBy: readonly ["home-scout"];
        readonly grantedTo: readonly [];
    };
    readonly SURVEY_GATE_WRITE: {
        readonly slug: "survey-gate:write";
        readonly label: "Write survey-gate pending question";
        readonly description: "Milo Engine → Scout outbound — POST /api/survey-gate/pending-question creates a PENDING question request for a lead, injected into the lead's next tool survey flow by Scout's SurveyGate component.";
        readonly validatedBy: readonly ["home-scout"];
        readonly grantedTo: readonly [];
    };
    readonly SOCIAL_READ: {
        readonly slug: "social:read";
        readonly label: "Read social credentials";
        readonly description: "Drumbeat runtime OAuth credential fetch via /api/admin/integrations/social-credentials.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly REOPT_IN_DISPATCH: {
        readonly slug: "reopt-in:dispatch";
        readonly label: "Dispatch re-opt-in";
        readonly description: "Rello → NS outbound permission allowing the complianceExempt: true body flag on blueprint-send. Without it, NS ignores the flag (fail-safe).";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
    readonly REOPT_IN_CONFIRM: {
        readonly slug: "reopt-in:confirm";
        readonly label: "Confirm re-opt-in";
        readonly description: "NS → Rello inbound permission for POST /api/reopt-in/confirm.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly REOPT_IN_LOOKUP: {
        readonly slug: "reopt-in:lookup";
        readonly label: "Lookup re-opt-in";
        readonly description: "NS → Rello inbound permission for GET /api/reopt-in/lookup.";
        readonly validatedBy: readonly ["rello"];
        readonly grantedTo: readonly [];
    };
    readonly SUPPRESSION_LIFT_WRITE: {
        readonly slug: "suppression-lift:write";
        readonly label: "Write suppression-lift webhook";
        readonly description: "Rello → NS outbound permission for POST /api/webhooks/rello/suppression-lift. Different from suppression:lift — that's NS's receiver permission; this is the slug Rello's outbound key holds to call it. Distinct slugs preserved per Phase 1 inventory.";
        readonly validatedBy: readonly ["newsletter-studio"];
        readonly grantedTo: readonly [];
    };
};
/** Compile-time-checked permission key (e.g., `"NEWSLETTERS_SEND"`). */
export type PermissionKey = keyof typeof PERMISSIONS;
/** Compile-time-checked permission slug (e.g., `"newsletters:send"`). */
export type PermissionSlug = (typeof PERMISSIONS)[PermissionKey]["slug"];
/**
 * Frozen list of every canonical permission slug — the universe a write-time
 * validator or DB CHECK constraint can enforce membership against.
 */
export declare const ALL_PERMISSION_SLUGS: readonly PermissionSlug[];
export declare const SLUG_TO_KEY: Readonly<Record<PermissionSlug, PermissionKey>>;
/**
 * Type guard for runtime validation at decoding boundaries.
 *
 * Uses `Object.prototype.hasOwnProperty.call` against the null-prototype
 * `SLUG_TO_KEY` map — both layers are required to defend against untrusted
 * lookup keys that might match prototype-chain inherited names.
 */
export declare function isPermissionSlug(value: string): value is PermissionSlug;
//# sourceMappingURL=index.d.ts.map