/* eslint-disable import/order */
/* eslint-disable import/first */
/* eslint-disable ts/no-redeclare */
/* eslint-disable no-redeclare */
/* eslint-disable style/max-len */
// -------------------------------------------------------------------

import * as E from 'fp-ts/Either'
import type { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/HKT'
import { pipe } from 'fp-ts/lib/function'
import type { Functor, Functor1, Functor2 } from 'fp-ts/lib/Functor'
import * as O from 'fp-ts/Option'

import type { _HKT, _Kind, _Kind2, _URIS, _URIS2 } from './25-kind-higher-kinded-type'
import type { _Functor, _Functor1, _Functor2 } from './26-type-class'

declare const _OptionFunctor: _Functor<'Option'>
declare const _OptionFunctor1: _Functor1<'Option'>
declare const OptionFunctor1: Functor1<'Option'>
declare const res: ReturnType<typeof _OptionFunctor.map>
declare const res1: ReturnType<typeof _OptionFunctor1.map>
declare const res2: ReturnType<typeof OptionFunctor1.map>

const incr = (a: number) => a + 1

const x = _OptionFunctor.map({ _URI: 'Option', _A: 13 }, incr)
const x1 = _OptionFunctor1.map(O.some(13), incr)
const x2 = OptionFunctor1.map(O.some(13), incr)

type map_option = <A, B>(f: (a: A) => B) => (fa: O.Option<A>) => O.Option<B>
type map_either = <E, A, B>(f: (a: A) => B) => (fa: E.Either<E, A>) => E.Either<E, B>

type map_option2 = _Functor1<'Option'>
type map_either2 = _Functor2<'Either'>

declare const EitherFunctor1: map_either
declare const EitherFunctor2: map_either2

const y1 = pipe(E.right(5), EitherFunctor1(incr))
const y11 = pipe(E.right(5), EitherFunctor1(incr))
const y2 = EitherFunctor2.map(E.left(new Error('hello')), incr)
const y22 = EitherFunctor2.map(E.left(new Error('hello')), incr)

// ---------------------------------------------------
// type _TLift = <F extends _URIS>(F: _Functor1<F>) => <A, B>(f: (a: A) => B) => (fa: _Kind<F, A>) => _Kind<F, B>
// const _lift: _TLift = F => f => fa => F.map(fa, f)

function lift<F extends URIS2>(F: Functor2<F>): <E, A, B>(f: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
function lift<F extends URIS>(F: Functor1<F>): <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
function lift<F>(F: Functor<F>): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
function lift<F>(F: Functor<F>): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B> {
  return f => fa => F.map(fa, f)
}

function _lift<F extends _URIS2>(F: _Functor2<F>): <E, A, B>(f: (a: A) => B) => (fa: _Kind2<F, E, A>) => _Kind2<F, E, B>
function _lift<F extends _URIS>(F: _Functor1<F>): <A, B>(f: (a: A) => B) => (fa: _Kind<F, A>) => _Kind<F, B>
function _lift<F>(F: _Functor<F>): <A, B>(f: (a: A) => B) => (fa: _HKT<F, A>) => _HKT<F, B>
function _lift<F>(F: _Functor<F>): <A, B>(f: (a: A) => B) => (fa: _HKT<F, A>) => _HKT<F, B> {
  return f => fa => F.map(fa, f)
}

const liftedIncr = lift(O.Functor)(incr)
const z1 = liftedIncr(O.some(5))
const z2 = liftedIncr(O.none)

const liftedIncr2 = lift(OptionFunctor1)(incr)
const z11 = liftedIncr2(O.some(5))
const z22 = liftedIncr2(O.none)

const _liftedIncr = _lift(O.Functor)(incr)
const _z1 = _liftedIncr(O.some(5))
const _z2 = _liftedIncr(O.none)

const __liftedIncr = _lift(OptionFunctor1)(incr)
const __z1 = __liftedIncr(O.some(5))
const __z2 = __liftedIncr(O.none)

const ___liftedIncr = _lift(E.Functor)(incr)
const ___z1 = ___liftedIncr(E.right(5))
const ___z2 = ___liftedIncr(E.left(new Error('some error')))

const ____liftedIncr = _lift(EitherFunctor2)(incr)
const ____z1 = ____liftedIncr(E.right(5))
const ____z2 = ____liftedIncr(E.left(new Error('some error')))

// --------------------------------------------------------------

import { cons, isNil, nil } from './13-list_linked-list'
import type { List } from './13-list_linked-list'

const mapList = <A, B>(fa: List<A>, f: (a: A) => B): List<B> =>
  isNil(fa) ? fa : cons(f(fa.head), mapList(fa.tail, f))

const ListFunctor1: _Functor1<'List'> = {
  URI: 'List',
  map: (fa, f) => mapList(fa, f)
}

const _____liftedIncr = _lift(ListFunctor1)(incr)
const _____z1 = _____liftedIncr(cons(1, cons(2, cons(3, nil))))
const _____z2 = _____liftedIncr(nil)

export { ListFunctor1 }
