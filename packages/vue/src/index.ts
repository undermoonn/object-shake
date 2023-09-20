import { shake } from '@object-shake/core'
import { MaybeRef, unref, UnwrapRef } from '@vue/reactivity'

export function reactiveShake<T extends MaybeRef<object>>(target: T): [T, () => UnwrapRef<T>] {
  const [p, s] = shake(target)

  return [
    p,
    () => {
      const res = unref(s())
      return (res as any)._value || res
    }
  ]
}
