import { pipe } from 'fp-ts/lib/function'

import { cons, match, nil } from '@shared/linked-list'
import type { List } from '@shared/linked-list'

import { addSemigroup, appendSemigroup, multiplySemigroup } from './9. semigroup'
import type { Semigroup } from './9. semigroup'

type Monoid<M> = {
  empty: M
} & Semigroup<M>

const addMonoid: Monoid<number> = { ...addSemigroup, empty: 0 }
const multiplyMonoid: Monoid<number> = { ...multiplySemigroup, empty: 1 }
const appendMonoid: Monoid<string> = { ...appendSemigroup, empty: '' }

const concatAll2
  = <A>(m: Monoid<A>) =>
    (xs: List<A>): A =>
      match(
        () => m.empty,
        (head: A, tail: List<A>) => m.concat(head, concatAll2(m)(tail))
      )(xs)

concatAll2(addMonoid)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll2(multiplyMonoid)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll2(appendMonoid)(cons('hello', cons(' ', cons('world!', nil)))) // ?

// or

pipe(
  cons(2, cons(3, cons(4, nil))), //
  concatAll2(addMonoid)
) // ?
