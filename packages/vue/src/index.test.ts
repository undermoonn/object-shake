import { ref, reactive } from '@vue/reactivity'
import { test, expect, describe } from 'vitest'
import { reactiveShake } from './index'

describe('[vue] test', () => {
  test('ref shake base', () => {
    const [p, s] = reactiveShake(ref({ a: { b: 1 }, c: 2 }))
    expect(s).toEqual({})
    p.value.a.b
    expect(s).toEqual({ a: { b: 1 } })
  })

  test('reactive shake base', () => {
    const [p, s] = reactiveShake(reactive({ a: { b: 1 }, c: 2 }))
    expect(s).toEqual({})
    p.a.b
    expect(s).toEqual({ a: { b: 1 } })
  })
})
