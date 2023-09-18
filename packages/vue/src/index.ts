import { shake } from '@object-shake/core'
import { isRef, MaybeRef, unref, UnwrapRef } from '@vue/reactivity'

export function reactiveShake<T extends MaybeRef<object>>(target: T): [T, UnwrapRef<T>] {
  const [p, s] = shake(target, {
    walkOptions: {
      onKeySet(parentDeepKeyPath) {
        const isVueRefPrivateKey = parentDeepKeyPath[0] === '_value'

        const isVueReactiveDefinedKey = parentDeepKeyPath[parentDeepKeyPath.length - 1]
          .toString()
          .startsWith('__v_')

        if (isVueRefPrivateKey || isVueReactiveDefinedKey) {
          return false
        }

        if (isRef(target) && parentDeepKeyPath[0] === 'value') {
          return parentDeepKeyPath.slice(1)
        }

        return parentDeepKeyPath
      }
    }
  })

  return [p, unref(s) as UnwrapRef<T>]
}
