/* eslint-disable no-unused-expressions */
/* eslint-disable ts/no-unused-expressions */
import * as A from 'fp-ts/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { compose } from 'ramda'

/**
 * f: (a: A) => M<B>
 * g: (b: B) => M<C>
 *
 * What's the "composition" of such f and g?
 */

// ? Example M = Array
// type User = {
//   followers: User[]
// }

// const getFollowers = (user: User): User[] => user.followers

// declare const user: User

// const _followersOfFollowers: User[][] = getFollowers(user).map(getFollowers)
// const followersOfFollowers: User[] = A.flatten(getFollowers(user).map(getFollowers))

// // ? Example (M = Option)
// const inverse = (n: number): O.Option<number> => (n === 0 ? O.none : O.some(1 / n))

// const _inverseHead: O.Option<O.Option<number>> = O.Functor.map(A.head([1, 2, 3]), inverse)

// const flatten = <A>(mma: O.Option<O.Option<A>>): O.Option<A> => (O.isNone(mma) ? O.none : mma.value)

// const inverseHead: O.Option<number> = flatten(O.Functor.map(A.head([1, 2, 3]), inverse))

/**
 * All those flatten functions... It's not a coincidence, there's a functional pattern under the hood.
 * Indeed all those type constructors (and many others) admit a monad instance and
 * flatten is the most peculiar operation of monads
 * So what's a monad?
 */

/**
 * A monad is defined by three things:
 * 1. a type constructor M which admits a Functor instance
 * 2. a function of with the following signature
 * ? of: <A>(a: A) => HKT<M, A>
 * 3. a function flatMap with the following signature
 * ? flatMap: <A, B>(f: (a: A) => HKT<M, B>) => ((ma: HKT<M, A>) => HKT<M, B>)
 */

/**
 * ! Note: recall that the HKT type is the fp-ts way to represent a generic type constructor,
 * so when you see HKT<M, X> you can think to the type constructor M applied to the type X (i.e. M<X>).
 */

/**
 * The functions of and flatMap are required to obey three laws:
 * flatMap(of) ∘ f = f (Left identity)
 * flatMap(f) ∘ of = f (Right identity)
 * flatMap(h) ∘ (flatMap(g) ∘ f) = flatMap((flatMap(h) ∘ g)) ∘ f (Associativity)
 * ---
 * where f, g, h are all effectfull functions and ∘ is the usual function composition.
 */

// ...

/**
 * ! Association law
 */
const mcompose = <T>(f: (a: T) => O.Option<T>, g: (...args: any[]) => O.Option<T>) =>
  compose(O.flatMap(f), g)

const multi = (x: number): O.Option<number> => O.of(x * 3)
const division = (x: number): O.Option<number> => O.of(x / 5)
const add = (x: number): O.Option<number> => O.of(x + 33)

// Option<number> => Option<number> // 39
const way0 = compose(
  O.flatMap(add),
  O.flatMap(division),
  multi
) // compose(chain(x),chain(y),z)

const way1 = compose(
  O.flatMap(add),
  compose(O.flatMap(division), multi)
) // compose(x,compose(chain(y),chain(z)))

const way2 = compose(
  compose(O.flatMap(add), O.flatMap(division)),
  multi // z
) // compose(compose(chain(x),chain(y)),z)

const xxx = O.flatMap(
  compose(O.flatMap(add), division)
)

// Option<number> => Option<number> // 39
const way3 = compose(
  O.flatMap(
    compose(O.flatMap(add), division)
  ),
  multi
) // compose(chain(compose(chain(x),y)), z)

// ! Summary:
// ? chain(compose(chain(x),y)) === compose(chain(x), chain(y))
// ? chain(chain(x) ∘ y) === chain(x) ∘ chain(y)
const left = O.flatMap(compose(O.flatMap(add), division))
/**
 * ! compose(f,g) = f(g) = f(g(x))
 * O.flatMap(compose(O.flatMap(add), division))
 * O.flatMap(O.flatMap(add)(division(x)))
 * O.flatMap(add(division(x))
 * O.flatMap(add)(division(10))
 * O.flatMap(add)(O.of(2))
 * add(2)
 */
const right = compose(O.flatMap(add), O.flatMap(division))
/**
 * ! compose(f,g) = f(g) = f(g(x))
 * compose(O.flatMap(add), O.flatMap(division)) = O.flatMap(add)(O.flatMap(division)(x))
 * O.flatMap(add)(O.flatMap(division)(O.of(10)))
 * O.flatMap(add)(division)(10)
 * O.flatMap(add)(O.of(2))
 * add(2)
 */

console.log(left(O.of(10))) // 35
console.log(right(O.of(10))) // 35

console.log(way0(10)) // 39
console.log(way1(10)) // 39
console.log(way2(10)) // 39
console.log(way3(10)) // 39

// ! OR
console.log(mcompose(mcompose(add, division), multi)(10))
console.log(mcompose(add, mcompose(division, multi))(10))

/**
 * ! Identity law
 */
// ! OR
console.log(mcompose(O.Monad.of, add)(10))
console.log(mcompose(add, O.Monad.of)(10))
// the same as previous
console.log(compose(O.flatMap(add), O.Monad.of)(10))
console.log(compose(O.flatMap(O.Monad.of), add)(10))

console.log(add(10))
