export interface PublicWalkOptions<T extends object> {
  onKeySet?: (parentDeepKeyPath: KeyPath) => KeyPath | false

  collectSymbolKey?: boolean
}

interface PrivateWalkOptions<T extends object> extends PublicWalkOptions<T> {
  /** ProxyHandler target */
  target: object

  /** ProxyHandler key */
  key: string | symbol

  /** ProxyHandler receiver */
  receiver: object

  parentDeepKeyPath: KeyPath

  rootReceiver: T
}

export interface ShakeOptions<T extends object> {
  walkOptions?: PublicWalkOptions<T>
}

type Key = string | symbol
type KeyPath = Key[]

export function shake<T extends object>(target: T, options?: ShakeOptions<T>): [T, T] {
  const shaked: T = Object.create(null)

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      return walk({
        target,
        key,
        receiver,

        parentDeepKeyPath: [],
        rootReceiver: shaked,

        ...options?.walkOptions
      })
    }
  })

  return [proxy, shaked]
}

function walk<T extends object>(
  options: PrivateWalkOptions<T>
): object | string | null | undefined {
  const { target, key, receiver, parentDeepKeyPath, rootReceiver, ...otherOptions } = options

  if (typeof key === 'symbol') {
    if (options.collectSymbolKey) {
      //
    } else {
      return undefined
    }
  }

  const currentDeepKeyPath = [...parentDeepKeyPath, key]
  const value = Reflect.get(target, key, receiver)

  if (typeof value === 'object' && value !== null) {
    return new Proxy(value, {
      get(target, key, receiver) {
        return walk<T>({
          target,
          key,
          receiver,
          parentDeepKeyPath: currentDeepKeyPath,
          rootReceiver,
          ...otherOptions
        })
      }
    })
  }

  if (options.onKeySet) {
    const filteredKeyPath = options.onKeySet(currentDeepKeyPath)
    if (filteredKeyPath) {
      deepSet(rootReceiver, filteredKeyPath, value)
    }
  } else {
    deepSet(rootReceiver, currentDeepKeyPath, value)
  }

  return value
}

function deepSet<T extends object>(target: T, keyPath: KeyPath, value: any): T {
  let t: any = target

  for (let idx = 0; idx < keyPath.length - 1; idx++) {
    const key = keyPath[idx]
    if (typeof t[key] === 'undefined') {
      t[key] = {}
    }
    t = t[key]
  }

  Reflect.set(t, keyPath[keyPath.length - 1], value)

  return target
}
