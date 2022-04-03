import { AccountInterface, Provider, SignerInterface } from "starknet";
export declare enum EventType {
    AccountsChanged = "accountsChanged",
    NetworkChanged = "networkChanged"
}
export declare type EventHandler = (data: any) => void;
export interface IStarknetWindowObject {
    request: (call: any) => Promise<void>;
    enable: (options?: {
        showModal?: boolean;
    }) => Promise<string[]>;
    isPreauthorized: () => Promise<boolean>;
    on: (event: EventType, handleEvent: EventHandler) => void;
    off: (event: EventType, handleEvent: EventHandler) => void;
    id: string;
    name: string;
    version: string;
    icon: string;
    provider: Provider;
    isConnected: boolean;
    /**
     * @deprecated use `account` instead
     */
    signer?: SignerInterface;
    account?: AccountInterface;
    selectedAddress?: string;
}
