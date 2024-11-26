import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as IO from 'fp-ts/lib/IO'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'

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
