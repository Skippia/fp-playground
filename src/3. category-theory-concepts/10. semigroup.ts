import type * as S from 'fp-ts/Semigroup'

import { cons, match, nil } from '@shared/linked-list'
import type { List } from '@shared/linked-list'

import type { Magma } from './9. magma'

type Semigroup<X> = {} & Magma<X>

const addSemigroup: S.Semigroup<number> = { concat: (x, y) => x + y }
const multiplySemigroup: S.Semigroup<number> = { concat: (x, y) => x * y }
const appendSemigroup: S.Semigroup<string> = { concat: (x, y) => x.concat(y) }

const concatAll
  = <A>(s: S.Semigroup<A>) =>
    (startWith: A) =>
      (xs: List<A>): A =>
        match(
          () => startWith,
          (head: A, tail: List<A>) => s.concat(head, concatAll(s)(startWith)(tail))
        )(xs)

concatAll(addSemigroup)(0)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll(multiplySemigroup)(1)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll(appendSemigroup)('')(cons('hello', cons(' ', cons('world!', nil)))) // ?

export type { Semigroup }
export { addSemigroup, appendSemigroup, multiplySemigroup }
