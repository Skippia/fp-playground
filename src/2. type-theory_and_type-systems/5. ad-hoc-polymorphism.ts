/* eslint-disable no-redeclare */
/**
 * Ad-hoc polymorphism allows functions to operate on different types
 * through method overloading or interfaces, providing specific implementations for each type.
 * In TypeScript, this can be achieved via:
 *   — function overloading
 */

function add(a: number, b: number): number
function add(a: string, b: string): string
function add<T extends string | number>(a: T, b: T): string | number {
  if (typeof a === 'number' && typeof b === 'number') return a + b
  else if (typeof a === 'string' && typeof b === 'string') return a + b

  throw new Error('Invalid arguments. Both arguments must be of the same type (number or string).')
}

const sum = add(10, 20) // 30
const concatenated = add('foo', 'bar') // "foobar"

export {}
