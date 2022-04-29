import type {
    GetStarknetWalletOptions,
    IStarknetWindowObject,
    WalletProvider,
} from "../types";
import discoveryWallets from "../discovery";
import "svelte";
import Modal from "./Modal.svelte";
import { filterBy, sortBy } from "../utils";

export default async function show(
    installed: IStarknetWindowObject[],
    options?: GetStarknetWalletOptions
): Promise<IStarknetWindowObject | undefined> {
    const installedWalletIds = new Set(installed.map(w => w.id));
    // remove installed wallets from discovery
    let discovery = discoveryWallets.filter(dw => !installedWalletIds.has(dw.id));

    if (options?.include?.length) {
        // just show included wallets from discovery
        const include = new Set<string>(options.include);
        discovery = discovery.filter(dw => include.has(dw.id));
    } else if (options?.exclude?.length) {
        // remove excluded wallets from discovery
        const excluded = new Set<string>(options.exclude);
        discovery = discovery.filter(w => !excluded.has(w.id));
    }

    discovery = filterBy<WalletProvider>(discovery, options);
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
