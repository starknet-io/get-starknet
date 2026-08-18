import { sortBy } from "../wallet/sort"
import { describe, expect, it } from "vitest"

const wallet = (id: string) => ({ id } as any)

describe("sortBy", () => {
  it("orders wallets named in `sort` first, in the given order, ignoring uninstalled ids", () => {
    // "ghost" is not installed; "c" and "a" are, listed out of natural order
    const result = sortBy(
      [wallet("a"), wallet("b"), wallet("c")],
      ["ghost", "c", "a"],
    )
    // c then a (their order in `sort`), then the unsorted remainder
    expect(result.slice(0, 2).map((w) => w.id)).toEqual(["c", "a"])
    expect(result.slice(2).map((w) => w.id)).toEqual(["b"])
  })

  it("prioritises a single installed match among uninstalled ids", () => {
    // regression: before the fix `a` ended up last because `sort.length` (2)
    // exceeded the number of installed matches (1)
    const result = sortBy([wallet("a"), wallet("b")], ["ghost", "a"])
    expect(result[0].id).toBe("a")
    expect(result.slice(1).map((w) => w.id)).toEqual(["b"])
  })
})
