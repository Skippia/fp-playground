import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

const inverse = (x: number): O.Option<number> => (x === 0 ? O.none : O.some(1 / x))

const safeInverse = (x: number): number =>
  pipe(
    x,
    inverse,
    O.getOrElse(() => 0) // returns default value (must be number) if `inverse` returns O.None
  )

const safeInverseOtherType = (x: number): number | string =>
  pipe(
    x,
    inverse,
    O.getOrElseW(() => 'invalid :(') //  can be any type
  )

safeInverse(0) // ?
safeInverse(2) // ?

safeInverseOtherType(0) // ?
safeInverseOtherType(2) // ?
