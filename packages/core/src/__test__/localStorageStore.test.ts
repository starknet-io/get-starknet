import { LocalStorageWrapper } from "../localStorageStore"
import { beforeEach, describe, expect, it } from "vitest"

const KEY = "gsw-last"

function storageKeys(prefix = KEY): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(prefix)) keys.push(k)
  }
  return keys.sort()
}

describe("LocalStorageWrapper", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("stores the value under a single stable key", () => {
    const store = new LocalStorageWrapper(KEY)
    store.set("braavos")
    expect(localStorage.getItem(KEY)).toBe("braavos")
    expect(store.get()).toBe("braavos")
  })

  it("does not accumulate duplicate keys across repeated sets", () => {
    const store = new LocalStorageWrapper(KEY)
    store.set("argentX")
    store.set("braavos")
    store.set("okx")
    expect(storageKeys()).toEqual([KEY])
    expect(store.get()).toBe("okx")
  })

  it("get() does not rotate or mutate storage on read", () => {
    const store = new LocalStorageWrapper(KEY)
    store.set("braavos")
    const keysBefore = storageKeys()
    // read repeatedly, the way a React effect polling getLastConnectedWallet would
    store.get()
    store.get()
    expect(storageKeys()).toEqual(keysBefore)
    expect(localStorage.getItem(KEY)).toBe("braavos")
    expect(store.get()).toBe("braavos")
  })

  it("migrates a legacy rotated `${key}-<uid>` entry to the stable key", () => {
    localStorage.setItem(`${KEY}-abc123`, "braavos")
    const store = new LocalStorageWrapper(KEY)
    expect(store.get()).toBe("braavos")
    expect(localStorage.getItem(KEY)).toBe("braavos")
    expect(localStorage.getItem(`${KEY}-abc123`)).toBe(null)
    expect(storageKeys()).toEqual([KEY])
  })

  it("delete() removes the stored value", () => {
    const store = new LocalStorageWrapper(KEY)
    store.set("braavos")
    store.delete()
    expect(localStorage.getItem(KEY)).toBe(null)
    expect(store.get()).toBeFalsy()
  })
})
