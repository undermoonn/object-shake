🚧 This package is under development.
So it may not work well.
Still got some problems about import nuxt componsitions.

---

```vue
<script setup>
import { useStateShake } from '@object-shake/nuxt'
const state = useStateShake('somekey', () => {
  return { a: 1, b: 2 }
})

if (import.meta.client) {
  console.log(state.value) // { a: 1 }
}
</script>

<template>
  <div>{{ state.a }}</div>
</template>
```

```vue
<script setup>
import { useAsyncDataShakeTransform } from '@object-shake/nuxt'

const key = 'somekey'
const { transform } = useAsyncDataShakeTransform(key, true)
const { data } = await useAsyncData(
  key,
  async () => {
    return { a: 1, b: 2 }
  },
  { transform }
)

if (import.meta.client) {
  console.log(data.value) // { a: 1 }
}
</script>

<template>
  <div>{{ data.a }}</div>
</template>
```
