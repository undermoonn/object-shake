import { ref, reactive } from '@vue/reactivity'
import { test, expect, describe } from 'vitest'
import { shakeMaybeRef } from '.'

describe('shake object of vue', () => {
  test('ref', () => {
    const [p, s] = shakeMaybeRef(ref({ a: { b: 1 }, c: 2 }))
    expect(s()).toEqual({})
    p.value.a.b
    expect(s()).toEqual({ a: { b: 1 } })
  })

  test('reactive', () => {
    const [p, s] = shakeMaybeRef(reactive({ a: { b: 1 }, c: 2 }))
    expect(s()).toEqual({})
    p.a.b
    expect(s()).toEqual({ a: { b: 1 } })
  })
})
