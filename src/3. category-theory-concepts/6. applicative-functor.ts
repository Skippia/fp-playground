/* eslint-disable style/max-len */
/* eslint-disable no-redeclare */
/* eslint-disable ts/no-redeclare */
/* eslint-disable style/no-tabs */
import type * as App from 'fp-ts/Apply'
import * as A from 'fp-ts/Array'
import * as F from 'fp-ts/Functor'
import type { HKT, Kind, URIS } from 'fp-ts/HKT'
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
 * ? liftA2(g): (fa: F<A>) => (fb: F<B>) => F<B>
 */

/**
 * How can we get there? Since g is now unary, we can use the functor instance and our old lift:
 * ? lift(g): (fa: F<A>) => F<(b: B) => C>
 * But now we are stuck:
 * there's no legal operation on the functor instance which is able
 * to unpack the value F<(b: B) => C> to a function (fb: F<B>) => F<C>.
 */

/**
 * ! Apply
 * So let's introduce a new abstraction Apply that owns such a unpacking operation (named ap)
 */
type Apply<F> = {
  ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
} & F.Functor<F>

/**
 * The ap function is basically unpack with the arguments rearranged:
 * ? unpack: <A, B>(fab: HKT<F, (a: A) => B>) => ((fa: HKT<F, A>) => HKT<F, B>)
 * ? ap:     <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
 * so ap can be derived from unpack (and viceversa).
 */

type Applicative<F> = {
  of: <A>(a: A) => HKT<F, A>
} & Apply<F>

// Example (F = Array)
const applicativeArray = {
  map: <A, B>(fa: A[], f: (a: A) => B): B[] => fa.map(f),
  of: <A>(a: A): A[] => [a],
  ap: <A, B>(fab: ((a: A) => B)[], fa: A[]): B[] => fab.flatMap(f => fa.map(f))
}

const numbers = [1, 2, 3]
const transformFunctions = [(x: number) => x * 2, (x: number) => x * 3, (x: number) => x * 4]

console.log(applicativeArray.map(numbers, x => x * 2)) // ?
console.log(applicativeArray.of(42))
console.log(applicativeArray.ap(transformFunctions, numbers))
console.log(A.Applicative.ap(transformFunctions, numbers))

// Example (F = Option)

const applicativeOption = {
  URI: 'Option' as const,
  map: <A, B>(fa: O.Option<A>, f: (a: A) => B): O.Option<B> =>
    O.isNone(fa) ? O.none : O.some(f(fa.value)),
  of: <A>(a: A): O.Option<A> => O.some(a),
  ap: <A, B>(fab: O.Option<(a: A) => B>, fa: O.Option<A>): O.Option<B> =>
    O.isNone(fab) ? O.none : applicativeOption.map(fa, fab.value)
}
const numberOption: O.Option<number> = O.some(3)
const doubleFunctionOption: O.Option<(x: number) => number> = O.some((x: number) => x * 2)

console.log(applicativeOption.map(numberOption, x => x * 2))
console.log(applicativeOption.of(42))
console.log(applicativeOption.ap(doubleFunctionOption, numberOption))

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

void applicativeTask.map(fetchNumberTask, x => x * 2)() // 6
void applicativeTask.of(42)() // 42
void applicativeTask.ap(doubleFunctionTask, fetchNumberTask)() // 6

/**
 * Lifting
 * ? So given an instance of Apply for F can we now write liftA2?
 */

type TLiftA2<F extends URIS> = (F: App.Apply1<F>) => <A, B>(f: (a: A) => (b: A) => B) => (fa: Kind<F, A>) => (fb: Kind<F, A>) => Kind<F, B>

const liftA2: TLiftA2<'Option'> = F => f => fa => (fb) => {
  const x = F.map(fa, f)
  return F.ap(x, fb) // F.ap(O.Option<(b: A) => B>, O.Option<A>)
}
const add = (a: number) => (b: number): number => a + b
const optionA = O.some(3)
const optionB = O.some(4)

console.log(liftA2(applicativeOption)(add)(optionA)(optionB))
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
