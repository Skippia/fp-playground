import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
/**
 * inverseHead = inverseHead2 = inverseHead3
 */

export function head<A>(as: ReadonlyArray<A>): O.Option<A> {
  return as[0] === undefined ? O.none : O.some(as[0])
}

const inverse = (x: number): O.Option<number> => (x === 0 ? O.none : O.some(1 / x))
const inverseHead = (arr: ReadonlyArray<number>) =>
  pipe(
    arr, // [...]
    head, // Option<number>
    O.map(inverse), //  Option<Option<number>>
    O.flatten // Option<number>
  )

const inverseHead2 = (arr: ReadonlyArray<number>) =>
  pipe(
    arr, // [...]
    head, // Option<number>
    O.chain(inverse)
  )

const inverseHead3 = (arr: ReadonlyArray<number>) =>
  pipe(
    arr, // [...]
    head, // Option<number>
    O.flatMap(inverse)
  )

inverseHead([]) // ?
inverseHead([1, 2, 3]) // ?

inverseHead2([]) // ?
inverseHead2([1, 2, 3]) // ?

inverseHead3([]) // ?
inverseHead3([1, 2, 3]) // ?
