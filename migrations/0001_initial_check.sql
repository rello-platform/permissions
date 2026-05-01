-- migrations/0001_initial_check.sql
--
-- Postgres CHECK constraint enforcing canonical-membership on `ApiKey.permissions`.
-- Generated against the v0.1.0 canonical set (sourced verbatim from
-- @rello-platform/api-client@v1.10.1's hand-authored permissions registry).
--
-- IMPORTANT — DRAFT ONLY for v0.1.0. NOT applied to production Neon by this
-- package's bootstrap. Application is gated on:
--   1. Pre-application SQL scrub of every active ApiKey row's `permissions`
--      array — strip non-canonical strings so the CHECK doesn't fail
--      retroactively on rows minted under the pre-canonical write path.
--   2. Validation that every spoke's outbound key carries only canonical
--      slugs (snapshot table + verification SELECT before applying).
--
-- See PERMISSIONS-CANONICALIZATION.md (Doc A) Phase 6 sub-step 6.1 + 6.3 for
-- the full apply ordering.
--
-- Rollback:
--   ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_permissions_canonical_check";
--
-- Future versions of this package will ship updated migrations under
-- migrations/000N_apply_check_constraint.sql when canonical entries are
-- added or removed; consumer Rello ingests the latest by running it via
-- `psql $DATABASE_URL -f migrations/<filename>.sql`.

ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_permissions_canonical_check"
  CHECK (
    permissions <@ ARRAY[
      'leads:read',
      'leads:write',
      'leads:delete',
      'journeys:read',
      'journeys:write',
      'journeys:execute',
      'webhooks:read',
      'webhooks:write',
      'webhooks:deliver',
      'events:write',
      'engine:access',
      'newsletters:send',
      'tenants:validate',
      'flows:create',
      'flows:manage',
      'flows:subscribe',
      'flows:read-milo-managed',
      'engagement:read',
      'injections:read',
      'subject-preferences:read',
      'suppression:lift',
      'agents:read',
      'agents:write',
      'articles:sync',
      'messaging:read',
      'messaging:send',
      'messaging:admin',
      'conversations:read',
      'conversations:write',
      'conversations:call',
      'documents:read',
      'documents:write',
      'signals:write',
      'intake:write',
      'tags:read',
      'tags:write',
      'tags:delete',
      'routing:evaluate',
      'routing:read',
      'pools:read',
      'pools:write',
      'segments:read',
      'segments:write',
      'scoring:read',
      'scoring:write',
      'reports:write',
      'app-scores:write',
      'social:read',
      'reopt-in:dispatch',
      'reopt-in:confirm',
      'reopt-in:lookup',
      'suppression-lift:write',
      '*'
    ]::text[]
  );
