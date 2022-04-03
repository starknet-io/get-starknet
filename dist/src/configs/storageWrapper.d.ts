/**
 * attempt to make default-overriding hard
 * todo improve/test concept
 */
export declare class StorageWrapper {
    #private;
    value: string | null;
    constructor(key: string);
    set(value: string): void;
    get(): string | null;
    delete(): void;
}
