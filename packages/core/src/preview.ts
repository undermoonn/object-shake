export interface ShakeOptions {
  keyValidate?: (key: Key) => boolean
}

type Key = string | symbol

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

export function shakePreviewVersion<T extends object>(
  target: T,
  options?: ShakeOptions
): [T, () => T] {
  const proxy = new Proxy(target, handlers)
  return [
    proxy,
    () => {
      return getShaked<T>(target, options || {}, {} as T)
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
        Reflect.set(res, key, getShaked(value, options, Array.isArray(value) ? [] : {}))
      } else {
        Reflect.set(res, key, value)
      }
    }
  }
  return res
}
