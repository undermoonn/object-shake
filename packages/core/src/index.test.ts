import { test, expect, describe } from 'vitest'
import { shake } from './index'

describe('[core] test', () => {
  test('base', () => {
    const [p, s] = shake({ a: { b: 1 }, c: 2 })
    expect(s).toEqual({})
    p.a.b
    expect(s).toEqual({ a: { b: 1 } })
  })
})

describe('[core] options test', () => {
  test('default onKeySet', () => {
    const [p, s] = shake(
      { a: { b: 1 }, c: 2 },
      {
        walkOptions: {
          onKeySet: (keyPath) => keyPath
        }
      }
    )
    expect(s).toEqual({})
    p.a.b
    expect(s).toEqual({ a: { b: 1 } })
  })
})

describe('[core] key test', () => {
  test('symbol key', () => {
    const key = Symbol()
    const [p, s] = shake({ a: { [key]: 1 }, c: 2 })
    p.a[key]
    expect(s).toEqual({})
  })

  test('symbol key with collectSymbolKey enable', () => {
    const key = Symbol()
    const [p, s] = shake({ a: { [key]: 1 }, c: 2 }, { walkOptions: { collectSymbolKey: true } })
    expect(s).toEqual({})
    p.a[key]
    expect(s).toEqual({ a: { [key]: 1 } })
  })
})

describe('[core] value test', () => {
  test('null value', () => {
    const [p, s] = shake({ a: null })
    p.a
    expect(s).toEqual({ a: null })
  })

  test('function value', () => {
    const a = () => {}
    const [p, s] = shake({ a })
    p.a()
    expect(s).toEqual({ a })
  })

  test('undefined value', () => {
    const [p, s] = shake({ a: undefined })
    p.a
    expect(s).toEqual({ a: undefined })
  })
})
