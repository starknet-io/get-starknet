export interface IStorageWrapper {
  set(value: string | null | undefined): boolean
  get(): string | null | undefined
  delete(): boolean
}

export class LocalStorageWrapper implements IStorageWrapper {
  #initialized = false
  #key: string
  value: string | null | undefined = undefined

  constructor(key: string) {
    this.#key = key

    this.#init()
  }

  set(value: string | null | undefined) {
    if (!this.#initialized && !this.#init()) {
      return false
    }

    this.value = value
    if (value) {
      localStorage.setItem(this.#key, value)
    } else {
      localStorage.removeItem(this.#key)
    }

    return true
  }

  get() {
    return this.value
  }

  delete() {
    if (!this.#initialized && !this.#init()) {
      return false
    }

    this.value = null
    localStorage.removeItem(this.#key)

    return true
  }

  #init() {
    try {
      if (!this.#initialized && typeof window !== "undefined") {
        // set initialized before touching storage so a re-entrant call
        // cannot recurse back into #init
        this.#initialized = true

        // Older versions stored the value under a rotating `${key}-<uid>`
        // key and rewrote it on every read, which could leave several
        // duplicate entries and make the "last connected wallet" lookup
        // non-deterministic. Migrate any such legacy keys into the single
        // stable key and drop the duplicates.
        const legacyKeys: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const sk = localStorage.key(i)
          if (sk && sk !== this.#key && sk.startsWith(`${this.#key}-`)) {
            legacyKeys.push(sk)
          }
        }
        const existing =
          localStorage.getItem(this.#key) ??
          (legacyKeys.length > 0 ? localStorage.getItem(legacyKeys[0]) : null)
        legacyKeys.forEach((sk) => localStorage.removeItem(sk))

        if (existing != null) {
          this.value = existing
          localStorage.setItem(this.#key, existing)
        }
      }
    } catch (err) {
      console.warn(err)
    }
    return this.#initialized
  }
}
