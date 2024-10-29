import type { _HKT, _Kind, _Kind2, _URIS, _URIS2 } from './2. higher-kinded-types(HKT-s)'

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
  URI: F // Option
  map: <A, B>(fa: _Kind<F, A>, f: (a: A) => B) => _Kind<F, B>
  // map: <A, B>(fa: O.Option<A>, f: (a: A) => B) => O.Option<B>

}

type _Functor2<F extends _URIS2> = {
  URI: F // 'Either'
  map: <E, A, B>(fa: _Kind2<F, E, A>, f: (a: A) => B) => _Kind2<F, E, B>
  // map: <A, B>(fa: E.Either<E,A>, f: (a: A) => B) => E.Either<E,B>
}

export type { _Functor, _Functor1, _Functor2 }
