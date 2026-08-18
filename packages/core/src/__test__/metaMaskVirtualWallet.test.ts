import { metaMaskVirtualWallet } from "../wallet/virtualWallets/metaMaskVirtualWallet"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// This installed vitest (0.19.1) predates vi.advanceTimersByTimeAsync, so timer
// advances and the microtask chain they release (promise resolution walking back
// up through detectMetaMaskProvider -> waitForMetaMaskProvider -> the next
// recursive call's own setTimeout registration) must be interleaved by hand: a
// real setImmediate macrotask only runs once every currently-queued microtask has
// drained, which is exactly the flush point we need before the next timer tick.
function flushMicrotasks() {
  return new Promise<void>((resolve) => setImmediate(resolve))
}

async function tick(ms: number) {
  vi.advanceTimersByTime(ms)
  await flushMicrotasks()
  await flushMicrotasks()
}

describe("MetaMaskVirtualWallet retries", () => {
  beforeEach(() => {
    // Only fake setTimeout/clearTimeout - leave setImmediate real so it can be
    // used below as a microtask-queue flush point between timer advances.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("passes the real windowObject through on every retry attempt", async () => {
    const addEventListener = vi.fn()
    const dispatchEvent = vi.fn()
    const fakeWindowObject = { addEventListener, dispatchEvent }

    const resultPromise = metaMaskVirtualWallet.hasSupport(fakeWindowObject)

    // detectMetamaskSupport calls waitForMetaMaskProvider(windowObject, { retries: 3 }),
    // so a correct implementation makes 1 initial attempt + 3 retries, each waiting
    // out the default 3000ms timeout since no provider ever announces itself.
    for (let attempt = 0; attempt < 4; attempt++) {
      await tick(3000)
    }

    const result = await resultPromise

    expect(result).toBe(false)
    // If the recursive call drops the real windowObject (passing the
    // `{ timeout, retries }` options object as windowObject instead), only the
    // very first attempt has a real addEventListener/dispatchEvent to call -
    // every retry hits a plain object with no such methods.
    expect(addEventListener).toHaveBeenCalledTimes(4)
    expect(dispatchEvent).toHaveBeenCalledTimes(4)
  })
})
