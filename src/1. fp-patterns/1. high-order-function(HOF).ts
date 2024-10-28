/**
 * High order function is function that
 * - Takes one or more functions as parameters or
 * - Returns a function
 */

// A function that returns another function to multiply by a given factor
type TMultiply = (factor: number) => TDouble
type TDouble = (val: number) => number

const multiplyBy: TMultiply = factor => val => factor * val

// Usage
const val = multiplyBy(2)(100) // 200

console.log(val)

export {}
