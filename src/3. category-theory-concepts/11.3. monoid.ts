/**
 * ! In the last post we saw that a Semigroup captures the concept of "merging" values (via concat).
 * ! A Monoid is any Semigroup that happens to have a special value which is "neutral" with respect to concat
 */

import * as O from 'fp-ts/lib/Option'
import * as M from 'fp-ts/Monoid'
import * as S from 'fp-ts/Semigroup'

type Monoid<A> = {
  readonly empty: A
} & S.Semigroup<A>

/**
 * The following laws must hold:
 * ? Right identity: concat(x, empty) = x, for all x in A
 * ? Left identity: concat(empty, x) = x, for all x in A
 * Note. If an empty value exists then is unique.
 */

// ! Instances!

/**
 * ? Most of the semigroups we saw in the previous post are actually monoids
 */

/** number `Monoid` under addition */
const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0
}

/** number `Monoid` under multiplication */
const monoidProduct: Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1
}

const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: ''
}

/** boolean monoid under conjunction */
const monoidAll: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true
}

/** boolean monoid under disjunction */
const monoidAny: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false
}

/**
 * You may wonder if all semigroups are also monoids.
 * That's not the case, as a counterexample consider the following semigroup
 */
const semigroupSpace: S.Semigroup<string> = {
  concat: (x, y) => x + ' ' + y
}

// We can't find an empty value such that concat(x, empty) = x.

// ------------------------------------------------------------------

type Point = {
  x: number
  y: number
}

const monoidPoint: Monoid<Point> = M.struct({
  x: monoidSum,
  y: monoidProduct
})

monoidPoint.concat({ x: 1, y: 2 }, { x: 3, y: 4 }) // ?

type Vector = {
  from: Point
  to: Point
}

const monoidVector: Monoid<Vector> = M.struct({
  from: monoidPoint,
  to: monoidPoint
})

monoidVector.concat(
  { from: { x: 5, y: 8 }, to: { x: 1, y: 1 } },
  { from: { x: 5, y: 8 }, to: { x: 1, y: 1 } }
) // ?

M.concatAll(monoidSum)([1, 2, 3, 4]) // ?
M.concatAll(monoidProduct)([1, 2, 3, 4]) // ?
M.concatAll(monoidString)(['a', 'b', 'c']) // ?
M.concatAll(monoidAll)([true, false, true]) // ?
M.concatAll(monoidAny)([true, false, true]) // ?

// -----------------------------------------------------------------

// ! Monoids for type constructors

/**
 * ? If we can find a monoid instance for A
 * ? then we can derive a monoid instance for Option<A> (via getApplyMonoid) which works like this:
 * if x(none) or y(none) => concat(x,y) === none
 * if x(some) and y(some) => concat(x,y) = some(concat(x,y))
 */

const OptionM = O.getApplyMonoid(monoidSum)

OptionM.concat(O.some(1), O.none) // ?
OptionM.concat(O.some(1), O.some(2)) // ?
OptionM.concat(O.some(1), OptionM.empty) // ?

const FirstM = O.getMonoid(S.first<number>())

FirstM.concat(O.some(1), O.none) // ?
FirstM.concat(O.some(1), O.some(2)) // ?

// ------------------------------------------------------------------
/**
 * ! As an example, getLastMonoid can be useful for managing optional values
 */

/** VSCode settings */
type Settings = {
  /** Controls the font family */
  fontFamily: O.Option<string>
  /** Controls the font size in pixels */
  fontSize: O.Option<number>
  /** Limit the width of the minimap to render at most a certain number of columns. */
  maxColumn: O.Option<number>
}

const monoidSettings: Monoid<Settings> = M.struct({
  fontFamily: O.getMonoid(S.last<string>()),
  fontSize: O.getMonoid(S.last<number>()),
  maxColumn: O.getMonoid(S.last<number>())
})

const workspaceSettings: Settings = {
  fontFamily: O.some('Courier'),
  fontSize: O.none,
  maxColumn: O.some(80)
}

const userSettings: Settings = {
  fontFamily: O.some('Fira Code'),
  fontSize: O.some(12),
  maxColumn: O.none
}

/** userSettings overrides workspaceSettings */
monoidSettings.concat(workspaceSettings, userSettings)
/*
{ fontFamily: some("Fira Code"),
  fontSize: some(12),
  maxColumn: some(80) }
*/
