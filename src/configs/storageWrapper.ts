import { generateUID } from "../utils";
import type { IStorageWrapper } from "../types";

export class StorageWrapper implements IStorageWrapper {
    #key: string | undefined = undefined;
    #prefix: string;
    value: string | null | undefined = undefined;

    constructor(key: string) {
        this.#prefix = key;
        console.log(`StorageWrapper ${key}`, "constructor");

        // init with prev key/value
        this.#key = Object.keys(localStorage).find(sk => sk.startsWith(key));
        console.log(`StorageWrapper ${key}`, "old key", this.#key);
        if (this.#key) {
            this.set(localStorage.getItem(this.#key));
        }
    }

    set(value: string | null | undefined) {
        console.log(`StorageWrapper ${this.#key}`, "set", value);

        this.delete(); // clear current key

        this.value = value;
        if (value) {
            this.#key = `${this.#prefix}-${generateUID()}`;
            console.log(`StorageWrapper ${this.#key}`, "set - new key", this.#key);
            localStorage.setItem(this.#key, value);
        }
    }

    get() {
        this.#validateValue();
        console.log(`StorageWrapper ${this.#key}`, "get", "value", this.value);
        return this.value;
    }

    delete() {
        console.log(`StorageWrapper ${this.#key}`, "delete");

        this.value = null;
        if (this.#key) localStorage.removeItem(this.#key);
    }

    #validateValue() {
        console.log(`StorageWrapper ${this.#key}`, "validateValue", "value", this.value);
        if (this.value) {
            this.set(this.value);
        }
    }
}
