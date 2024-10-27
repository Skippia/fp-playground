/**
 * [Definition]:
 * Type class is a pattern which allows to abstract some logic from data structure.
 * A type class defines a set of functions (methods) that can be implemented by types.
 * They are a way to define behavior that can be shared across different types.
  * !!! The crux is that there are some structures (objects) and there is some behavior which is exist out of these structures
 * [Analogy]: Similar to interfaces in object-oriented programming but used to achieve ad-hoc polymorphism.
 * ------------------------------------------------------------------------------------------------
 * [Common Type Classes]
 * Functor: Types that can be mapped over.
 * Monad: Types that support chaining operations (bind or flatMap).
 * Applicative: Types that allow applying functions wrapped in the context to values wrapped in the context.
 * ------------------------------------------------------------------------------------------------
 * Ad-hoc polymorphism on type level (specifies different behaviors base on the input type)
 * This leads to a way of organizing code, known as Strategy Pattern.
 * ------------------------------------------------------------------------------------------------
 * Type Class is a tool in the `Kind Universe`, which allows us to have `Ad-hoc Polymorphism`
 * `Type Class Instance` is an implementation of a `Type Class` for a Type or a Type Constructor
 * ------------------------------------------------------------------------------------------------
 */

import type { _HKT, _Kind, _Kind2, _URIS, _URIS2 } from './25-kind-higher-kinded-type'

type Show<A> = {
  toString: (a: A) => string
}

const numShow: Show<number> = { toString: a => a.toString() }
const strShow: Show<string> = { toString: a => a }
const boolSHo: Show<number> = { toString: a => (a ? 'Yes' : 'No') }

// ----------------------------------------------------------------------------

// Functor type class
type _Functor<F> = {
  map: <A, B>(fa: _HKT<F, A>, f: (a: A) => B) => _HKT<F, B>
  // map: <A, B>(fa: { _URI: 'Option', _A: Option<A> }, f: (a: A) => B) => { _URI: 'Option', _A: Option<B> }
}

type _Functor1<F extends _URIS> = {
  URI: F
  map: <A, B>(fa: _Kind<F, A>, f: (a: A) => B) => _Kind<F, B>
}

type _Functor2<F extends _URIS2> = {
  URI: F // 'Either'
  map: <E, A, B>(fa: _Kind2<F, E, A>, f: (a: A) => B) => _Kind2<F, E, B>
  // map: <A, B>(fa: E.Either<E,A>, f: (a: A) => B) => E.Either<E,B>
}

export type { _Functor, _Functor1, _Functor2 }

///


