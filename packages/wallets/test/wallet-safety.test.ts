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

// Reviewed exceptions: wallet-owned deep-link domains, per wallet and per
// store, so a mobile deep link can't be reused for a browser download.
// Adding a host here needs the same scrutiny as adding a wallet.
const vendorStoreHosts: Record<
  string,
  Partial<Record<string, readonly string[]>>
> = {
  braavos: { ios: ["link.braavos.app"], android: ["link.braavos.app"] },
};

const iconPrefix =
  /^data:image\/(svg\+xml|png|webp|jpeg)(?:;[a-z0-9=-]+)*;base64,/;

// Markup that can run script, load remote content or expand entities when an
// SVG is rendered inline (it is safe in <img>, but consumers may inline it).
// Element and attribute names may carry any namespace prefix (`<s:script>`).
const forbiddenSvgPatterns: readonly [string, RegExp][] = [
  ["<script>", /<(?:[\w.-]+:)?script\b/i],
  ["event handler attribute", /\s(?:[\w.-]+:)?on[a-z]+\s*=/i],
  ["<foreignObject>", /<(?:[\w.-]+:)?foreignObject\b/i],
  ["<iframe>/<embed>/<object>", /<(?:[\w.-]+:)?(?:iframe|embed|object)\b/i],
  ["DOCTYPE/ENTITY", /<!(DOCTYPE|ENTITY)/i],
  ["javascript: URL", /javascript:/i],
  ["CSS @import", /@import/i],
  // href may only be an in-document fragment or an embedded image.
  [
    "external href",
    /(?:[\w.-]+:)?href\s*=\s*["'](?!\s*(?:#|data:image\/(?:png|jpeg|webp|gif);))/i,
  ],
  // The whole allowed prefix sits in the lookahead so `url('#id')` and
  // `url( #id)` are accepted without backtracking past the quote.
  ["external url()", /url\((?!\s*["']?\s*(?:#|data:image\/))/i],
];

// Out-of-range code points decode to U+FFFD instead of throwing.
function safeCodePoint(code: number): string {
  return code <= 0x10ffff ? String.fromCodePoint(code) : "\uFFFD";
}

// Expand XML character references and predefined entities before scanning,
// so `u&#114;l(...)` or `&#x3C;script` can't slip past the raw-text checks.
function decodeXmlReferences(svg: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };
  return svg.replace(
    /&(?:#x([0-9a-f]+)|#([0-9]+)|([a-z]+));/gi,
    (ref, hex: string, dec: string, name: string) => {
      if (hex) return safeCodePoint(Number.parseInt(hex, 16));
      if (dec) return safeCodePoint(Number.parseInt(dec, 10));
      return named[name.toLowerCase()] ?? ref;
    },
  );
}

// Expand CSS escapes (`\\69` or `\\i` for `i`) so `@\\69mport` or
// `u\\72l(...)` in a style can't slip past the checks either.
function decodeCssEscapes(text: string): string {
  return text.replace(
    /\\(?:([0-9a-f]{1,6})\s?|([^\n0-9a-f]))/gi,
    (_, hex: string | undefined, char: string | undefined) =>
      hex ? safeCodePoint(Number.parseInt(hex, 16)) : (char ?? ""),
  );
}

function findUnsafeSvgContent(svg: string): string[] {
  const xmlDecoded = decodeXmlReferences(svg);
  const variants = [svg, xmlDecoded, decodeCssEscapes(xmlDecoded)];
  return forbiddenSvgPatterns
    .filter(([, pattern]) => variants.some((v) => pattern.test(v)))
    .map(([label]) => label);
}

describe("SVG safety scan", () => {
  const wrap = (body: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${body}</svg>`;

  it.each([
    ["script", "<script>alert(1)</script>"],
    [
      "prefixed script",
      '<s:script xmlns:s="http://www.w3.org/2000/svg">alert(1)</s:script>',
    ],
    ["event handler", '<rect onload="alert(1)"/>'],
    ["prefixed foreignObject", "<svg:foreignObject/>"],
    ["external href", '<image href="https://evil.example/x.png"/>'],
    ["external xlink:href", '<use xlink:href="https://evil.example/s.svg#a"/>'],
    ["external url()", '<rect fill="url(https://evil.example/p.svg#g)"/>'],
    ["char-ref url()", '<rect fill="u&#114;l(https://evil.example/p.svg#g)"/>'],
    ["hex char-ref script", "&#x3C;script>alert(1)&#x3C;/script>"],
    ["javascript: href", '<a href="javascript:alert(1)"/>'],
    [
      "CSS-escaped @import",
      '<style>@\\69mport "https://evil.example/x.css";</style>',
    ],
    [
      "CSS-escaped url()",
      '<rect style="fill:u\\72l(https://evil.example/p.svg#g)"/>',
    ],
    [
      "CSS-escaped url() with literal escape",
      '<rect style="fill:u\\rl(https://evil.example/p.svg#g)"/>',
    ],
  ])("rejects %s", (_, body) => {
    expect(findUnsafeSvgContent(wrap(body))).not.toEqual([]);
  });

  it.each([
    ["quoted fragment url()", "<rect fill=\"url('#gradient')\"/>"],
    ["spaced fragment url()", '<rect fill="url( #gradient)"/>'],
    ["fragment href", '<use href="#shape"/>'],
    ["fragment xlink:href", '<use xlink:href="#shape"/>'],
    ["embedded png", '<image href="data:image/png;base64,AAAA"/>'],
  ])("accepts %s", (_, body) => {
    expect(findUnsafeSvgContent(wrap(body))).toEqual([]);
  });
});

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
    expect(findUnsafeSvgContent(svg)).toEqual([]);
  });

  it("only links to official extension and app stores", () => {
    const entries = Object.entries(w.downloads);
    expect(entries.length).toBeGreaterThan(0);

    for (const [store, url] of entries) {
      const hosts = allowedStoreHosts[store];
      expect(hosts, `unknown download store "${store}"`).toBeDefined();

      const parsed = new URL(url);
      expect(parsed.protocol).toBe("https:");
      const vendorHosts = vendorStoreHosts[w.id]?.[store] ?? [];
      expect([...hosts, ...vendorHosts]).toContain(parsed.hostname);
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
