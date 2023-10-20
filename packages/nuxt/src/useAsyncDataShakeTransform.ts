import { useNuxtApp } from 'nuxt/dist/app'
import { shake } from '@object-shake/core'
import { type _Transform } from 'nuxt/dist/app/composables/asyncData'

/**
 * @example
 * ```js
 * const key = 'somekey'
 * const { transform } = useAsyncDataShakeTransform(key, true)
 * const { data } = await useAsyncData(
 *   key,
 *   async () => {
 *     return fetchSomeThing()
 *   },
 *   { transform }
 * )
 * ```
 */
export function useAsyncDataShakeTransform(key: string, enable: boolean) {
  let getShaked = () => null

  const transform: _Transform = (input) => {
    if (!enable || import.meta.client) {
      return input
    }
    const [_proxy, _getShaked] = shake(input)
    getShaked = _getShaked
    return _proxy
  }

  if (enable && import.meta.server) {
    const nuxt = useNuxtApp()
    nuxt.hook('app:rendered', () => {
      nuxt.payload.data[key] = getShaked()
    })
  }

  return { transform }
}
