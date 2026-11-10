import { describe, expect, it } from "vitest";
import { wallets } from "../src/wallets";

// Guards for the curated wallet list. Entries are shown to every dapp user as
// "recommended" wallets, so a malicious entry (lookalike name, scripted icon,
// off-store download link) is a phishing vector. These checks catch the
// mechanical part; a human still has to verify the wallet and its publisher.

// Each download key may only point at its official store.
const allowedStoreHosts: Record<string, readonly string[]> = {
  chrome: ["chrome.google.com", "chromewebstore.google.com"],
  firefox: ["addons.mozilla.org"],
  edge: ["microsoftedge.microsoft.com"],
  safari: ["apps.apple.com"],
  ios: ["apps.apple.com"],
  android: ["play.google.com"],
};

// Reviewed exceptions: wallet-owned deep-link domains for mobile stores.
// Adding a host here needs the same scrutiny as adding a wallet.
const vendorStoreHosts: Record<string, readonly string[]> = {
  braavos: ["link.braavos.app"],
};

const iconPrefix =
  /^data:image\/(svg\+xml|png|webp|jpeg)(?:;[a-z0-9=-]+)*;base64,/;

// Markup that can run script, load remote content or expand entities when an
// SVG is rendered inline (it is safe in <img>, but consumers may inline it).
const forbiddenSvgPatterns: readonly [string, RegExp][] = [
  ["<script>", /<script/i],
  ["event handler attribute", /\son[a-z]+\s*=/i],
  ["<foreignObject>", /<foreignObject/i],
  ["<iframe>/<embed>/<object>", /<(iframe|embed|object)\b/i],
  ["DOCTYPE/ENTITY", /<!(DOCTYPE|ENTITY)/i],
  ["javascript: URL", /javascript:/i],
  ["CSS @import", /@import/i],
  // href/xlink:href may only be an in-document fragment or an embedded image.
  [
    "external href",
    /(?:xlink:)?href\s*=\s*["'](?!#|data:image\/(?:png|jpeg|webp|gif);)/i,
  ],
  ["external url()", /url\(\s*["']?(?!#|data:image\/)/i],
];

describe.each(wallets.map((w) => [w.id, w] as const))("wallet %s", (_, w) => {
  it("has a non-empty id and name", () => {
    expect(w.id.trim()).not.toBe("");
    expect(w.name.trim()).not.toBe("");
  });

  it("has an inline base64 image icon without active content", () => {
    const match = w.icon.match(iconPrefix);
    expect(match, "icon must be a base64 data:image URI").not.toBeNull();

    if (match?.[1] !== "svg+xml") {
      return;
    }
    const svg = atob(w.icon.slice(match[0].length));
    for (const [label, pattern] of forbiddenSvgPatterns) {
      expect(pattern.test(svg), `icon contains ${label}`).toBe(false);
    }
  });

  it("only links to official extension and app stores", () => {
    const entries = Object.entries(w.downloads);
    expect(entries.length).toBeGreaterThan(0);

    for (const [store, url] of entries) {
      const hosts = allowedStoreHosts[store];
      expect(hosts, `unknown download store "${store}"`).toBeDefined();

      const parsed = new URL(url);
      expect(parsed.protocol).toBe("https:");
      expect([...hosts, ...(vendorStoreHosts[w.id] ?? [])]).toContain(
        parsed.hostname,
      );
    }
  });
});

describe("wallet list", () => {
  it("has unique ids and names", () => {
    const ids = wallets.map((w) => w.id);
    const names = wallets.map((w) => w.name.toLowerCase());
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});
