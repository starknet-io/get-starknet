<script lang="ts">
  import type { ExtensionWalletProviderWithStoreVersion } from "."
  import type {
    StarknetWindowObject,
    WebWalletProvider,
  } from "get-starknet-core"
  import { connectToChild } from "penpal"
  import { onMount } from "svelte"

  const ssrSafeWindow = typeof window !== "undefined" ? window : null

  export let lastWallet: StarknetWindowObject | null = null
  export let injectedWallets: StarknetWindowObject[] = []
  export let preAuthorizedWallets: StarknetWindowObject[] = []
  export let extensionWallets: ExtensionWalletProviderWithStoreVersion[] = []
  export let webWallets: WebWalletProvider[] = []
  export let openWebWallet: (
    wp: WebWalletProvider,
  ) => Promise<StarknetWindowObject | null> = () =>
    new Promise((resolve) => resolve(null))
  export let callback: (
    value: StarknetWindowObject | null,
  ) => Promise<void> = async () => {}
  export let theme: "light" | "dark" | null = null

  let loadingItem: string | false = false

  let webWalletLoading: boolean[] = []
  let webWalletSelected: boolean[] = []
  webWallets.forEach(() => {
    webWalletLoading.push(false)
    webWalletSelected.push(false)
  })

  console.log(webWalletLoading)

  let inlineIframe: Array<HTMLIFrameElement> = []
  let cb = async (value: StarknetWindowObject | null) => {
    loadingItem = value?.id ?? false
    await callback(value).catch(() => {})
    loadingItem = false
  }
  let darkModeControlClass = ""
  if (
    theme === "dark" ||
    (theme === null &&
      ssrSafeWindow?.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    darkModeControlClass = "dark"
  } else {
    darkModeControlClass = ""
  }
  const handler = (event: MediaQueryListEvent) => {
    darkModeControlClass = event.matches ? "dark" : ""
  }

  const connectIframe = (idx: number) => {
    connectToChild({
      // The iframe to which a connection should be made.
      iframe: inlineIframe[idx],
      // Methods the parent is exposing to the child.
      methods: {
        async connect() {
          console.log("WEB_WALLET::CONNECT")
          const starknetWindow = await openWebWallet(webWallets[idx])
          console.log("got starknetWindow !")
          cb(starknetWindow)
        },
      },
    })
  }

  onMount(() => {
    if (theme === null) {
      ssrSafeWindow
        ?.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", handler)
    }

    return () => {
      ssrSafeWindow
        ?.matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handler)
    }
  })

  const wallets = [
    lastWallet,
    ...preAuthorizedWallets,
    ...injectedWallets,
  ].filter(Boolean)
</script>

<div
  class={"backdrop-blur-sm fixed inset-0 flex items-center justify-center bg-black/25 z-40 " +
    darkModeControlClass}
  on:click={() => cb(null)}
  on:keyup={(e) => {
    if (e.key === "Escape") {
      cb(null)
    }
  }}>
  <main
    role="dialog"
    class={"bg-slate-50 rounded-md shadow w-full max-w-[500px] mx-6 p-4 text-center z-50 dark:bg-neutral-900 dark:text-white"}
    on:click={(e) => e.stopPropagation()}
    on:keyup={(e) => e.stopPropagation()}>
    <header class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-extrabold">Connect a wallet</h1>
      <span
        role="button"
        alt="Close"
        class="cursor-pointer"
        on:click={() => cb(null)}
        on:keyup={(e) => {
          if (e.key === "Enter") {
            cb(null)
          }
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </span>
    </header>
    {#if webWallets.length != 0}
      <!-- create one entry per web wallet -->
      <ul class="flex flex-col gap-3">
        {#each webWallets as wallet, i}
          <li
            class="flex justify-between items-center p-3 bg-slate-100 rounded-md cursor-pointer shadow-sm hover:bg-slate-200 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            on:click={() => {
              webWalletSelected[i] = true
              webWalletLoading[i] = true
            }}>
            <!-- webwallet -->
            {#if webWalletSelected[i]}
              {#if webWalletLoading[i]}
                <!-- Loading -->
                <div class="p-3">
                  <li
                    class="mb-2 flex justify-center items-center p-3 rounded-md cursor-pointer shadow-list-item dark:shadow-none dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-colors">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="w-8 h-8 text-neutral-300 animate-spin dark:text-neutral-600 fill-neutral-600 dark:fill-neutral-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor" />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill" />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </li>
                </div>
              {/if}
              <iframe
                title="Web Wallet"
                src={wallet.url_login}
                sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups"
                class={"border-none rounded-none shadow-none relative top-0 left-0 transform-none block w-full h-[104px] " +
                  (webWalletLoading[i] ? "hidden" : "")}
                bind:this={inlineIframe[i]}
                allow="publickey-credentials-get *"
                on:load={() => {
                  setTimeout(() => {
                    webWalletLoading[i] = false
                  }, 200)
                  connectIframe(i)
                }} />
            {:else}
              {wallet.name}
              <img alt={wallet.name} src={wallet.icon} class="w-8 h-8" />
            {/if}
          </li>
        {/each}
      </ul>
      <!-- or -->
      <div class="flex items-center justify-center mt-5 mb-6">
        <div class="w-full border-b border-gray-200 dark:border-gray-800" />
        <div class="mx-5 text-xs text-gray-400 uppercase">or</div>
        <div class="w-full border-b border-gray-200 dark:border-gray-800" />
      </div>
    {/if}
    <!-- create one entry per wallet -->
    <ul class="flex flex-col gap-3">
      {#each wallets as wallet}
        <li
          class="flex justify-between items-center p-3 bg-slate-100 rounded-md cursor-pointer shadow-sm hover:bg-slate-200 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          on:click={() => cb(wallet)}
          on:keyup={(e) => {
            if (e.key === "Enter") {
              cb(wallet)
            }
          }}>
          {wallet.name}
          {#if loadingItem === wallet.id}
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-neutral-300 animate-spin dark:text-neutral-600 fill-neutral-600 dark:fill-neutral-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          {:else}
            <img
              alt={wallet.name}
              src={wallet.icon}
              class="w-8 h-8 rounded-full" />
          {/if}
        </li>
      {/each}
      {#each extensionWallets as xWallet}
        <a
          alt={xWallet.name + " download link"}
          href={xWallet.download}
          target="_blank"
          rel="noopener noreferrer">
          <li
            class="flex justify-between items-center p-3 bg-slate-100 rounded-md shadow-sm cursor-pointer hover:bg-slate-200 transition-colors dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            on:click={() => cb(null)}
            on:keyup={(e) => {
              if (e.key === "Enter") {
                cb(null)
              }
            }}>
            Install {xWallet.name}
            <img
              alt={xWallet.name}
              src={xWallet.icon}
              class="w-8 h-8 rounded-full" />
          </li>
        </a>
      {/each}
    </ul>
  </main>
</div>

<style>
  @tailwind utilities;
  @tailwind components;
  @tailwind base;

  * {
    font-family: Nunito, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
    -webkit-font-smoothing: antialiased;
  }
</style>
