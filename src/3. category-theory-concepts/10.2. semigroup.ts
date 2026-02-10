import * as A from 'fp-ts/Array'
import * as B from 'fp-ts/lib/boolean'
import { getSemigroup, pipe } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as N from 'fp-ts/lib/number'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/Semigroup'
import * as Str from 'fp-ts/lib/string'
import * as Ord from 'fp-ts/Ord'
/**
 * ? A semigroup is a pair (A, *) in which A is a non-empty set and * is a binary associative operation on A,
 * ? i.e. a function that takes two elements of A as input and returns an element of A as output...
 * ? *: (x: A, y: A) => A
 * ? ... while associative means that the equation
 * ? (x * y) * z = x * (y * z)
 *
 * ? Associativity simply tells us that we do not have to worry about parenthesizing an expression and can write x * y * z
 */

/**
 * ? There are plenty of examples of semigroups:
 * (number, *) where * is the usual multiplication of numbers
 * (string, +) where + is the usual concatenation of strings
 * (boolean, &&) where && is the usual conjunction
 */

/**
 * As usual in fp-ts the type class Semigroup,
 * contained in the fp-ts/Semigroup module, is implemented as
 * a TypeScript interface, where the operation * is named concat
 */

/**
 * concat(concat(x, y), z) = concat(x, concat(y, z))
 */

/**
 * The name concat makes a particular sense for arrays (see later) but,
 * based on the context and the type A for which we are implementing an instance,
 * the semigroup operation can be interpreted with different meanings
 * ? "concatenation"
 * ? "merging"
 * ? "fusion"
 * ? "selection"
 * ? "addition"
 * ? "substitution"
 * ...
 */

/** number `Semigroup` under multiplication */
const semigroupProduct: S.Semigroup<number> = {
  concat: (x, y) => x * y
}
/** number `Semigroup` under addition */
const semigroupSum: S.Semigroup<number> = {
  concat: (x, y) => x + y
}
const semigroupString: S.Semigroup<string> = {
  concat: (x, y) => x + y
}
/**
 * What if, given a type A,
 * you can't find an associative operation on A?
 * You can create a (trivial) semigroup instance for every type just using the following constructions
 */

/** Always return the first argument */
function getFirstSemigroup<A = never>(): S.Semigroup<A> {
  return { concat: (x, y) => x }
}

/** Always return the second argument */
function getLastSemigroup<A = never>(): S.Semigroup<A> {
  return { concat: (x, y) => y }
}

/**
 * Another technique is to define a semigroup instance for Array<A> (*), called the free semigroup of A.
 */

function getArraySemigroup<A = never>(): S.Semigroup<Array<A>> {
  return { concat: (x, y) => x.concat(y) }
}

// and map the elements of A to the singleton elements of Array<A>
function of<A>(a: A): Array<A> {
  return [a]
}

/**
 * There's another way to build a semigroup instance for a type A
 */

/** Takes the minimum of two values */
const semigroupMin: S.Semigroup<number> = S.min(N.Ord)

/** Takes the maximum of two values  */
const semigroupMax: S.Semigroup<number> = S.max(N.Ord)

semigroupMin.concat(2, 1) // ?
semigroupMax.concat(2, 1) // ?

// ---------------------------------------------------

type Point = { x: number, y: number }
type Vector = { from: Point, to: Point }

const _semigroupPoint: S.Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  })
}
const semigroupPoint: S.Semigroup<Point> = S.struct<Point>({
  x: N.SemigroupSum,
  y: N.SemigroupSum,
})

const semigroupVector: S.Semigroup<Vector> = S.struct<Vector>({
  from: semigroupPoint,
  to: semigroupPoint,
})

const x = semigroupVector.concat(
  { from: { x: 1, y: 9 }, to: { x: 3, y: 1 } },
  { from: { x: 9, y: 1 }, to: { x: 2, y: 0 } }
) // { from: { x: 10, y: 10 }, to: { x: 5, y: 1 } }

const isXPositive = (p: Point) => p.x > 0
const isYPositive = (p: Point) => p.y > 0
const isPointInteger = (p: Point) => Number.isInteger(p.x) && Number.isInteger(p.y)

const isBooleanPointCriteria = getSemigroup(B.SemigroupAll)<Point>()

const isPositivePoint = isBooleanPointCriteria.concat(isXPositive, isYPositive)
const isPositiveAndIntegerPoint = pipe(
  [isYPositive, isYPositive, isPointInteger],
  pipe(() => true, S.concatAll(isBooleanPointCriteria))
)

console.log(isPositivePoint({ x: 1, y: 1 })) //
console.log(isPositivePoint({ x: 1, y: -1 })) //
console.log(isPositivePoint({ x: -1, y: 1 })) //
console.log(isPositivePoint({ x: -1, y: -1 })) //

