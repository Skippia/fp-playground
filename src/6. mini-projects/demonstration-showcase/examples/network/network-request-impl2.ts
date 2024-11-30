/* eslint-disable ts/no-floating-promises */
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { fetchAllUsers, fetchDependentData } from './network-request-impl1'
import type { TResNetwork } from './network-request-impl1'

const combineAllFetch: TE.TaskEither<Error, TResNetwork> = pipe(
  fetchAllUsers,
  TE.flatMap(users => pipe(
    users,
    fetchDependentData,
    TE.rightTask
  )
  )
)

async function run() {
  pipe(
    await combineAllFetch(),
    E.match(
      e => console.error(e.message),
      data => console.dir(data, { depth: 1 })
    )
  )
}

run()
