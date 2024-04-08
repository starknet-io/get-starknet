import type { VirtualWallet } from "../../types";
import { metaMaskVirtualWallet } from "./metaMaskVirtualWallet";

const virtualWallets: VirtualWallet[] = [
    metaMaskVirtualWallet
];

function initiateVirtualWallets() {
    virtualWallets.forEach(async virtualWallet => {
        const hasSupport = await virtualWallet.hasSupport()
        if (hasSupport) {
            window[virtualWallet.windowKey] = virtualWallet;
        }
    });
}

export { initiateVirtualWallets, }