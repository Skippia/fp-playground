/* eslint-disable ts/consistent-type-definitions */
import { getFunctorComposition } from 'fp-ts/lib/Functor'
import * as O from 'fp-ts/Option'

import { cons, isNil, nil } from '@shared/linked-list'
import type { List } from '@shared/linked-list'

import type { _Functor1 } from '../2. type-theory_and_type-systems/3.1. type-classes'

const mapList = <A, B>(fa: List<A>, f: (a: A) => B): List<B> =>
  isNil(fa) ? fa : cons(f(fa.head), mapList(fa.tail, f))

const ListFunctor1: _Functor1<'List'> = {
  URI: 'List',
  map: (fa, f) => mapList(fa, f)
}

type Double = (x: number) => number

const double: Double = x => x * 2

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly List: List<A>
  }
}
const optionListFunctor = getFunctorComposition(O.Functor, ListFunctor1)
const optionListFunctorAlt = (xs: O.Option<List<number>>) =>
  O.Functor.map(xs, x => ListFunctor1.map(x, double))

// ----------------------------------------------------------------------------------------------
const data2: O.Option<List<number>> = O.some(cons(1, cons(2, cons(3, nil))))
const data3: O.Option<List<number>> = O.none

const a = optionListFunctor.map(data2, double)
const a2 = optionListFunctor.map(data3, double)

const b = optionListFunctorAlt(data2)
const b2 = optionListFunctorAlt(data3)

console.dir({ a, a2, b, b2 })
