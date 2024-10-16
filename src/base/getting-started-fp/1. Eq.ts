import * as A from 'fp-ts/Array'
import * as Eq from 'fp-ts/Eq'

/**
 * ! Equality concept
 */

/**
 * ? a type A belongs to type class Eq
 * ? if there is a function named equal of the appropriate type, defined on it
 */
type _Eq<A> = {
  /** returns `true` if `x` is equal to `y` */
  readonly equals: (x: A, y: A) => boolean
}
/**
 * ! Instances must satisfy the following laws:
 * ? 1. Reflexivity: equals(x, x) === true, for all x in A
 * ? 2. Symmetry: equals(x, y) === equals(y, x), for all x, y in A
 * ? 3. Transitivity: if equals(x, y) === true and equals(y, z) === true, then equals(x, z) === true, for all x, y, z in A
 */
const eqNumber: Eq.Eq<number> = {
  equals: (x, y) => x === y
}

function elemIsIn<A>(E: Eq.Eq<A>): (a: A, arr: Array<A>) => boolean {
  return (a, arr) => arr.some(item => E.equals(item, a))
}

elemIsIn(eqNumber)(1, [1, 2, 3]) // ?
elemIsIn(eqNumber)(4, [1, 2, 3]) // ?

// ----------------------------------------------------------

type Point = {
  x: number
  y: number
}

const _eqPoint: Eq.Eq<Point> = {
  equals: (p1, p2) => p1.x === p2.x && p1.y === p2.y
}

const eqPoint: Eq.Eq<Point> = Eq.struct({
  x: eqNumber,
  y: eqNumber
})

type Vector = {
  from: Point
  to: Point
}

const eqVector: Eq.Eq<Vector> = Eq.struct({
  from: eqPoint,
  to: eqPoint
})

const eqArrayOfPoints: Eq.Eq<Array<Point>> = A.getEq(eqPoint)

// 1 - 1:1 point
eqPoint.equals({ x: 1, y: 2 }, { x: 1, y: 2 }) // ?

// 2 - 1:1 vector
eqVector.equals(
  { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } },
  { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } }
) // ?

// 3 many:many
eqArrayOfPoints.equals(
  [
    { x: 3, y: 4 },
    { x: 1, y: 2 }
  ],
  [
    { x: 1, y: 2 },
    { x: 3, y: 4 }
  ]
) // ?
eqArrayOfPoints.equals(
  [
    { x: 1, y: 2 },
    { x: 3, y: 4 }
  ],
  [
    { x: 1, y: 2 },
    { x: 3, y: 4 }
  ]
) // ?

// --------------------------------------------------------------------------
type User = {
  userId: number
  name: string
}

/** two users are equal if their `userId` field is equal */
const eqUser = Eq.contramap((user: User) => user.userId)(eqNumber)

eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' }) // true
eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio' }) // false
