<script lang="ts">
    import {
        Dialog,
        Card,
        CardTitle,
        MaterialApp,
        List,
        ListItem,
    } from "svelte-materialify";

    import type { IStarknetWindowObject, ModalOptions, WalletProvider } from "../types";
    import Bowser from "bowser";

    export let callback = () => {};
    export let installed: IStarknetWindowObject[] = [];
    export let discovery: WalletProvider[] = [];
    export let options: ModalOptions = {};

    const theme = options?.theme;

    const title = "Connect a wallet";

    const browserName = Bowser.getParser(window.navigator.userAgent)
        .getBrowser()
        .name?.toLowerCase();
    let browser;
    switch (browserName) {
        case "chrome":
        case "chromium":
        case "electron":
        case "microsoft edge":
            browser = "chrome";
            break;
        case "firefox":
            browser = "firefox";
            break;
    }

    const unifiedWallets = browser
        ? [
              // include installed 1st
              ...installed,
              // discovery 2nd, and remove wallets with no support
              // for the current browser
              ...discovery.filter(dw => !!dw.downloads[browser]),
          ]
        : installed;

    console.log("modal", { unifiedWallets, browser, installed, discovery });

    let active = true;
</script>

{#if active}
    <div class="app">
        <MaterialApp {theme}>
            <Dialog bind:active>
                <Card style="min-width: 30vw">
                    <CardTitle
                        style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    ">
                        {title}
                        <img
                            alt="Close"
                            style="cursor: pointer;"
                            on:click={() => (active = false)}
                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPjwvc3ZnPg==" />
                    </CardTitle>

                    {#if unifiedWallets.length}
                        <List style="margin-inline-start: 24px; margin-inline-end: 24px">
                            {#each unifiedWallets as wallet, idx}
                                <!--suppress CssUnresolvedCustomProperty -->
                                <ListItem
                                    style="
                                border: 1px solid lightgrey;
                                /* use same border-radius as dialog's */
                                border-radius: var(--mdc-shape-medium, 4px);
                                height: 58px;
                                background: #edeef2;
                                margin-bottom: 10px;
                                "
                                    on:click={() => {
                                        if (idx < installed.length) {
                                            callback(wallet);
                                        } else {
                                            window.open(
                                                wallet.downloads[browser],
                                                "_blank"
                                            );
                                            callback(undefined);
                                        }
                                        active = false;
                                    }}>
                                    {idx >= installed.length
                                        ? "Install "
                                        : ""}{wallet.name || "Injected"}

                                    <span slot="append">
                                        {#if !!wallet.icon}
                                            <img
                                                width="32px"
                                                src={wallet.icon}
                                                alt="{wallet.name} logo" />
                                        {:else}
                                            <img
                                                alt="{wallet.name || 'Injected'} logo"
                                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48cGF0aCBkPSJNMTEuMDcsMTIuODVjMC43Ny0xLjM5LDIuMjUtMi4yMSwzLjExLTMuNDRjMC45MS0xLjI5LDAuNC0zLjctMi4xOC0zLjdjLTEuNjksMC0yLjUyLDEuMjgtMi44NywyLjM0TDYuNTQsNi45NiBDNy4yNSw0LjgzLDkuMTgsMywxMS45OSwzYzIuMzUsMCwzLjk2LDEuMDcsNC43OCwyLjQxYzAuNywxLjE1LDEuMTEsMy4zLDAuMDMsNC45Yy0xLjIsMS43Ny0yLjM1LDIuMzEtMi45NywzLjQ1IGMtMC4yNSwwLjQ2LTAuMzUsMC43Ni0wLjM1LDIuMjRoLTIuODlDMTAuNTgsMTUuMjIsMTAuNDYsMTMuOTUsMTEuMDcsMTIuODV6IE0xNCwyMGMwLDEuMS0wLjksMi0yLDJzLTItMC45LTItMmMwLTEuMSwwLjktMiwyLTIgUzE0LDE4LjksMTQsMjB6Ii8+PC9nPjwvc3ZnPg==" />
                                        {/if}
                                    </span>
                                </ListItem>
                            {/each}
                        </List>
                    {:else}
                        <div class="mdc-typography--headline6">
                            No compatible wallets found for {browserName}
                        </div>
                    {/if}
                </Card>
            </Dialog>
        </MaterialApp>
    </div>
{/if}

<style>
    .app {
        background: transparent;
    }
</style>
