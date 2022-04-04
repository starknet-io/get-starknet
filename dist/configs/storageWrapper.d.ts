/**
 * attempt to make default-overriding hard
 * todo improve/test concept
 */
export declare class StorageWrapper {
    #private;
    value: string | null | undefined;
    constructor(key: string);
    set(value: string | null | undefined): void;
    get(): string | null | undefined;
    delete(): void;
}
