import * as A from 'fp-ts/Array'
import * as Eq from 'fp-ts/Eq'
import { pipe } from 'fp-ts/lib/function'

/**
 * ? The getEq combinator: given an instance of Eq for A,
 * ? we can derive an instance of Eq for ReadonlyArray<A>
 */
export function getEq<A>(E: Eq.Eq<A>): Eq.Eq<ReadonlyArray<A>> {
  /**
   * They are the same
   */
  // return {
  //   equals: (xs, ys) => xs.every((x, i) => E.equals(x, ys[i])),
  // }
  return Eq.fromEquals((xs, ys) => xs.every((x, i) => E.equals(x, ys[i] as A)))
}

export const eqNumber: Eq.Eq<number> = {
  equals: (x, y) => x === y
}

// derived (the same)
export const eqNumbers: Eq.Eq<ReadonlyArray<number>> = getEq(eqNumber)
export const eqNumbers2: Eq.Eq<ReadonlyArray<number>> = {
  equals: (xs, ys) => xs.every((x, i) => eqNumber.equals(x, ys[i]!))
}

type ROArr<A> = ReadonlyArray<A>
type ROArr2<A> = ReadonlyArray<ROArr<A>>

// derived derived(the same)
// export const eqNumbersNumbers: Eq<ROArr2<number>> = getEq(eqNumbers)
export const eqNumbersNumbers: Eq.Eq<ROArr2<number>> = getEq(
  getEq({
    equals: (x, y) => x === y
  })
)

export const eqNumbersNumbers2: Eq.Eq<ROArr2<number>> = {
  equals: (xs, ys) => xs.every((x, i) => x.every((x2, i2) => eqNumber.equals(x2, ys[i]![i2]!)))
}

eqNumbers.equals([1, 2, 3], [1, 2, 4]) // ?

eqNumbers.equals([1, 2, 3], [1, 2, 3]) // ?
eqNumbers2.equals([1, 2, 3], [1, 2, 3]) // ?

const a = eqNumbersNumbers.equals(
  [
    [1, 2],
    [3, 4]
  ],
  [
    [1, 2],
    [3, 4]
  ]
) // ?
const b = eqNumbersNumbers2.equals(
  [
    [1, 2],
    [3, 4]
  ],
  [
    [1, 2],
    [3, 4]
  ]
) // ?

console.log(a)
console.log(b)

// ----------------------------------------------------------

type User = {
  readonly name: string
  readonly age: number
}

const eqUser = Eq.getStructEq<User>({
  age: Eq.eqNumber,
  name: Eq.eqString
})

const users: User[] = [
  { age: 1, name: 'Heh' },
  { age: 1000000, name: 'Absolute' },
]

const me: User = { age: 1000000, name: 'Absolute' }

const _isPresent = pipe(users, A.elem(eqUser)(me))
const isPresent = A.elem(eqUser)(me)(users)
