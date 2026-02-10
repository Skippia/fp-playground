import type * as App from 'fp-ts/Apply'
import * as A from 'fp-ts/Array'
import * as F from 'fp-ts/Functor'
import type { HKT, Kind, URIS } from 'fp-ts/HKT'
import * as O from 'fp-ts/Option'
import type * as T from 'fp-ts/Task'

import { liftA2 } from './6. applicative-functor'

export type Response<A> = {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}

/**
 * ! Apply
 */
type Apply<F> = {
  ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
} & F.Functor<F>

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

const add = (a: number) => (b: number): number => a + b
const optionA = O.some(3)
const optionB = O.some(4)

console.log(liftA2(applicativeOption)(add)(optionA)(optionB))
