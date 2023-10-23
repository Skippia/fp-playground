/**
 * ? The core idea is to use an Option to represent the "presence" of a value or provides a "custom error message"
 */

import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

interface User {
  verified: boolean
  has2FA: boolean
}

const validateUserIsVerified = (user: User): E.Either<string, User> => {
  return user.verified ? E.right(user) : E.left('User must be verified')
}

const validateUserHas2FA = (user: User): E.Either<string, User> => {
  return user.has2FA ? E.right(user) : E.left('User must setup 2FA')
}

/**
 * ? In this apporach our validaton functions returns Either<ErrorStrig, User>
 * ? and we just go down the chain
 */
const validateUserOneWay = (user: User): string | User => {
  return pipe(
    user,
    E.of,
    E.flatMap(validateUserIsVerified), // if return E.left, then return E.left or go on
    E.flatMap(validateUserHas2FA), // return either left or right
    E.matchW(
      (err) => err,
      (user) => user
    )
  )
}

validateUserOneWay({
  verified: false,
  has2FA: false,
}) // ?

validateUserOneWay({
  verified: false,
  has2FA: true,
}) // ?

validateUserOneWay({
  verified: true,
  has2FA: false,
}) // ?

validateUserOneWay({
  verified: true,
  has2FA: true,
}) // ?

// ---------------------------------------------

const userIsVerified = (user: User): boolean => {
  return user.verified
}

const userHas2FA = (user: User): boolean => {
  return user.has2FA
}

interface Time {}

// const parseTime = (time: string): E.Either<string, Time> => {
// return E.left("It's not a good time")
// }

const parseTime = (time: string): O.Option<Time> => {
  return O.none
}

const validateUserSecondWay = (user: User): E.Either<string, User> => {
  const _either2 = pipe(
    user,
    E.of,
    E.filterOrElse(userIsVerified, () => 'User must be verified to post messages'),
    E.filterOrElse(userHas2FA, () => 'User must setup 2FA')
  )
  return _either2
}

validateUserSecondWay({
  verified: false,
  has2FA: false,
}) // ?

validateUserSecondWay({
  verified: false,
  has2FA: true,
}) // ?

validateUserSecondWay({
  verified: true,
  has2FA: false,
}) // ?

validateUserSecondWay({
  verified: true,
  has2FA: true,
}) // ?

// ---------------------------------------------

function validateTime(): E.Either<string, Time> {
  const time = '09:30am'
  const _either3 = pipe(
    time,
    parseTime,
    E.fromOption(() => 'Invalid time')
  )
  return _either3
}

validateTime() // ?
