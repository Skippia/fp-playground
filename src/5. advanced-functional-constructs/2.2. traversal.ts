import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as IO from 'fp-ts/lib/IO'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'

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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type TBoolFn = (n: number) => boolean
const identity = <T>(x: T) => x

const a = E.traverseArray((x: number) => x >= 1 ? E.right(x) : E.left('bad value'))([1, 2, 3]) // => E.right<[1,2,3]>
const b = E.traverseArray((x: number) => x >= 2 ? E.right(x) : E.left('bad value'))([1, 2, 3]) // => E.left<'wingX'>

const validate = (f: TBoolFn) => pipe(
  E.fromPredicate(f, () => new Error('bad value')),
  E.traverseArray
)

const c = validate((n: number) => n % 2 === 0)([10, 11, 12]) // E.left<'bad value'>
const c2 = validate((n: number) => n % 2 === 0)([10, 12, 14]) // E.right<[10,12,14]>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ! Example 2

declare const getAttribute: (str: string) => (node: string) => O.Option<string>
declare const $: (selector: string) => IO.IO<string>

const getControlMode = pipe(
  'fff',
  $, // => IO<string>
  IO.map(getAttribute('aria-content')), // => IO<Option<string>>
  IO.map(O.map($)) // => IO<Option<IO<string>>>
) // => IO<Option<IO<string>>>

// ? How can we convert IO<Option<IO<string>>> into IO<Option<string>> ?
// ! Applicative defines how to lift and combine effects in a specific context

const ans2 = pipe(
  'fff',
  $, // => IO<String>
  IO.map(getAttribute('aria-content')), // => IO<Option<string>>
  IO.map(O.map($)), // => IO<Option<IO<String>>>
  IO.map(O.traverse(IO.Applicative)(identity)),
  IO.flatten // IO<Option<string>>
)

// ! Example 3
// ? How can we convert Option<Either<Error, Option<string>>> into Option<Either<Error, string>>
declare const q3: O.Option<E.Either<Error, O.Option<string>>>

const ans3 = pipe(
  q3,
  O.map(E.traverse(O.Applicative)(identity)),
  O.flatten // => Option<Either<Error, string>>
)

// ! Example 4
// ? How can we convert Option<TaskEither<Error, Option<string>>> into Option<TaskEither<Error, string>>
const q4: O.Option<TE.TaskEither<Error, O.Option<string>>> = O.some(
  TE.right(O.some('hello'))
)

const taskEitherTraverseOption = <E, A>(
  te: TE.TaskEither<E, O.Option<A>>
): TE.TaskEither<E, A> =>
  pipe(
    te,
    TE.map(option =>
      pipe(
        option,
        O.match(
          () => TE.left<E, A>(new Error('None') as E),
          TE.right
        )
      )
    ),
    TE.flatten
  )

const ans4 = pipe(
  q4,
  O.map(taskEitherTraverseOption) // => O.Option<TE.TaskEither<Error, string>>
)

// ! Example 5 — what if we want not just unwrapping, but also mapping?

declare const getPartIds: () => TE.TaskEither<Error, string[]>
declare const getPart: (partId: string) => TE.TaskEither<Error, Blob>

// ? How can we convert TE.TaskEither<Error, string[]> into TE.TaskEither<Error, Blob[]>?

const z1 = pipe(
  getPartIds(), // => TE.TaskEither<Error, string[]>
  TE.flatMap(TE.traverseArray(getPart)) // => TE.TaskEither<Error, readonly Blob[]>
)
const z2 = pipe(
  getPartIds(), // => TE.TaskEither<Error, string[]>
  TE.flatMap(A.traverse(TE.ApplicativePar)(getPart)) // => TE.TaskEither<Error, Blob[]>
)
