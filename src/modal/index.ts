import type {
    GetStarknetWalletOptions,
    IStarknetWindowObject,
    WalletProvider,
} from "../types";
import discoveryWallets from "../discovery";
import "svelte";
import Modal from "./Modal.svelte";
import { sortBy } from "../utils";

export default async function show(
    installed: IStarknetWindowObject[],
    options?: GetStarknetWalletOptions
): Promise<IStarknetWindowObject | undefined> {
    const installedWalletIds = new Set(installed.map(w => w.id));
    // remove installed wallets from discovery
    let discovery = discoveryWallets.filter(dw => !installedWalletIds.has(dw.id));

    // remove excluded wallets from discovery
    if (options?.exclude?.length) {
        const excluded = new Set<string>(options.exclude);
        discovery = discovery.filter(w => !excluded.has(w.id));
    }

    discovery = sortBy<WalletProvider>(discovery, options?.order);

    return new Promise(resolve => {
        const modal = new Modal({
            target: document.body,
            props: {
                callback: (value: any) => {
                    modal.$destroy();
                    resolve(value);
                },
                installed,
                discovery,
                options: options?.modalOptions,
            },
        });
    });
}
