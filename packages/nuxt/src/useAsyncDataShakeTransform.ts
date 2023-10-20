import { shake } from '@object-shake/core'
import { type NuxtApp } from 'nuxt/dist/app'
import { type _Transform } from 'nuxt/dist/app/composables/asyncData'

/**
 * @example
 * ```js
 * const key = 'somekey'
 * const nuxt = useNuxtApp()
 * const { transform } = useAsyncDataShakeTransform(nuxt, key, true)
 * const { data } = await useAsyncData(
 *   key,
 *   async () => {
 *     return fetchSomeThing()
 *   },
 *   { transform }
 * )
 * ```
 */
export function useAsyncDataShakeTransform(nuxt: NuxtApp, key: string, enable: boolean) {
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
    nuxt.hook('app:rendered', () => {
      nuxt.payload.data[key] = getShaked()
    })
  }

  return { transform }
}
