/**
 * ? Another combinator, contramap:
 * ? given an instance of Eq for A and a function from B to A, we can derive an instance of Eq for B
 */

import type { Eq } from 'fp-ts/Eq'
import { contramap as _contramap, fromEquals } from 'fp-ts/Eq'

type User = {
  id: number
}

const contramap: <A, B>(f: (b: B) => A) => (E: Eq<A>) => Eq<B>
  = <A, B>(f: (b: B) => A) =>
    (E: Eq<A>): Eq<B> =>
      fromEquals((x, y) => E.equals(f(x), f(y)))

const numberEq: Eq<number> = {
  equals: (a, b) => a === b
}
/**
 * They are the same
 */
// const eqUser: Eq<User> = contramap((user: User) => user.id)(N.Eq)
const eqUser: Eq<User> = contramap((user: User) => user.id)(numberEq)

function getEq<A>(E: Eq<A>): Eq<ReadonlyArray<A>> {
  return fromEquals(
    (xs, ys) =>
      /* returns boolean */
      xs.every((x, i) => E.equals(x, ys[i]!))
  )
}

/**
 * They are the same
 */
// const eqUsers: Eq<Array<User>> = RA.getEq(eqUser)
const eqUsers: Eq<Array<User>> = getEq(eqUser)

// --------------------------

eqUser.equals({ id: 1 }, { id: 1 }) // ?

eqUsers.equals(
  [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
) // ?