console.log(isPositiveAndIntegerPoint({ x: 1, y: -1 })) //
console.log(isPositiveAndIntegerPoint({ x: -1, y: 1 })) //
console.log(isPositiveAndIntegerPoint({ x: -1, y: -1 })) //
console.log(isPositiveAndIntegerPoint({ x: 1.1, y: 1 })) //
console.log(isPositiveAndIntegerPoint({ x: 1, y: 1.1 })) //
console.log(isPositiveAndIntegerPoint({ x: 1.1, y: 1.1 })) //
console.log(isPositiveAndIntegerPoint({ x: 1, y: 1 })) //

// --------------------------------------------------

/**
 * ! Folding
 */
/**
 * By definition concat works with only two elements of A, what if we want to concat more elements?
 * The fold function takes a semigroup instance, an initial value and an array of elements:
 */

const sum = S.concatAll(semigroupSum)

sum(0)([1, 2, 3, 4]) // ?

const product = S.concatAll(semigroupProduct)

product(1)([1, 2, 3, 4]) // ?

/**
 * Semigroups for type constructors
 */

// What if we want to "merge" two Option<A>? There are four cases:
// if x(none) or y(none) => concat(x,y) === none
// if x(some) and y(some) => ?

/**
 * There's a problem with the last one, we'd need something to "merge" two A s.
 * ? That's what Semigroup does!
 * ? We can require a semigroup instance for A and then derive a semigroup instance for Option<A>.
 * ? This is how the getApplySemigroup combinator works
 */

const _S = O.getApplySemigroup(semigroupSum)

_S.concat(O.some(1), O.none) // ?  O.none
_S.concat(O.some(1), O.some(2)) // ? O.some(3)

// ----------------------------------------------------
/**
 * Appendix
 */
type Customer = {
  name: string
  favoriteThings: string[]
  registeredAt: number
  lastUpdatedAt: number
  hasMadePurchase: boolean
}

// ? semigroup merge strategy
const semigroupCustomer: S.Semigroup<Customer> = S.struct({
  // ? keep the longer name
  name: S.max(
    Ord.contramap((s: string) => s.length)(N.Ord)
  ),
  // ? accumulate favorite things
  favoriteThings: A.getMonoid<string>(),
  // ? keep the least recent date
  registeredAt: S.min(N.Ord),
  // ? keep the most recent date
  lastUpdatedAt: S.max(N.Ord),
  // ? mark as true if any purchases were ever made
  hasMadePurchase: B.SemigroupAny
})

// ? ℹ️ create our own Monoid
const longestStringMonoid: M.Monoid<string> = {
  concat: (x, y) => (x.length > y.length ? x : y),
  empty: ''
}

// ? monoid merge strategy
const monoidCustomer: M.Monoid<Customer> = M.struct({
  name: longestStringMonoid,
  favoriteThings: A.getMonoid<string>(),
  registeredAt: M.min(N.Bounded),
  lastUpdatedAt: M.max(N.Bounded),
  hasMadePurchase: B.MonoidAny
})

const mockedCustomerRecordCollection: Customer[] = [
  {
    name: 'Bobby',
    favoriteThings: ['cooking', 'reading'],
    registeredAt: new Date(2020, 1, 20).getTime(),
    lastUpdatedAt: new Date(2020, 2, 18).getTime(),
    hasMadePurchase: false
  },
  {
    name: '',
    favoriteThings: ['functional programming'],
    registeredAt: new Date(2018, 1, 22).getTime(),
    lastUpdatedAt: new Date(2018, 2, 9).getTime(),
    hasMadePurchase: false
  },
  {
    name: 'Bobby Axelrod',
    favoriteThings: ['playing guitar'],
    registeredAt: new Date(1971, 1, 1).getTime(),
    lastUpdatedAt: new Date(5000, 1, 1).getTime(),
    hasMadePurchase: true
  }
]

const doubleMerged = monoidCustomer.concat(
  mockedCustomerRecordCollection[0] as Customer,
  mockedCustomerRecordCollection[1] as Customer
)

const allMerged = pipe(
  mockedCustomerRecordCollection,
  pipe(
    mockedCustomerRecordCollection[0]!,
    S.concatAll(monoidCustomer)
  )
)

/* {
 ? name: 'Bobby',
 ? favoriteThings: [ 'cooking', 'reading', 'functional programming' ],
 ? registeredAt: 1519246800000,
 ? lastUpdatedAt: 1584478800000,
 ? hasMadePurchase: false
} */
console.log(doubleMerged)

/* {
  ? name: 'Bobby Axelrod',
  ? favoriteThings: [
  ?  'cooking', 'reading', 'cooking', 'reading', 'functional programming', 'playing guitar'
  ? ],
  ? registeredAt: 34203600000,
  ? lastUpdatedAt: 95620251600000,
  ? hasMadePurchase: true
}
 */
console.log(allMerged)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
