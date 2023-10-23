import * as S from 'fp-ts/Semigroup'
/**
 * Magma is a Set (M) that is Closed under a Binary Operator (∘)
 * Magma is the most basic structure and is used to build more complex structures
 */
interface Magma<M> {
  concat: (x: M, y: M) => M
}
/**
 * Examples of magma:
 * (Integer) Addition,subtraction,multiplication operators
 * (Real numbers) Division
 * (Array, String) Concatenation operator
 */

/**
 * Semigroup is a Magma in which the binary operator is associative
 * Associative means that order of binary operator is not important
 * ! Semigroup gives us a way to distribute work between workers
 * Examples of semigroup:
 * (Integer) Addition,multiplication operators
 * (Array, String) Concatenation operator
 * ? Not examples:
 * (Integer) Subtraction [concat(3, concat(4, 5)) != concat(concat(3, 4), 5)] => 3-(4-5) != (3-4)-5 => 4 != -6
 * (Real numbers) Division
 * ----
 * There is one problem, what semigroup returns for method concatAll if our input is []? This problem solves monoid
 */

interface Semigroup<S> extends Magma<S> {}

/**
 * Monoid is a Semigroup in which there is Neutral Element (empty)
 * Neutral elements acts like an Identity for the binary operator - x ∘ empty = empty ∘ x = x
 * Examples:
 * - for Addition: 0
 * - for multiplication: 1
 * - for concatenation string: ""
 * - for concatenation string: []
 */

interface Monoid<M> extends Semigroup<M> {
  empty: M
}

// ====================================================================================================

import { List, cons, nil, match } from './13-list_linked-list'
import { pipe } from 'fp-ts/lib/function'

type AddAll = (xs: List<number>) => number
const addAll: AddAll = match(
  () => 0,
  (head: number, tail: List<number>) => head + addAll(tail)
)

addAll(cons(1, cons(2, cons(3, nil)))) // ?

type AppendAll = (xs: List<string>) => string
const appendAll: AppendAll = match(
  () => '',
  (head: string, tail: List<string>) => head + appendAll(tail)
)

appendAll(cons('hello', cons(' ', cons('world!', nil)))) // ?

const addSemigroup: S.Semigroup<number> = { concat: (x, y) => x + y }
const multiplySemigroup: S.Semigroup<number> = { concat: (x, y) => x * y }
const appendSemigroup: S.Semigroup<string> = { concat: (x, y) => x.concat(y) }

const concatAll =
  <A>(s: S.Semigroup<A>) =>
  (startWith: A) =>
  (xs: List<A>): A =>
    match(
      () => startWith,
      (head: A, tail: List<A>) => s.concat(head, concatAll(s)(startWith)(tail))
    )(xs)

concatAll(addSemigroup)(0)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll(multiplySemigroup)(1)(cons(2, cons(3, cons(4, nil)))) // ?
concatAll(appendSemigroup)('')(cons('hello', cons(' ', cons('world!', nil)))) // ?

// =====================================================
const addMonoid: Monoid<number> = { ...addSemigroup, empty: 0 }
const multiplyMonoid: Monoid<number> = { ...multiplySemigroup, empty: 1 }
const appendMonoid: Monoid<string> = { ...appendSemigroup, empty: '' }

const concatAll2 =
  <A>(m: Monoid<A>) =>
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
