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

// Growth templates (a2-155, K92; grant chain step 1, K75/K80): Newsletter
// Studio's service routes for Rello's Growth house gate on these two slugs —
// GET /api/service/templates?scope=growth on templates:read, and
// POST /api/service/templates/{id}/use-for-growth on templates:copy. NS
// validates; the Rello → Newsletter Studio key will carry them once granted.
test("templates:read and templates:copy are canonical, validated by newsletter-studio, granted to rello", () => {
  const expected = {
    TEMPLATES_READ: "templates:read",
    TEMPLATES_COPY: "templates:copy",
  } as const;
  for (const [key, slug] of Object.entries(expected)) {
    const def = (PERMISSIONS as Record<string, { slug: string; validatedBy: readonly string[]; grantedTo: readonly string[] }>)[key];
    assert.ok(def, `${key} missing from PERMISSIONS`);
    assert.equal(def.slug, slug);
    assert.deepEqual([...def.validatedBy], ["newsletter-studio"]);
    assert.deepEqual([...def.grantedTo], ["rello"]);
    assert.ok(ALL_PERMISSION_SLUGS.includes(slug as never), `${slug} missing from ALL_PERMISSION_SLUGS`);
    assert.equal(SLUG_TO_KEY[slug as never], key);
    assert.equal(isPermissionSlug(slug), true);
  }
});

// PFP Gateway G-2 PR-4 (spec §4.5): GET /api/v1/billing/plan-grants gates on
// billing:plan-grants:read. Rello validates (ApiKey path); only PFP's key is
// granted it.
test("billing:plan-grants:read is canonical, validated by rello, granted to pathfinder-pro only", () => {
  const def = (PERMISSIONS as Record<string, { slug: string; validatedBy: readonly string[]; grantedTo: readonly string[] }>).BILLING_PLAN_GRANTS_READ;
  assert.ok(def, "BILLING_PLAN_GRANTS_READ missing from PERMISSIONS");
  assert.equal(def.slug, "billing:plan-grants:read");
  assert.deepEqual([...def.validatedBy], ["rello"]);
  assert.deepEqual([...def.grantedTo], ["pathfinder-pro"]);
  assert.ok(ALL_PERMISSION_SLUGS.includes("billing:plan-grants:read" as never), "missing from ALL_PERMISSION_SLUGS");
  assert.equal(SLUG_TO_KEY["billing:plan-grants:read" as never], "BILLING_PLAN_GRANTS_READ");
  assert.equal(isPermissionSlug("billing:plan-grants:read"), true);
  // The neighbouring admin-role billing slugs are unchanged and granted to no app.
  assert.equal(isPermissionSlug("billing:plan-grants"), false);
  assert.deepEqual([...(PERMISSIONS as Record<string, { grantedTo: readonly string[] }>).BILLING_READ.grantedTo], []);
});

// PFP Gateway G-2 follow-up (spec rev 10.18, G-4a "the phone field", K-194):
// PathfinderPro → Rello POST /api/provisioning/agent-contact sets or clears ONE
// agent's phone. It needs its own narrow slug: the broad agents:write (Rello
// staff roster writes) must not be widened or reused for it.
test("agents:contact:write is canonical, validated by rello, granted to pathfinder-pro only; agents:write is unchanged", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const defs = PERMISSIONS as Record<string, Def>;
  const def = defs.AGENTS_CONTACT_WRITE;
  assert.ok(def, "AGENTS_CONTACT_WRITE missing from PERMISSIONS");
  assert.equal(def.slug, "agents:contact:write");
  assert.equal(def.label, "Write agent contact");
  assert.match(def.description, /POST \/api\/provisioning\/agent-contact/);
  assert.match(def.description, /no other field is writable/);
  assert.deepEqual([...def.validatedBy], ["rello"]);
  assert.deepEqual([...def.grantedTo], ["pathfinder-pro"]);
  assert.ok(ALL_PERMISSION_SLUGS.includes("agents:contact:write" as never), "missing from ALL_PERMISSION_SLUGS");
  assert.equal(SLUG_TO_KEY["agents:contact:write" as never], "AGENTS_CONTACT_WRITE");
  assert.equal(isPermissionSlug("agents:contact:write"), true);
  // The broad roster permission is not widened: same slug, granted to no app.
  assert.equal(defs.AGENTS_WRITE.slug, "agents:write");
  assert.deepEqual([...defs.AGENTS_WRITE.grantedTo], []);
  assert.deepEqual([...defs.AGENTS_WRITE.validatedBy], ["rello"]);
  assert.equal(isPermissionSlug("agents:contact"), false);
});

