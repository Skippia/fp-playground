import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'

/**
 * f: (a: A) => M<B>
 * g: (b: B) => M<C>
 *
 * What's the "composition" of such f and g?
 */

// ? Example M = Array
type User = {
  followers: User[]
}

const getFollowers = (user: User): User[] => user.followers

declare const user: User

const _followersOfFollowers: User[][] = getFollowers(user).map(getFollowers)
const followersOfFollowers: Array<User> = A.flatten(getFollowers(user).map(getFollowers))

// ? Example (M = Option)
const inverse = (n: number): O.Option<number> => (n === 0 ? O.none : O.some(1 / n))

const _inverseHead: O.Option<O.Option<number>> = O.option.map(A.head([1, 2, 3]), inverse)

const flatten = <A>(mma: O.Option<O.Option<A>>): O.Option<A> => (O.isNone(mma) ? O.none : mma.value)

const inverseHead: O.Option<number> = flatten(O.option.map(A.head([1, 2, 3]), inverse))

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
 * where f, g, h are all effectful functions and ∘ is the usual function composition.
 */

// ...
