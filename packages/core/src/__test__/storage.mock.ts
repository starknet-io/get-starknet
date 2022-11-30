import { IStorageWrapper } from "../localStorageStore"

export class MockStorageWrapper implements IStorageWrapper {
  #value: string | null | undefined = undefined

  constructor(value: string | null | undefined = undefined) {
    this.#value = value
  }

  set(value: string | null | undefined) {
    this.#value = value
    return true
  }

  get() {
    return this.#value
  }

  delete() {
    this.#value = undefined

    return true
  }
}

export function mockStorageFunction(defaults: Record<string, string> = {}) {
  return (name: string) => {
    return new MockStorageWrapper(defaults[name])
  }
}
