/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
export const generateUID = () =>
  `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`

export const shuffle = <T extends any[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

type AllowPromise<T> = Promise<T> | T
export function pipe<T>(
  ...fns: Array<(arg: T) => AllowPromise<T>>
): (arg: T) => Promise<T> {
  return (arg: T) => fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(arg))
}

export const ssrSafeWindow: Window | null =
  typeof window !== "undefined" ? window : null