// PFP Gateway G-RC (spec rev 10.20 §4.12d item 4 "Auth", H-162/K-196): Rello asks
// Home Scout to price one realtor rate check for ONE loan officer through
// POST /api/internal/rate-check/price. Home Scout validates (ApiKey path,
// appSource RELLO, targetApp HOME_SCOUT); only Rello's key is granted it.
test("rate-check:price is canonical, validated by home-scout, granted to rello only", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const def = (PERMISSIONS as Record<string, Def>).RATE_CHECK_PRICE;
  assert.ok(def, "RATE_CHECK_PRICE missing from PERMISSIONS");
  assert.equal(def.slug, "rate-check:price");
  assert.equal(def.label, "Price a realtor rate check");
  assert.match(def.description, /POST \/api\/internal\/rate-check\/price/);
  assert.match(def.description, /appSource RELLO, targetApp HOME_SCOUT/);
  assert.deepEqual([...def.validatedBy], ["home-scout"]);
  assert.deepEqual([...def.grantedTo], ["rello"]);
  assert.ok(ALL_PERMISSION_SLUGS.includes("rate-check:price" as never), "missing from ALL_PERMISSION_SLUGS");
  assert.equal(SLUG_TO_KEY["rate-check:price" as never], "RATE_CHECK_PRICE");
  assert.equal(isPermissionSlug("rate-check:price"), true);
  assert.equal(isPermissionSlug("rate-check"), false);
});

// PFP Gateway G-SETUP + G-A2P (spec SPEC-PFP-GATEWAY.md rev 10.21 §4.12d;
// KA prompt 1122): PathfinderPro → Rello. setup-charge:write covers the $99
// one-time setup fee (POST + GET /api/provisioning/setup-charge, GET .../fee);
// sms:registration:write covers one loan officer's Twilio A2P registration
// (POST + GET /api/provisioning/sms-registration, POST .../otp). Both are
// narrow slugs: the admin-role billing:* entries stay granted to no app.
test("billing:setup-charge:write and sms:registration:write are canonical, validated by rello, granted to pathfinder-pro only; billing:* admin slugs unchanged", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const defs = PERMISSIONS as Record<string, Def>;

  const charge = defs.BILLING_SETUP_CHARGE_WRITE;
  assert.ok(charge, "BILLING_SETUP_CHARGE_WRITE missing from PERMISSIONS");
  assert.equal(charge.slug, "billing:setup-charge:write");
  assert.equal(charge.label, "Charge a loan officer's setup fee");
  assert.match(charge.description, /POST \/api\/provisioning\/setup-charge\b/);
  assert.match(charge.description, /GET \/api\/provisioning\/setup-charge\b/);
  assert.match(charge.description, /GET \/api\/provisioning\/setup-charge\/fee/);
  assert.deepEqual([...charge.validatedBy], ["rello"]);
  assert.deepEqual([...charge.grantedTo], ["pathfinder-pro"]);

  const reg = defs.SMS_REGISTRATION_WRITE;
  assert.ok(reg, "SMS_REGISTRATION_WRITE missing from PERMISSIONS");
  assert.equal(reg.slug, "sms:registration:write");
  assert.equal(reg.label, "Register a loan officer for texting");
  assert.match(reg.description, /POST \/api\/provisioning\/sms-registration\b/);
  assert.match(reg.description, /GET \/api\/provisioning\/sms-registration\b/);
  assert.match(reg.description, /POST \/api\/provisioning\/sms-registration\/otp/);
  assert.deepEqual([...reg.validatedBy], ["rello"]);
  assert.deepEqual([...reg.grantedTo], ["pathfinder-pro"]);

  for (const [slug, key] of [
    ["billing:setup-charge:write", "BILLING_SETUP_CHARGE_WRITE"],
    ["sms:registration:write", "SMS_REGISTRATION_WRITE"],
  ] as const) {
    assert.ok(ALL_PERMISSION_SLUGS.includes(slug as never), `${slug} missing from ALL_PERMISSION_SLUGS`);
    assert.equal(SLUG_TO_KEY[slug as never], key);
    assert.equal(isPermissionSlug(slug), true);
  }
  assert.equal(isPermissionSlug("billing:setup-charge"), false);
  assert.equal(isPermissionSlug("sms:registration"), false);

  // The admin-role billing slugs and sms:send are not widened.
  for (const k of ["BILLING_READ", "BILLING_WRITE", "BILLING_ADMIN"]) assert.deepEqual([...defs[k].grantedTo], []);
  assert.deepEqual([...defs.SMS_SEND.grantedTo], ["pathfinder-pro"]);
});

