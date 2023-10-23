/**
 * ? zip *
 * ? findFirst
 * ? findLast
 * ? deleteAt
 * ? updateAt
 * ? concat
 * ? every
 * ? some
 * ? isNotEmpty
 * ? map *
 * ? filter
 * ? filterMap
 * ? reduce *
 * ? sequence
 * ? mapWithIndex
 * ? exists
 * ? partition
 * ? findFirstMap
 * ? fromPredicate
 */

import * as A from 'fp-ts/Array'
import { flow, pipe } from 'fp-ts/lib/function'
/**
 * ! Zip, map, reduce
 * ? Pretty bad example and we going to refactor it
 * [0,8,3]
 * [1,2,7]
 *
 * [1,8,7] => 16
 */
function doSomething(arr1: Array<number>, arr2: Array<number>): number {
  const n = Math.min(arr1.length, arr2.length) //
  let total = 0

  for (let i = 0; i < n; i++) {
    total += Math.max(arr1[i], arr2[i])
  }

  return total
}

function doSomethingFunctionalize(arr1: Array<number>, arr2: Array<number>): number {
  const zipped = A.zip(arr2)(arr1)
  const maxxed = A.map((pair: number[]) => Math.max(...pair))(zipped)
  const total = A.reduce(0, (a: number, b: number) => a + b)(maxxed)

  return total
}

function composeSometing(arr1: Array<number>, arr2: Array<number>): number {
  return pipe(
    A.zip(arr1, arr2),
    A.map((pair) => Math.max(...pair)),
    A.reduce(0, (a, b) => a + b)
  )
}

function pipeVsFlow(word: string) {
  /**
   * * const f = <A>(a: A) => pipe(a, g1, g2, g3, ...gs)
   * * can be replaced with
   * * const f2 = flow(g1, g2, g3, ...gs)
   * ------------------------
   *  const flow =
   *     <A, B, C>(
   *       f: (a: A) => B,
   *       g: (b: B) => C
   *  ) =>
   *    (a: A): C =>
   *       g(f(a))
   */

  const trim = (s: string) => s.trim()
  const size = (s: string) => s.length
  const isAtLeast3 = (n: number) => n >= 3

  const isValidPipe = (s: string) => pipe(s, trim, size, isAtLeast3)
  const isValidFlow = flow(trim, size, isAtLeast3)

  /**
   * Both of them are equal
   */
  const a = isValidPipe(word) // ?
  const b = isValidFlow(word) // ?
}

doSomething([0, 8, 3], [1, 2, 7])
doSomethingFunctionalize([0, 8, 3], [1, 2, 7])
composeSometing([0, 8, 3], [1, 2, 7])
pipeVsFlow('random')
