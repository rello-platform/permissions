// The canonical slug set is the universe every write-time validator and the
// ApiKey permissions CHECK enforce membership against. A slug a receiver gates
// on but the registry does not carry is a permission nobody can mint — the
// Milo outcome routes refused every post (403 refused_caller,
// missingPermission nurture-outcomes:write) on 2026-09-14 for exactly that
// reason. Pinned here so the registry and its derived set stay in agreement.
import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_PERMISSION_SLUGS, PERMISSIONS, SLUG_TO_KEY, isPermissionSlug } from "./index";

test("nurture-outcomes:write is a canonical slug (Milo /api/outcome + /api/outcome/delivered receiver gate)", () => {
  assert.ok(ALL_PERMISSION_SLUGS.includes("nurture-outcomes:write" as never), "missing from ALL_PERMISSION_SLUGS");
  assert.equal(PERMISSIONS.NURTURE_OUTCOMES_WRITE.slug, "nurture-outcomes:write");
  assert.deepEqual([...PERMISSIONS.NURTURE_OUTCOMES_WRITE.validatedBy], ["milo-engine"]);
  assert.equal(SLUG_TO_KEY["nurture-outcomes:write" as never], "NURTURE_OUTCOMES_WRITE");
  assert.equal(isPermissionSlug("nurture-outcomes:write"), true);
});

test("every registry entry's slug is in ALL_PERMISSION_SLUGS, and no slug is duplicated", () => {
  const slugs = Object.values(PERMISSIONS).map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug in PERMISSIONS");
  for (const s of slugs) assert.ok(ALL_PERMISSION_SLUGS.includes(s as never), `${s} not derived`);
});

// #425 (DISCOVERED-RELLO-HH-TYPED-PAIR-MIGRATION-MISSED-TAGS-WRITE-260522):
// tags:write was granted in production while the registry listed no holder.
// The active holders measured read-only on 2026-10-16 (public."ApiKey", isActive,
// unexpired, 'tags:write' = ANY(permissions)): 10 keys across these 9 appSources,
// every one targeting RELLO.
test("TAGS_WRITE.grantedTo lists every app that holds tags:write in production", () => {
  assert.deepEqual(
    [...PERMISSIONS.TAGS_WRITE.grantedTo].sort(),
    [
      "harvest-home",
      "home-ready",
      "home-scout",
      "home-stretch",
      "journey-engine",
      "market-intel",
      "newsletter-studio",
      "open-house-hub",
      "the-oven",
    ],
  );
});

// LICENSED-PROFESSIONAL-DIRECTORY slice 0 (Platform KA prompt 735): Property
// Engine's licensed-directory read routes gate on these three slugs, and Rello's
// existing RELLO → PROPERTY_ENGINE key carries them. licensed-mlos:read is
// declared now (consumed from slice 7) so the set is whole.
test("licensed-directory slugs are canonical, validated by property-engine, granted to rello", () => {
  const expected = {
    LICENSED_AGENTS_READ: "licensed-agents:read",
    LICENSED_MLOS_READ: "licensed-mlos:read",
    LICENSED_DIRECTORY_ADMIN: "licensed-directory:admin",
  } as const;
  for (const [key, slug] of Object.entries(expected)) {
    const def = (PERMISSIONS as Record<string, { slug: string; validatedBy: readonly string[]; grantedTo: readonly string[] }>)[key];
    assert.ok(def, `${key} missing from PERMISSIONS`);
    assert.equal(def.slug, slug);
    assert.deepEqual([...def.validatedBy], ["property-engine"]);
    assert.deepEqual([...def.grantedTo], ["rello"]);
    assert.ok(ALL_PERMISSION_SLUGS.includes(slug as never), `${slug} missing from ALL_PERMISSION_SLUGS`);
    assert.equal(SLUG_TO_KEY[slug as never], key);
    assert.equal(isPermissionSlug(slug), true);
  }
});

// GD rates.refreshed (Platform KA prompt 1026): PathfinderPro tells Rello a
// tenant's borrower-facing rates changed (POST /api/v1/rates/refreshed), and
// Rello fans it out to Home Scout as the `rates.refreshed` webhook event. Rello
// validates the slug; the PathfinderPro → Rello key carries it.
test("rates:refreshed is canonical, validated by rello, granted to pathfinder-pro", () => {
  const def = (PERMISSIONS as Record<string, { slug: string; validatedBy: readonly string[]; grantedTo: readonly string[] }>).RATES_REFRESHED;
  assert.ok(def, "RATES_REFRESHED missing from PERMISSIONS");
  assert.equal(def.slug, "rates:refreshed");
  assert.deepEqual([...def.validatedBy], ["rello"]);
  assert.deepEqual([...def.grantedTo], ["pathfinder-pro"]);
  assert.ok(ALL_PERMISSION_SLUGS.includes("rates:refreshed" as never), "rates:refreshed missing from ALL_PERMISSION_SLUGS");
  assert.equal(SLUG_TO_KEY["rates:refreshed" as never], "RATES_REFRESHED");
  assert.equal(isPermissionSlug("rates:refreshed"), true);
});