// PFP Gateway G-10R (spec SPEC-PFP-GATEWAY.md rev 10.22 §4.10/§6 G-10R; KA
// prompt 1116 plan a7-1116 accepted, relay 1132): PathfinderPro → Rello plan
// switch with credit. One narrow slug covers the switch, its preview and its
// status read; the admin-role billing:* entries stay granted to no app.
test("billing:plan-switch:write is canonical, validated by rello, granted to pathfinder-pro only; billing:* admin slugs unchanged", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const defs = PERMISSIONS as Record<string, Def>;

  const sw = defs.BILLING_PLAN_SWITCH_WRITE;
  assert.ok(sw, "BILLING_PLAN_SWITCH_WRITE missing from PERMISSIONS");
  assert.equal(sw.slug, "billing:plan-switch:write");
  assert.equal(sw.label, "Switch a tenant's plan");
  assert.match(sw.description, /POST \/api\/v1\/billing\/plan-switch\b/);
  assert.match(sw.description, /GET \/api\/v1\/billing\/plan-switch\/preview/);
  assert.match(sw.description, /GET \/api\/v1\/billing\/plan-switch\/\[operationId\]/);
  assert.deepEqual([...sw.validatedBy], ["rello"]);
  assert.deepEqual([...sw.grantedTo], ["pathfinder-pro"]);

  assert.ok(ALL_PERMISSION_SLUGS.includes("billing:plan-switch:write" as never), "billing:plan-switch:write missing from ALL_PERMISSION_SLUGS");
  assert.equal(SLUG_TO_KEY["billing:plan-switch:write" as never], "BILLING_PLAN_SWITCH_WRITE");
  assert.equal(isPermissionSlug("billing:plan-switch:write"), true);
  assert.equal(isPermissionSlug("billing:plan-switch"), false);

  // The admin-role billing slugs are not widened, and the sibling PFP billing slugs are unchanged.
  for (const k of ["BILLING_READ", "BILLING_WRITE", "BILLING_ADMIN"]) assert.deepEqual([...defs[k].grantedTo], []);
  for (const k of ["BILLING_PLAN_GRANTS_READ", "BILLING_SETUP_CHARGE_WRITE"]) assert.deepEqual([...defs[k].grantedTo], ["pathfinder-pro"]);
});

