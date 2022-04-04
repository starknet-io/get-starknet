<script lang="ts">
    import Dialog, { Title, Content, Header } from "@smui/dialog";
    import List, { Item, Text, Meta } from "@smui/list";
    import type { IStarknetWindowObject, WalletProvider } from "../types";
    import Bowser from "bowser";

    export let callback = () => {};
    export let installed: IStarknetWindowObject[] = [];
    export let discovery: WalletProvider[] = [];

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

    let open = true;
</script>

<svelte:head>
    <!-- Fonts -->
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700" />

    <!-- Material Typography -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css" />

    <!-- SMUI -->
    <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>

{#if open}
    <Dialog bind:open surface$style="min-width: 30vw;">
        <Header
            style="
                display: flex;
                justify-content: space-between;
                align-items: end;
            ">
            <Title>{title}</Title>
            <img
                alt="Close"
                style="margin-inline-end: 10px; padding: 10px; cursor: pointer;"
                on:click={() => (open = false)}
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPjwvc3ZnPg==" />
        </Header>
        <Content>
            {#if unifiedWallets.length}
                <List>
                    {#each unifiedWallets as wallet, idx}
                        <!--suppress CssUnresolvedCustomProperty -->
                        <Item
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
                                    window.open(wallet.downloads[browser], "_blank");
                                    callback(undefined);
                                }
                                open = false;
                            }}>
                            <Text
                                >{idx >= installed.length
                                    ? "Install "
                                    : ""}{wallet.name || "Injected"}</Text>
                            {#if !!wallet.icon}
                                <Meta>
                                    <img
                                        width="32px"
                                        src={wallet.icon}
                                        alt="{wallet.name} logo" />
                                </Meta>
                            {:else}
                                <Meta>
                                    <img
                                        alt="{wallet.name || 'Injected'} logo"
                                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48cGF0aCBkPSJNMTEuMDcsMTIuODVjMC43Ny0xLjM5LDIuMjUtMi4yMSwzLjExLTMuNDRjMC45MS0xLjI5LDAuNC0zLjctMi4xOC0zLjdjLTEuNjksMC0yLjUyLDEuMjgtMi44NywyLjM0TDYuNTQsNi45NiBDNy4yNSw0LjgzLDkuMTgsMywxMS45OSwzYzIuMzUsMCwzLjk2LDEuMDcsNC43OCwyLjQxYzAuNywxLjE1LDEuMTEsMy4zLDAuMDMsNC45Yy0xLjIsMS43Ny0yLjM1LDIuMzEtMi45NywzLjQ1IGMtMC4yNSwwLjQ2LTAuMzUsMC43Ni0wLjM1LDIuMjRoLTIuODlDMTAuNTgsMTUuMjIsMTAuNDYsMTMuOTUsMTEuMDcsMTIuODV6IE0xNCwyMGMwLDEuMS0wLjksMi0yLDJzLTItMC45LTItMmMwLTEuMSwwLjktMiwyLTIgUzE0LDE4LjksMTQsMjB6Ii8+PC9nPjwvc3ZnPg==" />
                                </Meta>
                            {/if}
                        </Item>
                    {/each}
                </List>
            {:else}
                <div class="mdc-typography--headline6">
                    No compatible wallets found for {browserName}
                </div>
            {/if}
        </Content>
    </Dialog>
{/if}
