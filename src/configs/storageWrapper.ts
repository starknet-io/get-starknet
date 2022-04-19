import { generateUID } from "../utils";
import type { IStorageWrapper } from "../types";

export class StorageWrapper implements IStorageWrapper {
    #initialized = false;
    #key: string | undefined = undefined;
    #prefix: string;
    value: string | null | undefined = undefined;

    constructor(key: string) {
        this.#prefix = key;
        console.log(`StorageWrapper ${key}`, "constructor");

        this.#init();
    }

    set(value: string | null | undefined) {
        console.log(`StorageWrapper ${this.#key || this.#prefix}`, "set", value);

        if (!this.#initialized && !this.#init()) {
            return false;
        }

        this.delete(); // clear current key

        this.value = value;
        if (value) {
            this.#key = `${this.#prefix}-${generateUID()}`;
            console.log(`StorageWrapper ${this.#key}`, "set - new key", this.#key);
            localStorage.setItem(this.#key, value);
        }

        return true;
    }

    get() {
        this.#validateValue();
        console.log(
            `StorageWrapper ${this.#key || this.#prefix}`,
            "get",
            "value",
            this.value
        );
        return this.value;
    }

    delete() {
        console.log(`StorageWrapper ${this.#key || this.#prefix}`, "delete");

        if (!this.#initialized && !this.#init()) {
            return false;
        }

        this.value = null;
        if (this.#key) localStorage.removeItem(this.#key);

        return true;
    }

    #validateValue() {
        console.log(
            `StorageWrapper ${this.#key || this.#prefix}`,
            "validateValue",
            "value",
            this.value
        );
        if (this.value) {
            this.set(this.value);
        }
    }

    #init() {
        try {
            if (!this.#initialized && typeof window !== "undefined") {
                // init with prev key/value
                this.#key = Object.keys(localStorage).find(sk =>
                    sk.startsWith(this.#prefix)
                );
                console.log(`StorageWrapper ${this.#prefix}`, "init", this.#key);

                // set initialized as soon as we managed to extract data
                // from localStorage, so the `set` call below won't result
                // in a endless-recursive loop
                this.#initialized = true;
                if (this.#key) {
                    this.set(localStorage.getItem(this.#key));
                }
            }
        } catch (err) {
            console.warn(err);
        }
        return this.#initialized;
    }
}
