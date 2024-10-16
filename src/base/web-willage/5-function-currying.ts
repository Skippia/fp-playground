/**
 * In fp functions only receive one input
 * Functions that receive only one input are called Unary function
 */

function normalSum(a: number, b: number) {
  return a + b
}

type Sum = (a: number) => (b: number) => number
const sum: Sum = a => b => a + b

type Curry2 = <A, B, Z>(f: (a: A, b: B) => Z) => (a: A) => (b: B) => Z
const curry2: Curry2 = f => a => b => f(a, b)

const sum2 = curry2(normalSum)

const x = sum2(1)(2)
