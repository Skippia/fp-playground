/**
 * Functor preserves a structure
 * f.e mapping from Category C to Category D, where a ∈ C and b ∈ D:
 * a --F-> Fa (mapping from a to Fa via F)
 */

/**
 * Functor is a mapping between Categories that preserves a structure
 * - map objects
 * - map arrows
 * - preserve identity arrows
 * - preserve composition of arrows
 *
 * Functor formalize the concept of recognizing a pattern in a structure
 */

/**
 * interface Functor<F> {
 *   map: <A,B, ...>(f: A => B) => F<..., A> => F<..., B>
 * }
 */

import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

import type { List } from './13-list_linked-list'
import { cons, match as matchList, nil, showList } from './13-list_linked-list'

type StrLength = (x: string) => number
const strLength: StrLength = x => x.length

strLength('abcd') // ?

type OptionStrLength = (Fx: O.Option<string>) => O.Option<number>
// Kinda adapter
const strLength1: OptionStrLength = O.match(
  () => O.none,
  (value: string) => O.some(strLength(value))
)

strLength1(O.some('abcd')) // ?
strLength1(O.none) // ?

// ========================================
type Increment = (x: number) => number
const increment: Increment = x => x + 1

type OptionIncrement = (Fx: O.Option<number>) => O.Option<number>
// Kinda adapter
const increment1: OptionIncrement = O.match(
  () => O.none,
  value => O.some(increment(value))
)

increment1(O.some(12)) // ?
increment1(O.none) // ?

// ========================================

type MapOption = <A, B>(f: (x: A) => B) => (Fx: O.Option<A>) => O.Option<B>
// Kinda universal adapter
const mapOption: MapOption = f =>
  O.match(
    () => O.none,
    value => O.some(f(value))
  )

const strLength2 = mapOption(strLength)
const increment2 = mapOption(increment)

strLength2(O.some('abcd')) // ?
strLength2(O.none)

increment2(O.some(12)) // ?
increment2(O.none)

// ========================================

/**
 * Flow = composition
 */
const incrementLength = flow(strLength, increment)

incrementLength('abcd') // ?

const function1 = flow(mapOption(strLength), mapOption(increment))
const function2 = mapOption(flow(strLength, increment))
const function3 = O.map(flow(strLength, increment))

function1(O.some('abcd')) // ?
function2(O.some('abcd')) // ?

function1(O.none) // ?
function2(O.none) // ?

// ========================================
// List<A>

const list1: List<string> = cons('a', cons('bb', cons('ccc', nil)))

type MapList = <A, B>(f: (x: A) => B) => (Fx: List<A>) => List<B>
// Kinda adapter (functor)
const mapList: MapList = f =>
  matchList(
    () => nil,
    (head, tail) => cons(f(head), mapList(f)(tail))
  )

const strLength3 = mapList(strLength)
showList(strLength3(list1)) // ?

const increment3 = mapList(increment)

// F g ∘ F f
const incrLength = flow(mapList(strLength), mapList(increment))
const _incrLength = flow(strLength3, increment3)
// F (g ∘ F)
const __incrLength = flow(mapList(flow(strLength, increment)))

console.log(showList(incrLength(list1)))

// E.Either<E,A>

type MapEither = <A, B, E>(f: (x: A) => B) => (Fx: E.Either<E, A>) => E.Either<E, B>
const mapEither: MapEither = f =>
  E.match(
    e => E.left(e),
    a => E.right(f(a))
  )

const increment4 = mapEither(increment)
increment4(E.right(12)) // ?
increment4(E.left('ERROR')) // ?

const strLength4 = mapEither(strLength)
strLength4(E.right('abcd')) // ?
strLength4(E.left('ERROR')) // ?

// ========================================
/**
 * O.Option<A>
 * List<A>
 * E.Either<E,A>
 * ---
 * Universal map functor would have such signature:
 * type Map = <A,B,...>(f: A => B) => F<...,A> => F<...,B>
 */
