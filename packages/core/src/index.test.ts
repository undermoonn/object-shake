import { test, expect, describe } from 'vitest'
import { shake } from '.'

describe('[preview core] test', () => {
  test('base', () => {
    const [p, s] = shake({ a: { b: 1 }, c: 2 })
    expect(s()).toEqual({})
    p.a.b
    expect(s()).toStrictEqual({ a: { b: 1 } })
  })
})

describe('[preview core] key test', () => {
  test('symbol key', () => {
    const key = Symbol()
    const [p, s] = shake({ a: { [key]: 1 }, c: 2 })
    p.a[key]
    expect(s()).toEqual({})
  })
})

describe('[preview core] value test', () => {
  test('null value', () => {
    const [p, s] = shake({ a: null })
    p.a
    expect(s()).toEqual({ a: null })
  })

  test('function value', () => {
    const a = () => {}
    const [p, s] = shake({ a })
    p.a()
    expect(s()).toEqual({ a })
  })

  test('undefined value', () => {
    const [p, s] = shake({ a: undefined })
    p.a
    expect(s()).toEqual({ a: undefined })
  })

  test('array value', () => {
    const [p, s] = shake({ a: { b: [1] } })
    p.a.b[0]
    expect(s()).toEqual({ a: { b: [1] } })
  })
})
