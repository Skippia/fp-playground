import { sequenceS, sequenceT } from 'fp-ts/lib/Apply'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

const x = T.sequenceArray([T.of(1), T.of(2), T.of(3)]) // => T.Task<readonly number[]>
const y = O.sequenceArray([O.some(1), O.some(2), O.some(3)]) // => O.value<[1,2,3]>
const z = O.sequenceArray([O.none, O.some(2), O.some(3)]) // => O.none
const n = E.sequenceArray([E.right(1), E.right(2), E.right(3)]) // => E.right<[1,2,3]>
const c = E.sequenceArray([E.right(2), E.left('wingX'), E.left('wingY')]) // => E.left<'wingX'>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ! Example 1
declare const readFile: (pathname: string) => TE.TaskEither<Error, string>
declare const firstWords: (str: string) => string

const tldr = flow(
  readFile,
  TE.map(firstWords)
) // => TE.TaskEither<Error, string>

const tasks = A.map(tldr)(['file1', 'file2']) // => TE.TaskEither<Error, string>[]

// ? But how to convert TE.TaskEither<Error, string>[] into TE.TaskEither<Error, string[]> ?
const ans1 = TE.sequenceArray(tasks) // => TE.TaskEither<Error, readonly string[]>

const arrE = [E.right(1), E.right(2), E.right(3)]
const tt = E.sequenceArray(arrE) // => E.right<[1,2,3]>
const tt2 = A.sequence(E.Applicative)(arrE) // => E.right<[1,2,3]>
const tt3 = sequenceT(E.Apply)(E.right(1), E.right(2), E.right(3)) // => E.right<[1,2,3]>

const validateNumber = (x: unknown): E.Either<Error, number> => typeof x === 'number' ? E.right(x) : E.left(new Error('bad value'))
const validateString = (x: unknown): E.Either<Error, string> => typeof x === 'string' ? E.right(x) : E.left(new Error('bad value'))
const register = ({ a, b }: { a: number, b: string }): string => `${a} ${b}`

const input = {
  a: 1 as unknown,
  b: 'two' as unknown
}

const tt4 = pipe(
  input,
  ({ a, b }) => sequenceS(E.Apply)({
    a: validateNumber(a),
    b: validateString(b)
  }),
  E.map(register)
) // => E.Either<Error, string>
