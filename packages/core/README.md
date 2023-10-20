```js
import { shake } from '@object-shake/core'

const [proxy, getShaked] = shake({
  a: {
    b: { c: 1, d: 2 },
    e: 3
  },
  f: 4
})

proxy.a.b.c
console.log(getShaked()) // { a: { b: { c: 1 } } }

proxy.f
console.log(getShaked()) // { a: { b: { c: 1 } }, f: 4 }
```
