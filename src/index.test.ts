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
