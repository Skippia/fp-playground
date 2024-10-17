/* eslint-disable import/namespace */
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as M from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'

// Define a custom monoid for string concatenation
const stringConcatenationMonoid: M.Monoid<string> = {
  concat: (x, y) => x + y, // Binary operation: String concatenation
  empty: '---' // Identity element: Empty string
}

// Using the built-in monoid for strings
const builtInStringMonoid: M.Monoid<string> = S.Monoid
const builtInSumMonoid: M.Monoid<number> = N.MonoidSum

console.log(M.concatAll(stringConcatenationMonoid)(['Hello', 'world', '!']))
console.log(M.concatAll(builtInStringMonoid)(['Functional', 'programming']))
console.log(M.concatAll(builtInSumMonoid)([99, 1, 100]))

// -------------------------------------------------------------

function getProxyMonoid<A>(M: M.Monoid<A>): M.Monoid<A> {
  return {
    concat: (x, y) => M.concat(x, y),
    empty: M.empty
  }
}

export function replicate(n: number, mv: string) {
  const replicateValue = RA.replicate(n, mv)
  // const monoid = getProxyMonoid(stringConcatenationMonoid)
  const monoid = stringConcatenationMonoid

  return M.concatAll(monoid)(replicateValue)
}

const randomInt = (low: number, high: number) => Math.floor((high - low + 1) * Math.random() + low)

export const printFib = pipe(
  randomInt(0, 9),
  O.of,
  O.map(el => replicate(3, `${el}`))
) // ?

console.log(printFib)
// -------------------------------------------------------------
