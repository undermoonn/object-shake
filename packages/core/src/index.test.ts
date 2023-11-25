import { test, expect, describe } from 'vitest'
import { shake, reserve } from './index'

describe('object shake', () => {
  test('nested object', () => {
    const [p, s] = shake({ a: { b: 1, c: { d: 3 } }, c: 2 })
    expect(s()).toEqual({})
    p.a.b
    expect(s()).toStrictEqual({ a: { b: 1 } })
  })

  test('symbol key', () => {
    const key = Symbol()
    const [p, s] = shake({ a: { [key]: 1 }, c: 2 })
    p.a[key]
    expect(s()).toEqual({ a: {} })
  })

  test('access object value', () => {
    const [p, s] = shake({ a: { b: 1 } })
    p.a
    expect(s()).toEqual({ a: {} })
  })

  test('use Object.keys and forEach', () => {
    const [p, s] = shake({ a: 1 })
    Object.keys(p).forEach(() => {})
    expect(s()).toEqual({})
  })

  test('access null value', () => {
    const [p, s] = shake({ a: null })
    p.a
    expect(s()).toEqual({ a: null })
  })

  test('access function value', () => {
    const a = () => {}
    const [p, s] = shake({ a })
    p.a()
    expect(s()).toEqual({ a })
  })

  test('access symbol value', () => {
    const value = Symbol()
    const [p, s] = shake({ a: value })
    p.a
    expect(s()).toEqual({ a: value })
  })

  test('access undefined value', () => {
    const [p, s] = shake({ a: undefined })
    p.a
    expect(s()).toEqual({ a: undefined })
  })

  test('access boolean value', () => {
    const [p, s] = shake({ a: false })
    p.a
    expect(s()).toEqual({ a: false })
  })

  test('access array', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a[0]
    p.a[2]
    expect(s()).toEqual({ a: [1, undefined, 3] })
  })

  test('use array filter', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.filter(Boolean)
    expect(s()).toEqual({ a: [1, 2, 3, 4] })
  })

  test('use array find', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.findIndex((item) => item === 3)
    expect(s()).toEqual({ a: [1, 2, 3, undefined] })
  })

  test('use array findIndex', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.findIndex((item) => item === 3)
    expect(s()).toEqual({ a: [1, 2, 3, undefined] })
  })

  test('use array slice', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.slice(1)
    expect(s()).toEqual({ a: [undefined, 2, 3, 4] })
  })

  test('use array forEach', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.forEach(() => {})
    expect(s()).toEqual({ a: [1, 2, 3, 4] })
  })

  test('access array length', () => {
    const [p, s] = shake({ a: [1, 2, 3, 4] })
    p.a.length
    expect(s()).toEqual({ a: [undefined, undefined, undefined, undefined] })
  })

  test('target is array, access array index', () => {
    const [p, s] = shake([1, 2, 3, 4])
    expect(s()).toEqual([])
    p[1]
    expect(s()).toEqual([undefined, 2])
    p[3]
    expect(s()).toEqual([undefined, 2, undefined, 4])
  })

  test('target is array, access array length', () => {
    const [p, s] = shake([1, 2, 3, 4])
    expect(s()).toEqual([])
    p.length
    expect(s()).toEqual([])
  })
})

describe('reserve object', () => {
  test('basic', () => {
    const [p, s] = shake({ a: { b: 1, c: { d: 3 } }, c: [{ e: 1 }, 2] })
    expect(s()).toEqual({})
    reserve(p.a)
    expect(s()).toStrictEqual({ a: { b: 1, c: { d: 3 } } })
    reserve(p.c)
    expect(s()).toStrictEqual({ a: { b: 1, c: { d: 3 } }, c: [{ e: 1 }, 2] })
  })
})
