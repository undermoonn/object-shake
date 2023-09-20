```js
import { shake } from '@object-shake/core'

const target = {
  a: {
    b: { c: 1, d: 2 },
    e: 3
  },
  f: 4
}

const [proxyTarget, getShakedTarget] = shake(target)

proxyTarget.a.b.c
console.log(getShakedTarget()) // { a: { b: { c: 1 } } }

proxyTarget.f
console.log(getShakedTarget()) // { a: { b: { c: 1 } }, f: 4 }
```
