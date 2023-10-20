type Key = string | symbol

export interface ShakeOptions {
  keyValidate?: (key: Key) => boolean
}

const cache = new WeakMap<object, Key[]>()

const handlers: Pick<ProxyHandler<any>, 'get'> = {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver)
    cacheReachedKey(target, key)
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, handlers)
    }
    return value
  }
}

/**
 *  @example
 * ```js
 * const [proxy, getShaked] = shake({ a: { b: 1 }})
 * proxy.a
 * console.log(getShaked()) // {}
 * proxy.a.b
 * console.log(getShaked()) // { a: { b: 1 }}
 * ```
 *
 * ---
 *
 * @example
 * ```js
 * const [proxy, getShaked] = shake({ a: [1, 2, 3] })
 * proxy.a
 * console.log(getShaked()) // {}
 * proxy.a[0]
 * console.log(getShaked()) // { a: [1] }
 * ```
 *
 * ---
 *
 * @example
 * ```js
 * const [proxy, getShaked] = shake({ a: [1, 2, 3] })
 * proxy.a.slice(1)
 * console.log(getShaked()) // { a: [undefined, 2, 3] }
 * ```
 *
 * ---
 *
 * @example
 * ```js
 * const [proxy, getShaked] = shake({ a: [1, 2, 3] })
 * proxy.a.findIndex(item => item === 2)
 * console.log(getShaked()) // { a: [1, 2] }
 * ```
 *
 * ---
 *
 * @example
 * ```js
 * const [proxy, getShaked] = shake({ a: [1, 2, 3] })
 * proxy.a.length
 * console.log(getShaked()) // {}
 * ```
 */
export function shake<T extends object>(target: T, options?: ShakeOptions): [T, () => T] {
  const proxy = new Proxy(target, handlers)
  return [
    proxy,
    () => {
      const initial = (Array.isArray(target) ? [] : {}) as T
      return getShaked<T>(target, options || {}, initial)
    }
  ]
}

function cacheReachedKey(target: object, key: Key) {
  if (cache.get(target)?.length) {
    if ((cache.get(target) as Key[]).indexOf(key) === -1) {
      ;(cache.get(target) as Key[]).push(key)
    }
  } else {
    cache.set(target, [key])
  }
}

function getShaked<T extends object>(target: T, options: ShakeOptions, res: T): T {
  const keys = Object.keys(target)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (typeof options.keyValidate === 'function' && !options.keyValidate(key)) {
      continue
    }
    if (typeof key === 'symbol') {
      continue
    }
    const cached = cache.get(target)
    if (typeof cached !== 'undefined' && cached.indexOf(key) > -1) {
      const value = Reflect.get(target, key)
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          const r = getShaked(value, options, [] as any)
          if (r.length > 0) {
            Reflect.set(res, key, r)
          }
        } else {
          const r = getShaked(value, options, {})
          if (Object.keys(r).length > 0) {
            Reflect.set(res, key, r)
          }
        }
      } else {
        Reflect.set(res, key, value)
      }
    }
  }
  return res
}
