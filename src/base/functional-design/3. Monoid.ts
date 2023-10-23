import * as M from 'fp-ts/Monoid'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

// Define a custom monoid for string concatenation
const stringConcatenationMonoid: M.Monoid<string> = {
  concat: (x, y) => x + y, // Binary operation: String concatenation
  empty: '---', // Identity element: Empty string
}

// Using the built-in monoid for strings
const builtInStringMonoid: M.Monoid<string> = M.monoidString
const builtInSumMonoid: M.Monoid<number> = M.monoidSum

M.concatAll(stringConcatenationMonoid)(['Hello, ', 'world', '!']) // ?
M.concatAll(builtInStringMonoid)(['Functional', ' programming']) // ?
M.concatAll(builtInSumMonoid)([99, 1, 100]) // ?

// -------------------------------------------------------------

function getProxyMonoid<A>(M: M.Monoid<A>): M.Monoid<A> {
  return {
    concat: (x, y) => M.concat(x, y),
    empty: M.empty,
  }
}

export function replicate(n: number, mv: string) {
  const replicateValue = RA.replicate(n, mv) // ?
  const monoid = getProxyMonoid(stringConcatenationMonoid)

  return M.concatAll(monoid)(replicateValue)
}

const randomInt = (low: number, high: number) => Math.floor((high - low + 1) * Math.random() + low)

export const printFib = pipe(
  randomInt(30, 35),
  O.of,
  O.map((el) => replicate(3, `${el}`))
) // ?

// -------------------------------------------------------------
