import { generateUID } from "../utils";

/**
 * attempt to make default-overriding hard
 * todo improve/test concept
 */
export class StorageWrapper {
    #key: string | undefined = undefined;
    #prefix: string;
    value: string | null | undefined = undefined;

    constructor(key: string) {
        this.#prefix = key;

        // init with prev key/value
        this.#key = Object.keys(localStorage).find(sk => sk.startsWith(key));
        if (this.#key) {
            this.set(localStorage.getItem(this.#key));
        }
    }

    set(value: string | null | undefined) {
        this.delete(); // clear current key

        this.value = value;
        if (value) {
            this.#key = `${this.#prefix}-${generateUID()}`;
            localStorage.setItem(this.#key, value);
        }
    }

    get() {
        this.#validateValue();
        return this.value;
    }

    delete() {
        this.value = null;
        if (this.#key) localStorage.removeItem(this.#key);
    }

    #validateValue() {
        if (this.value) {
            this.set(this.value);
        }
    }
}