// PFP Gateway X2 (spec SPEC-PFP-GATEWAY.md rev 10.30 §6 [D30], G-EXTRAS / D33;
// KA prompt 1152, plan a4-1151 ruled): two narrow PathfinderPro → Rello roster
// slugs. Neither is agents:write (the broad roster permission), which stays
// granted to no PFP key.
test("agents:loginless:write and team:members:write are canonical, validated by rello, granted to pathfinder-pro only; agents:write unchanged", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const defs = PERMISSIONS as Record<string, Def>;

  const la = defs.AGENTS_LOGINLESS_WRITE;
  assert.ok(la, "AGENTS_LOGINLESS_WRITE missing from PERMISSIONS");
  assert.equal(la.slug, "agents:loginless:write");
  assert.equal(la.label, "Add or remove a no-login loan officer");
  assert.match(la.description, /POST \/api\/provisioning\/loginless-agent\b/);
  assert.match(la.description, /POST \/api\/provisioning\/loginless-agent\/\[agentId\]\/remove/);
  assert.deepEqual([...la.validatedBy], ["rello"]);
  assert.deepEqual([...la.grantedTo], ["pathfinder-pro"]);

  const tm = defs.TEAM_MEMBERS_WRITE;
  assert.ok(tm, "TEAM_MEMBERS_WRITE missing from PERMISSIONS");
  assert.equal(tm.slug, "team:members:write");
  assert.equal(tm.label, "Add or remove a team login");
  assert.match(tm.description, /POST \/api\/provisioning\/team-member\b/);
  assert.match(tm.description, /POST \/api\/provisioning\/team-member\/\[userId\]\/sign-in-link/);
  assert.match(tm.description, /POST \/api\/provisioning\/team-member\/\[userId\]\/remove/);
  assert.deepEqual([...tm.validatedBy], ["rello"]);
  assert.deepEqual([...tm.grantedTo], ["pathfinder-pro"]);

  for (const [slug, key] of [["agents:loginless:write", "AGENTS_LOGINLESS_WRITE"], ["team:members:write", "TEAM_MEMBERS_WRITE"]] as const) {
    assert.ok(ALL_PERMISSION_SLUGS.includes(slug as never), `${slug} missing from ALL_PERMISSION_SLUGS`);
    assert.equal(SLUG_TO_KEY[slug as never], key);
    assert.equal(isPermissionSlug(slug), true);
  }
  assert.equal(isPermissionSlug("team:members"), false);
  assert.equal(isPermissionSlug("agents:loginless"), false);

  // The broad roster slug is not widened to PFP; the phone slug is unchanged.
  assert.equal(defs.AGENTS_WRITE.grantedTo.includes("pathfinder-pro"), false);
  assert.deepEqual([...defs.AGENTS_CONTACT_WRITE.grantedTo], ["pathfinder-pro"]);
});

// PFP Gateway P-2 (MAP-P2-EMBED-TOKEN-F2-261118; Platform KA prompt 1306): the
// embed token (PFP mints, HS verifies, at Rello) and F2 (HS asks Rello; PFP's
// three Rate Watch routes at HS). One slug per route; none is a broad slug.
test("P-2 embed-token and F2 slugs are canonical, with the right validator and grantee", () => {
  type Def = { slug: string; label: string; description: string; validatedBy: readonly string[]; grantedTo: readonly string[] };
  const defs = PERMISSIONS as Record<string, Def>;
  const want: ReadonlyArray<readonly [string, string, string, string, RegExp]> = [
    ["EMBED_TOKEN_MINT", "embed-token:mint", "rello", "pathfinder-pro", /POST \/api\/v1\/embed-tokens\b(?!\/)/],
    ["EMBED_TOKEN_VERIFY", "embed-token:verify", "rello", "home-scout", /POST \/api\/v1\/embed-tokens\/verify\b/],
    ["TENANT_APPS_READ", "tenant-apps:read", "rello", "home-scout", /GET \/api\/v1\/platform\/tenant-app-access\b/],
    ["RATE_WATCH_ACTIVE_COUNT_READ", "rate-watch:active-count:read", "home-scout", "pathfinder-pro", /GET \/api\/internal\/rate-watch\/active-count\b/],
    ["RATE_WATCH_END_AGENT_WRITE", "rate-watch:end-agent:write", "home-scout", "pathfinder-pro", /POST \/api\/internal\/rate-watch\/end-agent\b/],
    ["RATE_WATCH_END_TENANT_WRITE", "rate-watch:end-tenant:write", "home-scout", "pathfinder-pro", /POST \/api\/internal\/rate-watch\/end-tenant\b/],
  ];
  for (const [key, slug, validator, grantee, route] of want) {
    const d = defs[key];
    assert.ok(d, `${key} missing from PERMISSIONS`);
    assert.equal(d.slug, slug);
    assert.match(d.description, route);
    assert.deepEqual([...d.validatedBy], [validator], `${key} validatedBy`);
    assert.deepEqual([...d.grantedTo], [grantee], `${key} grantedTo`);
    assert.ok(ALL_PERMISSION_SLUGS.includes(slug as never), `${slug} missing from ALL_PERMISSION_SLUGS`);
    assert.equal(SLUG_TO_KEY[slug as never], key);
    assert.equal(isPermissionSlug(slug), true);
  }
  assert.equal(isPermissionSlug("embed-token"), false);
  assert.equal(isPermissionSlug("rate-watch:write"), false);
});
