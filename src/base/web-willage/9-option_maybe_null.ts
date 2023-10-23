/**
 * Cardinality of a type is the number of elements that type has
 * Cardinality: |MaybeInteger| = |Integer| + 1
 * type MaybeInteger = Integer | null
 * ----
 * ! Concept idea:
 * type Option<A> = Some<A> | None // * Maybe
 * type Some<A> = { value : A } //* Just
 * type None = typeof none // * Nothing
 */

import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/lib/function'

/**
 * ! Implementation in fp-ts
 */

type Option<A> = Some<A> | None

interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

interface None {
  readonly _tag: 'None'
}

const some = <A>(a: A): Some<A> => ({ _tag: 'Some', value: a })
const none: Option<never> = { _tag: 'None' }

function divide2(x: number): number {
  return 2 / x
}

function increment(x: number): number {
  return x + 1
}

const chopBumpV1 = flow(divide2, increment) // it's wrong because divide2 is partial function

chopBumpV1(0) // ?
chopBumpV1(8) // ?
// -------------------------------------------------------------------------------
function divide2Save(x: number): Option<number> {
  if (x !== 0) {
    return O.some(2 / x)
  }

  return O.none
}

const chopBumpV2 = flow(divide2Save, (x: O.Option<number>) =>
  O.isNone(x) ? none : O.some(increment(x.value))
) // it's wrong because divide2 is partial function

chopBumpV2(0) // ?
chopBumpV2(8) // ?
