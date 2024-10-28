/**
 * Independent Promises
 */

import { monoid } from 'fp-ts'
import * as A from 'fp-ts/Array'
import type * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

/**
 * To put it simply, Traverse helps you to switch the order between traversable containers.
 * A traversable container is a container that implements a set of functions related
 * to Traverse that obey the "Traversable laws".
 * For instances, Array and TaskEither are traversable container, so you can turn an
 * array of TaskEither<E,A> into a TaskEither<E, A[]>
 * (Similar to Promise.allSettled , which turn an array of Promise into a Promise of array of object).
 */

/**
 * There are two separate ways to implement the traverse function — Applicative and Monadic
 * (Don't worry, both Applicative and Monadic are big topics and will be covered in depth in separate articles).
 */

/**
 * To put things simpler, you can consider that Promise.allSettled is implemented in Applicative way
 * because it collects all the results of the promises regardless of its status (Rejected or Resolved);
 * while Promise.all is implemented in Monadic way because it returns
 * the result of the first rejected promise
 */

/**
 * ! Traverse in monadic style
 */
const timerToTaskEither = TE.tryCatchK(
  (timer: number) =>
    timer < 1500
      ? new Promise<string>((resolve) => {
        setTimeout(() => resolve(`Promise with timer ${timer} resolved`), timer)
      })
      : new Promise<string>((_, reject) => {
        setTimeout(() => reject(`Promise with timer ${timer} rejected`), timer)
      }),
  reason => new Error(String(reason))
)

export declare const traverseArray: <A, B, E>(
  f: (a: A) => TE.TaskEither<E, B>
) => (as: readonly A[]) => TE.TaskEither<E, readonly B[]>

const monadicWay = async () => {
  const timers = [10, 100, 1000, 2000, 3000]

  /*
    3. Use TaskEither.traverseArray to turn the number[] to TaskEither<Error, string[]>
  */
  const traverseExample = TE.traverseArray(timerToTaskEither)(timers)

  try {
    const result = await traverseExample()
  }
  catch (error) {
    console.error(error)
  }
}
void monadicWay()

/**
 * By default, TaskEither.traverseArray use the Monadic style to traverse the array,
 * meaning that it returns the first error sequentially (instead of simultaneous?). Be aware that this
 * behavior is different from Promise.all, which returns the first Promise that is rejected first.
 * If you increase the fourth timer to for example 4000, which becomes longer than the last timer,
 * you will get the Promise with timer 3000 (The fifth timer) if you use Promise.all .
 * If you use TaskEither.traverseArray , you will get the Promise with time 4000 instead.
 *
 * ! I would recommend the following way to mimic the behavior of Promise.all with TaskEither:
 */

const monadicWayImproved = async () => {
  const timers = [10, 100, 1000, 2000, 3000]

  const promiseAllWithTaskEither = TE.tryCatchK(
    (promiseArr: Promise<string>[]) => Promise.all(promiseArr),
    reason => new Error(String(reason))
  )
  try {
    const getResult = pipe(
      timers,
      A.map((timer: number) =>
        timer < 1500
          ? new Promise<string>((resolve) => {
            setTimeout(() => resolve(`Promise with timer ${timer} resolved`), timer)
          })
          : new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error(`Promise with timer ${timer} rejected`)), timer)
          })
      ),
      promiseAllWithTaskEither
    )

    const result = await getResult() // ?
  }
  catch (error) {
    console.error(error)
  }
}
void monadicWayImproved()

// ===============================================================================================
/**
 * ? Traverse and Sequence
 * When we talk about Traverse, we also cover sequence.
 * sequence is very useful when we want to swap between two containers directly.
 * Suppose we have TaskEither<Error, string>[] , we can use sequence to turn it into TaskEither<Error, string[]> .
 * sequence is just traverse with identity function baked in.
 */
export declare const sequenceArray: <A, E>(
  arr: ReadonlyArray<TE.TaskEither<E, A>>
) => TE.TaskEither<E, ReadonlyArray<A>>

/**
 * ! Traverse in applicative style
 * If you want to accumulates the results, use the Applicative style:
 */

const applicativeWay = async () => {
  const timers = [10, 100, 1000, 4000, 3000]

  /*
    4. Use sequence in applicative way,
    T.ApplicativePar is used here instead of TE.ApplicativePar
    if you use TE.ApplicativePar, it will be in Monadic style, which I believe is a bug
  */

  try {
    const getResult = pipe(
      timers,
      A.map(timerToTaskEither), //
      A.sequence(T.ApplicativePar)
    )

    const result = await getResult() // ?
  }
  catch (error) {
    console.error(error)
  }
}
void applicativeWay()

// Promise.race example

const promiseRace = async () => {
  const timers = [10, 100, 1000, 4000, 3000]

  const raceMonoid = T.getRaceMonoid<E.Either<Error, string>>()

  const getResultRaceMonoid = pipe(
    timers,
    A.map(timerToTaskEither), //
    monoid.concatAll(raceMonoid)
  )

  const resultRaceMonoid = await getResultRaceMonoid()
}
void promiseRace()

/**
 * For Promise.any , I would recommend using the way same as Promise.all to wrap it inside taskEither.tryCatchK.
 */
