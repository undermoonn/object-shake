import { shake } from '@object-shake/core'
import { unref, ref, isRef, type Ref, type UnwrapRef } from '@vue/reactivity'

export function shakeMaybeRef<T extends object | Ref>(target: T): [T, () => UnwrapRef<T>] {
  const [proxy, getShaked] = shake(unref(target))
  return [isRef(target) ? ref(proxy) : proxy, getShaked]
}

// external
export { shake }
