/**
 * Parametric polymorphism allows functions and data types
 * to be written generically so that they can handle values uniformly
 * without depending on their type.
 * Can be achieved via:
 *   — generics
 */

// 1. Generic identity function
function identity<T>(value: T): T {
  return value
}

const num = identity(42) // num: number
const str = identity('hello') // str: string
const arr = identity([1, 2, 3]) // arr: number[]

// 2. Generic data structures
class Box<A> {
  constructor(public value: A) {}
  map<B>(fn: (x: A) => B): Box<B> {
    return new Box(fn(this.value))
  }
}

const incrBox1 = new Box(5).map(n => n + 1)
const incrBox2 = new Box(true).map(n => Number(n) + 1)

console.log(incrBox1.value) // 6
console.log(incrBox2.value) // 2

export {}
