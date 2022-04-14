import type { IStorageWrapper } from "../types";
export declare class StorageWrapper implements IStorageWrapper {
    #private;
    value: string | null | undefined;
    constructor(key: string);
    set(value: string | null | undefined): void;
    get(): string | null | undefined;
    delete(): void;
}
