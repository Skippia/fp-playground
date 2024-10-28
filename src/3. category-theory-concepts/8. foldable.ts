import * as A from 'fp-ts/lib/Array'
import * as F from 'fp-ts/lib/Foldable'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Tree'

const t = T.make(1, [T.make(2, []), T.make(3, []), T.make(4, [])])
const t2 = [1, 2, 3, 4]
const t3 = [O.some(1), O.some(2), O.some(3), O.some(4)]

const sum = pipe(
  t,
  F.reduceM(O.Monad, T.Foldable)(0, (acc, cur) => O.some(acc + cur))
)
// The same
const sum2 = pipe(
  t2,
  F.reduceM(O.Monad, A.Foldable)(0, (acc, cur) => O.some(acc + cur))
)

const sum3 = pipe(
  t2,
  A.reduce(0, (acc, cur) => (acc + cur))
)

const sum4 = pipe(
  t3,
  F.reduceM(O.Monad, A.Foldable)(0, (acc, cur) =>
    pipe(
      cur,
      O.map(n => acc + n)
    ))
)

// !!-------------------------------------------------------------------------------------------

const treeToArray = pipe(
  t,
  T.foldMap(A.getMonoid<number>())(A.of)
)

console.log('Sum:', sum) // Sum: 10
console.log('Sum:', sum2) // Sum: 10
console.log('Sum:', sum3) // Sum: 10
console.log('Sum:', sum4) // Sum: 10
console.log('Converting:', treeToArray) // Sum: 10
