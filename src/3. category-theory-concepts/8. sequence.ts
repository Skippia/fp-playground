import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Tree'

const t = [O.some(1), O.some(2), O.some(3), O.some(4)]
const t2 = T.make(O.some(1), [T.make(O.some(2), []), T.make(O.some(3), []), T.make(O.some(4), [])])

// Array<HKT> --> HKT<Array>
// or
// [O.some(1), O.some(2), O.some(3), O.some(4)]
// -->
// O.some([1,2,3,4])
const a = A.sequence(O.Applicative)(t)
const b = pipe(
  t,
  A.sequence(O.Applicative),
  O.map(ns => pipe(
    ns,
    A.reduce(0, (acc, cur) => (acc + cur))
  ))
)
const c = T.sequence(O.Applicative)(t2)

console.log(a) //* O.some([1,2,3,4])
console.log(b) //* O.some(10)
/**
  O.some({
    value: 1,
    forest: [
      { value: 2, forest: [] },
      { value: 3, forest: [] },
      { value: 4, forest: [] }
    ]
  })
 */
console.log(c)

// ------------------------------
