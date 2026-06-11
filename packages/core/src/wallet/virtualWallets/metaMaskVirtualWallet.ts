import { VirtualWallet } from "../../types"
import { init, loadRemote } from "@module-federation/runtime"
import {
  RequestFnCall,
  RpcMessage,
  StarknetWindowObject,
  WalletEventHandlers,
} from "@starknet-io/types-js"
import { Mutex } from "async-mutex"

interface MetaMaskProvider {
  isMetaMask: boolean
  request(options: { method: string }): Promise<void>
}

function isMetaMaskProvider(obj: unknown): obj is MetaMaskProvider {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("isMetaMask") &&
    obj.hasOwnProperty("request")
  )
}

function detectMetaMaskProvider(
  windowObject: Record<string, unknown>,
  { timeout = 3000 } = {},
): Promise<MetaMaskProvider | null> {
  let handled = false
  return new Promise<MetaMaskProvider | null>((resolve) => {
    const handleEIP6963Provider = (event: CustomEvent) => {
      const { info, provider } = event.detail
      const rdnsCheck =
        info.rdns === "io.metamask" || info.rdns === "io.metamask.flask"
      if (rdnsCheck && isMetaMaskProvider(provider)) {
        resolve(provider)
        handled = true
      }
    }

    if (typeof windowObject.addEventListener === "function") {
      windowObject.addEventListener(
        "eip6963:announceProvider",
        handleEIP6963Provider,
      )
    }

    setTimeout(() => {
      if (!handled) {
        resolve(null)
      }
    }, timeout)

    // Notify event listeners and other parts of the dapp that a provider is requested.
    if (typeof windowObject.dispatchEvent === "function") {
      windowObject.dispatchEvent(new Event("eip6963:requestProvider"))
    }
  })
}

async function waitForMetaMaskProvider(
  windowObject: Record<string, unknown>,
  options: { timeout?: number; retries?: number } = {},
): Promise<MetaMaskProvider | null> {
  const { timeout = 3000, retries = 0 } = options

  let provider: MetaMaskProvider | null = null
  try {
    provider = await detectMetaMaskProvider(windowObject, { timeout })
  } catch {
    // Silent error - do nothing
  }

  if (provider) {
    return provider
  }

  if (retries === 0) {
    return null
  }

  provider = await waitForMetaMaskProvider({ timeout, retries: retries - 1 })
  return provider
}

async function detectMetamaskSupport(windowObject: Record<string, unknown>) {
  const provider = await waitForMetaMaskProvider(windowObject, { retries: 3 })
  return provider
}

export type Eip6963SupportedWallet = {
  provider: MetaMaskProvider | null
}

