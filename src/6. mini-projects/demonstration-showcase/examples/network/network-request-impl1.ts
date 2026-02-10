/* eslint-disable style/max-len */
/* eslint-disable ts/no-floating-promises */
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/lib/Either'
import { identity, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import type { Post, User } from './types'

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>HELPERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type TResErrorDependent = O.Option<never>[]
type TResSuccess = O.Option<User[] | Post[]>[]
export type TResNetwork = TResErrorDependent | TResSuccess

const defer = <D>(callback: () => PromiseLike<D>, ms: number) => new Promise<D>((resolve) => {
  setTimeout(() => resolve(callback()), ms)
})

const fpFetch = <Data>(
  url: string,
  errorMessage: string
): TE.TaskEither<Error, Data> =>
  TE.tryCatch(
    () => defer(() => fetch(url).then(res => res.json()), 5000),
    () => new Error(errorMessage)
  )

const optionFetch = <Data>(
  url: string
): T.Task<O.Option<Data>> => pipe(
  url,
  TE.tryCatchK(
    () => defer(() => fetch(url).then(res => res.json()), 5000),
    () => O.none
  ),
  TE.match(
    () => O.none,
    x => O.of(x)
  )
)
const unwrapOptionTask = <T>(input: O.Option<T.Task<O.Option<T>>>): O.Option<T.Task<T>> => pipe(
  input,
  O.map(
    T.map(
      O.match(
        () => O.none as T,
        identity
      )
    )
  )
)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>CODE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const fetchAllUsers: TE.TaskEither<Error, User[]> = fpFetch<User[]>(
  'https://jsonplaceholder.typicode.com/users',
  'failed to fetch users'
)

/**
 *  O.Option<T.Task<O.Option<User[]>>>
 *
 *  O.None — pre-condition is not met (task will not be run)
 *  O.some(O.none) — pre-condition met is exist but task returned empty array
 *  O.some(O.some<User[]>) — pre-condition met is exist and task returned data
 */
export const fetchUserById = (user: User): O.Option<T.Task<O.Option<User[]>>> => pipe(
  user,
  O.fromPredicate((user: User) => user.id < 2),
  O.map(user => optionFetch<User[]>(
    `https://1jsonplaceholder.typicode.com/users/${user.id}`
  ))
  // unwrapOptionTask // => T.Task<O.Option<User[]>>
)

export const fetchPostsByUser = (user: User): O.Option<T.Task<O.Option<Post[]>>> => pipe(
  user,
  O.fromPredicate((user: User) => user.id < 2),
  O.map(user => optionFetch<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?userId=${
      user.id
    }`
  ))
  // unwrapOptionTask // => T.Task<O.Option<Post[]>>
)

export const fetchDependentData = (users: User[]): T.Task<TResNetwork> =>
  pipe(
    users,
    A.head,
    O.matchW(
      () => T.of([O.none]), // If users array is empty — () => Promise.resolve([O.none]))
      user =>
        pipe(
          [fetchUserById(user), fetchPostsByUser(user)] as O.Option<T.Task<O.Option<User[] | Post[]>>>[],
          A.filter(O.isSome), // Remove O.none elements (where id >= 2)
          A.map(el => el.value), // => Task<Option<User[] | Post[]>>>[]
          A.sequence(T.ApplicativePar)
        )
    )
  )

const combineAllFetch = pipe(
  fetchAllUsers,
  TE.map(fetchDependentData)
)

async function run() {
  pipe(
    await combineAllFetch(),
    E.bimap(
      e => console.error('Impl1', e.message),
      async (tasks) => {
        console.dir(await tasks(), { depth: 1 })
      }
    )
  )
}

// run()
