```vue
<script setup>
import { ref, onMounted } from 'vue'
import { shakeMaybeRef } from '@object-shake/vue'

const target = ref({
  a: {
    b: { c: 1, d: 2 },
    e: 3
  },
  f: 4
})

const [proxy, getShaked] = shakeMaybeRef(target)

onMounted(() => {
  console.log(getShaked()) // { a: { b: { c: 1 } }, f: 4 }
})
</script>

<template>
  <div>
    <span>{{ proxy.a.b.c }}</span>
    <span>{{ proxy.f }}</span>
  </div>
</template>
```
