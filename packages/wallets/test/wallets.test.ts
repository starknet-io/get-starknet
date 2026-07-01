import { describe, expect, it } from "vitest";
import * as module from "../src/wallets";
import { wallets } from "../src/wallets";

describe("wallets", () => {
  it("should export all wallets", () => {
    for (const [key, wallet] of Object.entries(module)) {
      if (key === "wallets") {
        continue;
      }

      expect(wallets).toContainEqual(wallet);
    }
  });
});