class MetaMaskVirtualWallet
  implements VirtualWallet, Eip6963SupportedWallet, StarknetWindowObject
{
  id: string = "metamask-snaps"
  name: string = "MetaMask Snaps"
  icon: string = `data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNDIgMTM3Ij4KICA8cGF0aCBmaWxsPSIjMEEwQTBBIiBkPSJtMTMxLjIxNSAxMzAuNzI3LTI5Ljk3Ni04Ljg4My0yMi42MDQgMTMuNDQ5SDYyLjg2MWwtMjIuNjE5LTEzLjQ0OS0yOS45NiA4Ljg4My05LjExLTMwLjYzIDkuMTE3LTMzLjk5Mi05LjExNy0yOC43NDIgOS4xMS0zNS42MTggNDYuODE3IDI3Ljg0N2gyNy4yOThsNDYuODE4LTI3Ljg0NyA5LjExNyAzNS42MTgtOS4xMTcgMjguNzQyIDkuMTE3IDMzLjk5Mi05LjExNyAzMC42M1oiLz4KICA8cGF0aCBmaWxsPSIjODlCMEZGIiBkPSJtMTM4LjgyOCAxMDEuMjE5LTguMzY0IDI4LjEwMy0yOC4wODgtOC4zMzUtMi4yNTctLjY2OS0zLjIxOS0uOTU2LTEzLjc4LTQuMDkyLTEuMjA0LjE1OC0uNDY2IDEuNyAxNy4wMTUgNS4wNDgtMjAuMTQ1IDExLjk5SDYzLjE5M2wtMjAuMTQ0LTExLjk5IDE3LjAwOC01LjA0LS40NjctMS43MDgtMS4xOTYtLjE1OC0xNy4wMDcgNS4wNDgtMi4yNTcuNjY5LTI4LjA4IDguMzM1LTguMzY1LTI4LjEwM0wwIDEwMC4xMjFsOS41MyAzMi4wMDYgMzAuNTctOS4wNzkgMjIuNDY5IDEzLjM3NGgxNi4zNzZsMjIuNDY4LTEzLjM3NCAzMC41NyA5LjA3OSA5LjUyMy0zMi4wMDYtMi42NzggMS4wOThaIi8+CiAgPHBhdGggZmlsbD0iI0QwNzVGRiIgZD0iTTM5LjEzIDEwMS4yMTh2MTkuNzY4bDIuMjU3LS42Njl2LTE3Ljk0OGwxNy4wMDcgMTIuOSAxLjE5Ni4xNTggMS4xMTMtMS4yNDEtMjAuMDc2LTE1LjIyNUgyLjY0N2w4LjUwOC0zMS43MjgtMi4wMzgtMS4xMDZMMCAxMDAuMTJsMi42ODUgMS4wOThIMzkuMTNabTcwLjEyOC0xNy44MjctNy4yMjEgMS43ODN2Mi4zMzJsMTAuNjM2LTIuNjMzLjA2OC0xNy42NGgtMS40OTdsLS43Ni0uNTE4LS4wNiAxNC42Ni04LjcxOC04LjIyOUg4My42MTVsLS4zNDYgMi4yNjRoMTcuNTQybDguNDQ3IDcuOTgxWiIvPgogIDxwYXRoIGZpbGw9IiNEMDc1RkYiIGQ9Ik0zOS40NzUgODcuNTA2di0yLjMzMmwtNy4yMjItMS43ODMgOC40NDgtNy45OGgxNy41MzRsLS4zNDYtMi4yNjVINDAuMjQybC0uNzc1LjMwOS04LjM4IDcuOTItLjA2LTE0LjY2LS43Ni41MTloLTEuNTA0bC4wNjggMTcuNjQgMTAuNjQ0IDIuNjMyWm05MC44NzctMjAuMjczIDguNTA4IDMxLjcyOGgtMzcuOTc5bC0yMC4wNzcgMTUuMjI1IDEuMTE0IDEuMjQxIDEuMjAzLS4xNTggMTctMTIuOXYxNy45NDhsMi4yNTcuNjY5di0xOS43NjhoMzYuNDUybDIuNjc4LTEuMDk4LTkuMTEtMzMuOTkzLTIuMDQ2IDEuMTA2WiIvPgogIDxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Ik0yOC43NjUgNjcuMjMzaDEuNTA0bC43Ni0uNTIgMjMuMzg2LTE2LjAyMSAzLjQ4MyAyMi40Ni4zNDYgMi4yNjUgNS40OTEgMzUuNDIyIDEuOTU2LS43OWguMjAzbC05LjUwOC02MS4zNSAxLjc1Mi0xNy45NzFoMjUuMjM3TDg1LjEyIDQ4LjcybC05LjUwOCA2MS4zMjhoLjIwNGwxLjk1NS43OSA1LjQ5MS0zNS40MjIuMzQ2LTIuMjY0aC4wMDhsMy40ODMtMjIuNDYxIDIzLjM3OCAxNi4wMjIuNzYuNTI2aDE5LjExNGwyLjAzOC0xLjEwNSA5LjExLTI4LjczNUwxMzEuOTM4IDAgODQuMTIgMjguNDY0SDU3LjM5NEw5LjU2OCAwIDAgMzcuNGw5LjExIDI4LjczNSAyLjAzOCAxLjEwNWgxNy42MWwuMDA3LS4wMDdabTExMC4zOTQtMjkuOS04Ljc3IDI3LjY0M2gtMTguNDIybC0yMy45NzMtMTYuNDIgNDIuNjM1LTQ0LjU2MiA4LjUzIDMzLjMzOFpNMTI0LjY3MiA2Ljk1NyA4Ny4xNTIgNDYuMTdsLTEuNTU4LTE1Ljk1NSAzOS4wNzgtMjMuMjU4Wm0tNjguNzYgMjMuMjUtMS41NSAxNS45NjMtMzcuNTItMzkuMjIgMzkuMDcgMjMuMjV2LjAwOFpNMi4zNDcgMzcuMzMzbDguNTMtMzMuMzM4IDQyLjYzNSA0NC41NjEtMjMuOTcyIDE2LjQySDExLjExOEwyLjM0NyAzNy4zMzJaIi8+CiAgPHBhdGggZmlsbD0iI0JBRjI0QSIgZD0iTTc3LjA3IDExMC4wNDlINjQuNDQybC00Ljg1MiA1LjM3OSAyLjQxNSA4LjgwOGgxNy40ODlsMi40MTUtOC44MDgtNC44NTItNS4zNzloLjAxNVptLjcgMTEuOTNINjMuNzVsLTEuNjQtNS45NzIgMy4zMTctMy42NzloMTAuNjY2bDMuMzE3IDMuNjc5LTEuNjQgNS45NzJaTTU4LjI2IDkwLjgwN2wtLjIxMS0uNTV2LS4wMTRsLTMuNzM5LTkuNjg5SDQ0LjJsLTQuNzIzIDQuNjE5djIuMzI0bDE2LjY3NiA0LjEyMiAyLjEwNi0uODEyWm0tMTMuMTQyLTcuOTg5aDcuNjQzbDIuNCA2LjIxNC0xMy4xMDQtMy4yMzUgMy4wNTQtMi45NzhoLjAwN1ptNDAuMjI4IDguODAyIDE2LjY3Ny00LjEyMXYtMi4zMjVsLTQuNzI0LTQuNjFoLTEwLjExbC0zLjczOCA5LjY4di4wMTVsLS4yMTEuNTUgMi4xMDYuODEyWm0xNC4wOS01LjgyMi0xMy4xMDQgMy4yMzUgMi40LTYuMjJoNy42NDJsMy4wNTQgMi45ODZoLjAwN1oiLz4KPC9zdmc+Cg==`
  windowKey: string = "starknet_metamask"
  provider: MetaMaskProvider | null = null
  swo: StarknetWindowObject | null = null
  lock: Mutex
  version: string = "v2.0.0"

  constructor() {
    this.lock = new Mutex()
  }

  /**
   * Load and resolve the `StarknetWindowObject`.
   *
   * @param windowObject The window object.
   * @returns A promise to resolve a `StarknetWindowObject`.
   */
  async loadWallet(
    windowObject: Record<string, unknown>,
  ): Promise<StarknetWindowObject> {
    // Using `this.#loadSwoSafe` to prevent race condition when the wallet is loading.
    await this.#loadSwoSafe(windowObject)
    // The `MetaMaskVirtualWallet` object acts as a proxy for the `this.swo` object.
    // When `request`, `on`, or `off` is called, the wallet is loaded into `this.swo`,
    // and the function call is forwarded to it.
    // To maintain consistent behaviour, the `MetaMaskVirtualWallet`
    // object (`this`) is returned instead of `this.swo`.
    return this
  }

  /**
   * Load the remote `StarknetWindowObject` with module federation.
   *
   * @param windowObject The window object.
   * @returns A promise to resolve a `StarknetWindowObject`.
   */
  async #loadSwo(
    windowObject: Record<string, unknown>,
  ): Promise<StarknetWindowObject> {
    if (!this.provider) {
      this.provider = await detectMetamaskSupport(windowObject)
    }

    await init({
      name: "MetaMaskStarknetSnapWallet",
      remotes: [
        {
          name: "MetaMaskStarknetSnapWallet",
          alias: "MetaMaskStarknetSnapWallet",
          entry: `https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js?ts=${Date.now()}`,
        },
      ],
    })

    const result = await loadRemote<{
      MetaMaskSnapWallet: new (
        provider: MetaMaskProvider,
        version: string,
      ) => StarknetWindowObject
    }>("MetaMaskStarknetSnapWallet/index")

    if (!result) {
      // as `loadWallet` should only trigger when the wallet selected,
      // therefore it is make sense to throw error to indicate the wallet is not loaded
      throw new Error("Failed to load MetaMask Wallet")
    }

    return new result.MetaMaskSnapWallet(
      this.provider as unknown as MetaMaskProvider,
      "*",
    )
  }

  /**
   * Verify if the hosting machine supports the Wallet or not without loading the wallet itself.
   *
   * @param windowObject The window object.
   * @returns A promise that resolves to a boolean value to indicate the support status.
   */
  async hasSupport(windowObject: Record<string, unknown>) {
    this.provider = await detectMetamaskSupport(windowObject)
    return this.provider !== null
  }

  /**
   * Proxy the RPC request to the `this.swo` object.
   * Load the `this.swo` if not loaded.
   *
   * @param call The RPC API arguments.
   * @returns A promise to resolve a response of the proxy RPC API.
   */
  async request<Data extends RpcMessage>(
    call: Omit<Data, "result">,
  ): Promise<Data["result"]> {
    return this.#loadSwoSafe().then((swo: StarknetWindowObject) => {
      // Forward the request to the `this.swo` object.
      // Except RPCs `wallet_supportedSpecs` and `wallet_getPermissions`, other RPCs will trigger the Snap to install if not installed.
      return swo.request(
        call as unknown as RequestFnCall<Data["type"]>,
      ) as unknown as Data["result"]
    })
  }

  /**
   * Subscribe the `accountsChanged` or `networkChanged` event.
   * Proxy the subscription to the `this.swo` object.
   * Load the `this.swo` if not loaded.
   *
   * @param event - The event name.
   * @param handleEvent - The event handler function.
   */
  on<Event extends keyof WalletEventHandlers>(
    event: Event,
    handleEvent: WalletEventHandlers[Event],
  ): void {
    this.#loadSwoSafe().then((swo: StarknetWindowObject) =>
      swo.on(event, handleEvent),
    )
  }

  /**
   * Un-subscribe the `accountsChanged` or `networkChanged` event for a given handler.
   * Proxy the un-subscribe request to the `this.swo` object.
   * Load the `this.swo` if not loaded.
   *
   * @param event - The event name.
   * @param handleEvent - The event handler function.
   */
  off<Event extends keyof WalletEventHandlers>(
    event: Event,
    handleEvent: WalletEventHandlers[Event],
  ): void {
    this.#loadSwoSafe().then((swo: StarknetWindowObject) =>
      swo.off(event, handleEvent),
    )
  }

  /**
   * Load the `StarknetWindowObject` safely with lock.
   * And prevent the loading operation fall into a racing condition.
   *
   * @returns A promise to resolve a `StarknetWindowObject`.
   */
  async #loadSwoSafe(
    windowObject: Record<string, unknown> = window,
  ): Promise<StarknetWindowObject> {
    return this.lock.runExclusive(async () => {
      // Using `this.swo` to prevent the wallet is loaded multiple times
      if (!this.swo) {
        this.swo = await this.#loadSwo(windowObject)
        this.#bindSwoProperties()
      }
      return this.swo
    })
  }

  /**
   * Bind properties to `MetaMaskVirtualWallet` from `this.swo`.
   */
  #bindSwoProperties(): void {
    if (this.swo) {
      this.version = this.swo.version
      this.name = this.swo.name
      this.id = this.swo.id
      this.icon = this.swo.icon as string
    }
  }
}
const metaMaskVirtualWallet = new MetaMaskVirtualWallet()

export { metaMaskVirtualWallet }
