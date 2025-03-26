import { describe, expect, it } from "vitest";

import { wallets } from "../src/wallets";
import * as module from "../src/wallets";

describe("wallets", () => {
  it("should export all wallets", () => {
    expect(wallets).toHaveLength(5);

    for (const [key, wallet] of Object.entries(module)) {
      if (key === "wallets") {
        continue;
      }

      expect(wallets).toContainEqual(wallet);
    }
  });
});
