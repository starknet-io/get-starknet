import type { IStarknetWindowObject, ModalOptions } from "../types";
import discoveryWallets from "../discovery";
import "svelte";
import Modal from "./Modal.svelte";

export default async function show(
    installed: IStarknetWindowObject[],
    options?: ModalOptions
): Promise<IStarknetWindowObject | undefined> {
    const installedWalletIds = new Set(installed.map(w => w.id));
    // remove installed wallets from discovery
    const discovery = discoveryWallets.filter(dw => !installedWalletIds.has(dw.id));

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
                options,
            },
        });
    });
}
