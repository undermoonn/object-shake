import { shakeMaybeRef } from '@object-shake/vue'
import { useState, useNuxtApp } from 'nuxt/dist/app'
import { type Ref, ref } from '@vue/reactivity'

export function useStateShake<T extends object | Ref>(key: string, init: () => T | Ref<T>): Ref<T> {
  if (import.meta.client) {
    return useState<T>(key, init)
  }

  const [proxy, getShaked] = shakeMaybeRef(init())

  useNuxtApp().hook('app:rendered', () => {
    useState(key, () => {
      const res = getShaked()
      return res
    })
  })

  return ref(proxy)
}
