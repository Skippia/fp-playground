import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

/* eslint-disable newline-per-chained-call */

function badExample() {
  const aOpt = O.fromNullable(1)
  const bOpt = O.fromNullable(2)

  return pipe([aOpt, bOpt], A.filter(O.isSome), A.head, O.flatten)
}

badExample() // ?

function goodExample() {
  const userSetting: O.Option<string> = O.none
  const companySetting: O.Option<string> = O.none
  const defaultSetting: string = 'yellow'

  return pipe(
    userSetting,
    O.orElse(() => companySetting),
    O.getOrElse(() => defaultSetting)
  )
}

goodExample() // ?
