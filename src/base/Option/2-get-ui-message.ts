/**
 * * type _Option = Some<A> | None
 * * type _Nullable<A> = A | null | undefined
 */
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

const inverse = (x: number): O.Option<number> => (x === 0 ? O.none : O.some(1 / x))

inverse(0) // ?
inverse(2) // ?

const getUIMessageWithInverse = (x: number): string =>
  pipe(
    x,
    inverse,
    O.match(
      () => `Cannot get the inverse of ${x}`,
      (ix) => `The inverse of ${x} is ${ix}`
    )
  )
const getUIMessageWithInverseOtherType = (x: number): number | string =>
  pipe(
    x,
    inverse,
    O.matchW(
      () => 0,
      (ix) => `The inverse of ${x} is ${ix}`
    )
  )

getUIMessageWithInverse(0) // ?
getUIMessageWithInverse(2) // ?

getUIMessageWithInverseOtherType(0) // ?
getUIMessageWithInverseOtherType(2) // ?

//----------------------------------------------------
