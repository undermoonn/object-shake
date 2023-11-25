type Key = string | symbol

export interface ShakeOptions {
  keyValidate?: (key: Key) => boolean
}

const proxyGetHandlerCache = new WeakMap<object, Key[]>()
const proxyGetArrayLengthHandlerCache = new WeakMap<object, boolean>()
const proxyOwnKeysHanlderCache = new WeakMap<object, boolean>()

const handlers: Pick<ProxyHandler<any>, 'get' | 'ownKeys'> = {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver)
    cacheReachedKey(target, key)
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, handlers)
    }
    if (Array.isArray(target) && key === 'length') {
      proxyGetArrayLengthHandlerCache.set(target, true)
    }
    return value
  },
  ownKeys(target) {
    proxyOwnKeysHanlderCache.set(target, true)
    return Reflect.ownKeys(target)
  }
}

/**
 *  @example
 * ```js
 * const [proxy, getShaked] = shake({ a: { b: 1 }})
 * proxy.a
 * console.log(getShaked()) // { a: {} }
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
 * console.log(getShaked()) // { a: [] }
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
 * console.log(getShaked()) // { a: [1, 2, undefined] }
 * ```
 *
 * ---
 *
 * @example
 * ```js
 * const [proxy, getShaked] = shake({ a: [1, 2, 3] })
 * proxy.a.length
 * console.log(getShaked()) // { a: [undefined, undefined, undefined] }
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

export function reserve<T extends object>(target: T): void {
  if (typeof target !== 'object') {
    return
  }
  Object.keys(target).forEach((key) => {
    const value = Reflect.get(target, key)
    if (value !== null && typeof value === 'object') {
      reserve(value)
    }
  })
}

function cacheReachedKey(target: object, key: Key) {
  if (proxyGetHandlerCache.get(target)?.length) {
    if ((proxyGetHandlerCache.get(target) as Key[]).indexOf(key) === -1) {
      ;(proxyGetHandlerCache.get(target) as Key[]).push(key)
    }
  } else {
    proxyGetHandlerCache.set(target, [key])
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
    const gottenKeys = proxyGetHandlerCache.get(target)
    if (typeof gottenKeys !== 'undefined' && gottenKeys.indexOf(key) > -1) {
      const valueOfTargetKey = Reflect.get(target, key)
      if (typeof valueOfTargetKey === 'object' && valueOfTargetKey !== null) {
        if (Array.isArray(valueOfTargetKey)) {
          const r = getShaked(valueOfTargetKey, options, [] as unknown[])

          // For Array length
          if (proxyGetArrayLengthHandlerCache.get(valueOfTargetKey)) {
            for (let i = 0; i < valueOfTargetKey.length; i++) {
              if (r[i] === undefined) {
                Reflect.set(r, i, undefined)
              }
            }
          }

          Reflect.set(res, key, r)
        } else {
          const r = getShaked(valueOfTargetKey, options, {})

          // For Object.keys
          if (proxyOwnKeysHanlderCache.get(valueOfTargetKey)) {
            Object.keys(valueOfTargetKey).forEach((_key) => {
              if (Reflect.get(r, _key) === undefined) {
                Reflect.set(r, _key, undefined)
              }
            })
          }

          Reflect.set(res, key, r)
        }
      } else {
        Reflect.set(res, key, valueOfTargetKey)
      }
    }
  }
  return res
}
