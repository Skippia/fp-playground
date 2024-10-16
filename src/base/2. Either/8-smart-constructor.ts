import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import type * as O from 'fp-ts/Option'

function example1(obj: Record<string, number>): E.Either<string, number> {
  /**
   * They are equal
   */
  // const either = obj?.param === undefined ? E.left('bad') : E.right(obj.param)
  const either = pipe(obj.param, E.fromNullable('bad'))

  return either
}

example1({}) // ?
example1({ param: 1 }) // ?

// ---------------------------------------------

function example2(opt: O.Option<number>): E.Either<string, number> {
  /**
   * They are equal
   */
  // const either = O.isNone(opt) ? E.left('bad') : E.right(opt.value)
  const either = pipe(
    opt,
    E.fromOption(() => 'bad')
  )

  return either
}

// ---------------------------------------------

type User = {
  verified: boolean
}

function example3(user: User): E.Either<string, User> {
  /**
   * They are equal
   */
  // const either = user.verified ? E.right(user) : E.left('bad')
  const either = pipe(
    user,
    E.fromPredicate(
      user => user.verified,
      () => 'bad'
    )
  )

  return either
}
//
