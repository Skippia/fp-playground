import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { List, isNil, myList, myListEmpty, showList } from './13-list_linked-list'

// Option

type OMatchW = <A, B, C>(onNone: () => B, onSome: (a: A) => C) => (x: O.Option<A>) => B | C

const omatchW: OMatchW = (onNone, onSome) => (x) => (O.isNone(x) ? onNone() : onSome(x.value))

const maybeNumber: O.Option<number> = O.some(42)
const maybeNumber2: O.Option<number> = O.none

pipe(
  maybeNumber,
  omatchW(
    () => 0,
    (a: number) => `num is ${a}`
  )
) // ?

pipe(
  maybeNumber2,
  omatchW(
    () => 0,
    (a: number) => `num is ${a}`
  )
) // ?

// Either

type EMatch = <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B) => (x: E.Either<E, A>) => B
const ematch: EMatch = (onLeft, onRight) => (x) => (E.isLeft(x) ? onLeft(x.left) : onRight(x.right))

// List

// The same as in 13-list_linked-list
type LMatch = <A, B>(onNil: () => B, onCons: (head: A, tail: List<A>) => B) => (xs: List<A>) => B
const lmatch: LMatch = (onNil, onCons) => (xs) => (isNil(xs) ? onNil() : onCons(xs.head, xs.tail))

pipe(
  myList,
  lmatch(
    () => 'empty',
    (head, tail) => `head: ${head}, tail: ${showList(tail)}`
  )
)

pipe(
  myListEmpty,
  lmatch(
    () => 'empty',
    (head, tail) => `head: ${head}, tail: ${showList(tail)}`
  )
) // ?
