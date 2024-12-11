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
  id: string = "metamask"
  name: string = "MetaMask"
  icon: string = `data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4=`
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
    // Using `this.#loadSwoSafe` to prevent the wallet is loading in a racing condition.
    await this.#loadSwoSafe(windowObject)
    // Whenever trgger function call to  `request` / `on` / `off`,
    // it will load the wallet into the `this.swo` object and forward the function call to the `this.swo` object.
    // Therefore the `MetaMaskVirtualWallet` object actually act as a proxy to the `this.swo` object.
    // Thus, to standardize the behavior, we should return the `MetaMaskVirtualWallet` object here, instead of the `this.swo` object.
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
          entry:
            "https://snaps.consensys.io/starknet/get-starknet/v1/remoteEntry.js",
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
   * Verify if the hosting machine is support the Wallet or not without loading the wallet itself.
   *
   * @param windowObject The window object.
   * @returns A promise to resolve a boolean value to indicate the support status.
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
   * And prevent the loading operation fall into a racing condirtion.
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
