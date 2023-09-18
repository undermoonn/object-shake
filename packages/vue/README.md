```vue
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

const [proxyTarget, shakedTarget] = reactiveShake(target)

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
