import { generateUID } from "../utils";

/**
 * attempt to make default-overriding hard
 * todo improve/test concept
 */
export class StorageWrapper {
    readonly #key: string;
    value: string | null = null;

    constructor(key: string) {
        this.#key = `${key}-${generateUID()}`;

        const prevKey = Object.keys(localStorage).find(sk => sk.startsWith(key));
        if (prevKey) {
            const prevValue = localStorage.getItem(prevKey);
            localStorage.removeItem(prevKey);

            if (prevValue) {
                this.set(prevValue);
            }
        }
    }

    set(value: string) {
        this.value = value;
        localStorage.setItem(this.#key, value);
    }

    get() {
        this.#validateValue();
        return this.value;
    }

    delete() {
        this.value = null;
        localStorage.removeItem(this.#key);
    }

    #validateValue() {
        if (this.value) {
            this.set(this.value);
        }
    }
}
