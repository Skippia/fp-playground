/* eslint-disable ts/no-redundant-type-constituents */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable style/no-tabs */
import type * as Apply from 'fp-ts/Apply'
import type { HKT } from 'fp-ts/HKT'
import * as O from 'fp-ts/Option'
import type * as T from 'fp-ts/Task'

export type Response<A> = {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}

// Currying
// ?  g: (args: [B, C]) => D

// We can rewrite g to:
// ?  g: (b: B) => (c: C) => D

/**
 * What we want is a lifting operation,
 * let't call it liftA2 in order to distinguish it from our old lift,
 * that outputs a function with the following signature:
 * ? liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>
 */

/**
 * How can we get there? Since g is now unary, we can use the functor instance and our old lift:
 * ? lift(g): (fb: F<B>) => F<(c: C) => D>
 * But now we are stuck:
 * there's no legal operation on the functor instance which is able
 * to unpack the value F<(c: C) => D> to a function (fc: F<C>) => F<D>.
 */

/**
 * ! Apply
 * So let's introduce a new abstraction Apply that owns such a unpacking operation (named ap)
 */
type Apply<F> = {
  ap: <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>
} & F.Functor<F>

/**
 * The ap function is basically unpack with the arguments rearranged:
 * ? unpack: <C, D>(fcd: HKT<F, (c: C) => D>) => ((fc: HKT<F, C>) => HKT<F, D>)
 * ? ap:     <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>
 * so ap can be derived from unpack (and viceversa).
 */

/**
 * ! Applicative
 * Moreover it would be handy if there exists an operation which is able
 * to lift a value of type A to a value of type F<A>.
 * This way we could call the liftA2(g) function either by providing arguments
 * of type F<B> and F<C> or by lifting values of type B and C.
 */

/**
 * So let's introduce the Applicative abstraction which builds upon Apply and owns such operation (named of)
 */

type Applicative<F> = {
  of: <A>(a: A) => HKT<F, A>
} & Apply<F>

// Example (F = Array)
const applicativeArray = {
  map: <A, B>(fa: A[], f: (a: A) => B): B[] => fa.map(f),
  of: <A>(a: A): A[] => [a],
  ap: <A, B>(fab: ((a: A) => B)[], fa: A[]): B[][] => fab.map(f => fa.map(f))
}

const numbers = [1, 2, 3]
const transformFunctions = [(x: number) => x * 2, (x: number) => x * 3, (x: number) => x * 4]

applicativeArray.map(numbers, x => x * 2) // ?
applicativeArray.of(42) // ?
applicativeArray.ap(transformFunctions, numbers) // ?

// Example (F = Option)

const applicativeOption = {
  map: <A, B>(fa: O.Option<A>, f: (a: A) => B): O.Option<B> =>
    O.isNone(fa) ? O.none : O.some(f(fa.value)),
  of: <A>(a: A): O.Option<A> => O.some(a),
  ap: <A, B>(fab: O.Option<(a: A) => B>, fa: O.Option<A>): O.Option<B> =>
    O.isNone(fab) ? O.none : applicativeOption.map(fa, fab.value)
}
const numberOption: O.Option<number> = O.some(3)
const doubleFunctionOption: O.Option<(x: number) => number> = O.some((x: number) => x * 2)

applicativeOption.map(numberOption, x => x * 2) // ?
applicativeOption.of(42) // ?
applicativeOption.ap(doubleFunctionOption, numberOption) // ?

// Example (F = Task)
const applicativeTask = {
  map:
    <A, B>(fa: T.Task<A>, f: (a: A) => B): T.Task<B> =>
      () =>
        fa().then(f),
  of:
    <A>(a: A): T.Task<A> =>
      () =>
        Promise.resolve(a),
  ap:
    <A, B>(fab: T.Task<(a: A) => B>, fa: T.Task<A>): T.Task<B> =>
      () =>
        Promise.all([fab(), fa()]).then(([f, a]) => f(a))
}
const fetchNumberTask: T.Task<number> = () => Promise.resolve(3)
const doubleFunctionTask: T.Task<(x: number) => number> = () =>
  Promise.resolve((x: number) => x * 2) // Promise<6>

applicativeTask.map(fetchNumberTask, x => x * 2) // ?
applicativeTask.of(42) // Promise<42>
applicativeTask.ap(doubleFunctionTask, fetchNumberTask) // Promise<6>

/**
 * Lifting
 * ? So given an instance of Apply for F can we now write liftA2?
 */

type Curried2<B, C, D> = (b: B) => (c: C) => D

function liftA2<F>(
  F: Apply<F>
): <B, C, D>(g: Curried2<B, C, D>) => Curried2<HKT<F, B>, HKT<F, C>, HKT<F, D>> {
  return g => fb => fc => F.ap(F.map(fb, g), fc)
}

// const add = (a: number, b: number): number => a + b
// const optionA = O.some(3)
// const optionB = O.some(4)
// liftA2(apply)(add)(optionA)(optionB);
/**
 * Nice! But what about functions with three arguments? Do we need yet another abstraction?
 *
 * The good news is that the answer is no, Apply is enough
 */

type Curried3<B, C, D, E> = (b: B) => (c: C) => (d: D) => E

function liftA3<F>(
  F: Apply<F>
): <B, C, D, E>(g: Curried3<B, C, D, E>) => Curried3<HKT<F, B>, HKT<F, C>, HKT<F, D>, HKT<F, E>> {
  return g => fb => fc => fd => F.ap(F.ap(F.map(fb, g), fc), fd)
}

/**
 * Actually given an instance of Apply we can write a liftAn function, for each n.
 * Note. liftA1 is just lift, the Functor operation.
 * We can now update our "composition table"
 * Program f	  Program g 	  Composition
 * ? pure	        pure	        g ∘ f
 * ? effectful	  pure, n-ary	  liftAn(g) ∘ f
 * where liftA1 = lift
 */
/**
 * Is the general problem solved?
 * Not yet. There's still an important case which is missing: what if both programs are effectfull?
 */
