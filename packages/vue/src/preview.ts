import { shakePreviewVersion } from '@object-shake/core'
import { MaybeRef, unref, UnwrapRef } from '@vue/reactivity'

export function reactiveShakePreviewVersion<T extends MaybeRef<object>>(
  target: T
): [T, () => UnwrapRef<T>] {
  const [p, s] = shakePreviewVersion(target)

  return [
    p,
    () => {
      const res = unref(s())
      return (res as any)._value || res
    }
  ]
}
