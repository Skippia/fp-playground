import { Eq, fromEquals } from 'fp-ts/Eq'

/**
 * ? The getEq combinator: given an instance of Eq for A,
 * ? we can derive an instance of Eq for ReadonlyArray<A>
 */
export function getEq<A>(E: Eq<A>): Eq<ReadonlyArray<A>> {
  /**
   * They are the same
   */
  // return {
  //   equals: (xs, ys) => xs.every((x, i) => E.equals(x, ys[i])),
  // }
  return fromEquals((xs, ys) => xs.every((x, i) => E.equals(x, ys[i])))
}

export const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
}

// derived (the same)
export const eqNumbers: Eq<ReadonlyArray<number>> = getEq(eqNumber)
export const eqNumbers2: Eq<ReadonlyArray<number>> = {
  equals: (xs, ys) => xs.every((x, i) => eqNumber.equals(x, ys[i])),
}

// derived derived(the same)
export const eqNumbersNumbers: Eq<ReadonlyArray<ReadonlyArray<number>>> = getEq(eqNumbers)
export const eqNumbersNumbers2: Eq<ReadonlyArray<ReadonlyArray<number>>> = {
  equals: (xs, ys) =>
    xs.every((x, i) => (xs, ys) => xs.every((x, i) => eqNumber.equals(x, ys[i])).equals(x, ys[i])),
}
// ...etc

eqNumbers.equals([1, 2, 3], [1, 2, 4]) // ?

eqNumbers.equals([1, 2, 3], [1, 2, 3]) // ?
eqNumbers2.equals([1, 2, 3], [1, 2, 3]) // ?

eqNumbersNumbers.equals(
  [
    [1, 2],
    [3, 4],
  ],
  [
    [1, 2],
    [3, 4],
  ]
) // ?
eqNumbersNumbers2.equals(
  [
    [1, 2],
    [3, 4],
  ],
  [
    [1, 2],
    [3, 4],
  ]
) // ?
