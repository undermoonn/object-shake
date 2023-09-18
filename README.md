# object-shake

### Use Cases

#### - `Vanilla`

```js
import { shake } from '@object-shake/core'

const target = {
  a: {
    b: { c: 1, d: 2 },
    e: 3
  },
  f: 4
}

const [proxyTarget, shakedTarget] = shake(target)

proxyTarget.a.b.c
console.log(shakedTarget) // { a: { b: { c: 1 } } }

proxyTarget.f
console.log(shakedTarget) // { a: { b: { c: 1 } }, f: 4 }
```

#### - `Vue3`

```html
<script setup>
  import { ref, onMounted } from 'vue'
  import { reactiveShake } from '@object-shake/vue'

  const target = ref({
    a: {
      b: { c: 1, d: 2 },
      e: 3
    },
    f: 4
  })

  const [proxyTarget, shakedTarget] = shake(target)

  onMounted(() => {
    console.log(shakedTarget) // { a: { b: { c: 1 } }, f: 4 }
  })
</script>

<template>
  <div>
    <span>{{ proxyTarget.a.b.c }}</span>
    <span>{{ proxyTarget.f }}</span>
  </div>
</template>
```

### Perf

- performance Test in Nuxt3: `shake state` vs `state` -> https://github.com/undermoonn/vue-reactive-shake-perf

### Roadmap

#### `@object-shake/vue`

- [ ] nested ref
- [ ] vue2 support
