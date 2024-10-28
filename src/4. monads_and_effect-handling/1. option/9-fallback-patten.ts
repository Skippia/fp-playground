import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function badExample() {
  const aOpt = O.fromNullable(1)
  const bOpt = O.fromNullable(2)

  return pipe([aOpt, bOpt], A.filter(O.isSome), A.head, O.flatten)
}

badExample() // ?

function goodExample() {
  const userSetting: O.Option<string> = O.none
  const companySetting: O.Option<string> = O.none
  const defaultSetting = 'yellow'

  return pipe(
    userSetting,
    O.orElse(() => companySetting),
    O.getOrElse(() => defaultSetting)
  )
}

goodExample() // ?
