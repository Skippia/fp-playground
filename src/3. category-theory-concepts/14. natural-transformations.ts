/* eslint-disable style/max-len */
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { compose } from 'ramda'

// Helpers
const toUpperCase = (s: string): string => s.toUpperCase()
const toReverse = (s: string): string => s.split('').reverse().join('')
const concat = (s1: string) => (s2: string): string => s1 + s2

// getValue :: Selector -> Task Error (Maybe String)
// postComment :: String -> Task Error Comment
// validate :: String -> Either ValidationError String

// saveComment :: () -> Task Error (Maybe (Either ValidationError (Task Error Comment)))
// const saveComment = compose(
//   map(map(map(postComment))),
//   map(map(validate)),
//   getValue('#comment'),
// );

const getValue = (selector?: string): TE.TaskEither<Error, O.Option<string>> =>
  selector
    ? TE.of(selector === 'empty' ? O.none : O.some(selector))
    : TE.throwError(new Error('No selector'))

const postComment = (comment?: string): TE.TaskEither<Error, string> =>
  comment
    ? TE.of(comment)
    : TE.throwError(new Error('No comment'))

const validate = (comment?: string): E.Either<Error, string> =>
  comment
    ? E.right(comment)
    : E.left(new Error('No comment'))

// ! 1. BAD CODE WITHOUT NATURAL TRANSFORMATION
const saveComment = flow(
  getValue,
  TE.map(O.map(validate)), // => TE.TaskEither<Error, O.Option<E.Either<Error, string>>>
  TE.map(O.map(E.map(postComment))) // => TE.TaskEither<Error, O.Option<E.Either<Error, TE.TaskEither<Error, string>>>>
)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const maybeToTask = (x: O.Option<string>): TE.TaskEither<Error, string> =>
  O.isNone(x)
    ? TE.throwError(new Error('Empty'))
    : TE.of(x.value)

const eitherToTask = (x: E.Either<Error, string>): TE.TaskEither<Error, string> =>
  E.isLeft(x)
    ? TE.throwError(x.left)
    : TE.of(x.right)

// ! 2. NATURAL TRANSFORMATION
const saveCommentWithNT = flow(
  getValue, // => TE.TaskEither<Error, O.Option<string>>
  TE.flatMap(maybeToTask), // => TE.TaskEither<Error, string>
  TE.map(validate), // => TE.TaskEither<Error, E.Either<Error, string>>
  TE.flatMap(eitherToTask), // => TE.TaskEither<Error, string>
  TE.map(postComment), // TE.TaskEither<Error, TE.TaskEither<Error, string>>
  TE.flatten // TE.TaskEither<Error, string>
)
