import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

/**
 * type Either<E,A> = Left<E> | Right<A>
 * type Left<E> = { readonly left: E }
 * type Right<A> = { readonly right: A }
 *
 * const left = <E, A = never>(e: E): Either<E,A> => ({ _tag: 'Left', left: e })
 * const right = <E = never, A>(a: A): Either<E,A> => ({ _tag: 'Right', left: a })
 */

/**
 * Imperative approach
 */
function divideTwoIfEvenImperative(num: number): number {
  if (num === 0) throw new Error('Cannot divide by zero')
  else if (num % 2 !== 0) throw new Error('Num is not even!')

  return 2 / num
}
/**
 * Functional approach (not ideal)
 */
function _divideTwoIfEven(num: number): O.Option<number> {
  if (num === 0) return O.none
  else if (num % 2 !== 0) return O.none

  return O.some(2 / num)
}
/**
 * Functional approach (not ideal)
 */
function __divideTwoIfEven(num: number): E.Either<string, number> {
  if (num === 0) return E.left('Cannot divide by zero')
  else if (num % 2 !== 0) return E.left('Num is not even!')

  return E.right(2 / num)
}
