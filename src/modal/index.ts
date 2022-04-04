import type { IStarknetWindowObject } from "../types";
import discoveryWallets from "../discovery";
import "svelte";
import Modal from "./Modal.svelte";

export default async function show(
    installed: IStarknetWindowObject[]
): Promise<IStarknetWindowObject | undefined> {
    const installedWalletIds = new Set(installed.map(w => w.id));
    const discovery = discoveryWallets.filter(dw => {
        // remove installed wallets from discovery when -
        return (
            // 1. the wallet is installed
            !installedWalletIds.has(dw.id) &&
            // 2. the wallet is of a legacy installation -
            // @ts-ignore in case of a legacy wallet installation,
            // one of installedWalletIds will be `undefined`
            // (since a legacy wallet won't have an `id`)
            installedWalletIds.has(undefined) &&
            dw.id !== "argentX"
        );
    });

    return new Promise(resolve => {
        new Modal({
            target: document.body,
            props: {
                callback: resolve,
                installed,
                discovery,
            },
        });
    });
}
