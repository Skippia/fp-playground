import { monoid } from 'fp-ts'
import * as Apply from 'fp-ts/Apply'
import * as A from 'fp-ts/Array'
import type * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

const start = performance.now()

const timerToPromise = (timer: number) =>
  timer < 1500
    ? new Promise<string>((resolve) => {
      setTimeout(() => resolve(`Promise with timer ${timer} resolved`), timer)
    })
    : new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error(`Promise with timer ${timer} rejected`)), timer)
    })

const timerToTaskEither = TE.tryCatchK(
  timerToPromise,
  reason => new Error(String(reason))
)

const arrPromisesToPromisesAll = TE.tryCatchK(
  (promiseArr: Promise<string>[]) => Promise.all(promiseArr),
  reason => new Error(String(reason))
)

const timers = [1000, 1000, 1000, 100, 1000, 1000, 1400]

// ! Example — the most simple
const f = () => pipe(
  timers,
  A.map(timerToPromise),
  arrPromisesToPromisesAll
) // Run sequentially

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ! Example 2
const x = pipe(
  timers,
  A.map(timerToTaskEither),
  A.sequence(TE.ApplicativeSeq)
) // Run in parallel (promise all)

// ! Example 3
const y = pipe(
  [1000, 1000, 1000, 100, 1000, 1000, 1400],
  A.map(timerToTaskEither),
  A.sequence(TE.ApplicativePar)
) // Run in parallel (promise all)

// ! Example 4
const z = pipe(
  timers,
  TE.traverseArray(timerToTaskEither)
) // Run in parallel (promise all)

const n = pipe(
  timers,
  A.map(timerToTaskEither),
  TE.sequenceArray
) // Run in parallel (promise all)

const t = pipe(
  // @ts-expect-error ...
  Apply.sequenceT(TE.ApplicativePar)(...A.map(timerToTaskEither)(timers))
) // Run in parallel (promise all)

// ! Example 5

const raceMonoid = T.getRaceMonoid<E.Either<Error, string>>()
const b = pipe(
  timers,
  A.map(timerToTaskEither),
  monoid.concatAll(raceMonoid)
) // Under the hood runs promise race

const bAlt = () => Promise.race(timers.map(timerToPromise)) // alternative

bAlt().then((r) => {
  const delta = performance.now() - start
  console.log(r, `have passed ${delta / 1000}sec`)
})
