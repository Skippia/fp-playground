import { sequenceT } from 'fp-ts/Apply'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import type { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { getSemigroup } from 'fp-ts/NonEmptyArray'

const minLength = (s: string): E.Either<string, string> =>
  s.length >= 6 ? E.right(s) : E.left('at least 6 characters')

const oneCapital = (s: string): E.Either<string, string> =>
  /[A-Z]/.test(s) ? E.right(s) : E.left('at least one capital letter')

const oneNumber = (s: string): E.Either<string, string> =>
  /\d/.test(s) ? E.right(s) : E.left('at least one number')

const validatePasswordFirstError = (s: string): E.Either<string, string> =>
  pipe(
    s,
    E.of, // string -> E.Either<never, string>
    E.flatMap(minLength),
    E.flatMap(oneCapital),
    E.flatMap(oneNumber)
  )
/**
 * ? Store only first error message (from handler pipe)
 */
validatePasswordFirstError('xzx') // ?
// --------------------------------------------------

const applicativeValidation = E.getApplicativeValidation(getSemigroup<string>())

function lift<E, A>(check: (a: A) => E.Either<E, A>): (a: A) => E.Either<NonEmptyArray<E>, A> {
  return a =>
    pipe(
      check(a),
      E.mapLeft(x => [x])
    )
}

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)

export function validatePasswordAllErrors(s: string): E.Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(applicativeValidation)(minLengthV(s), oneCapitalV(s), oneNumberV(s)),
    E.map(() => s)
  )
}

/**
 * ? Store all error messages
 */
validatePasswordAllErrors('xzx1') // ?

// --------------------Appendix-------------------------

type Person = {
  name: string
  age: number
}

const toPerson = ([name, age]: [string, number]): Person => ({
  name,
  age
})

const validateName = (s: string): E.Either<NonEmptyArray<string>, string> =>
  s.length === 0 ? E.left(['Invalid name']) : E.right(s)

const validateAge = (s: string): E.Either<NonEmptyArray<string>, number> =>
  Number.isNaN(Number(s)) ? E.left(['Invalid age']) : E.right(Number(s))

function validatePerson(name: string, age: string): E.Either<NonEmptyArray<string>, Person> {
  return pipe(
    sequenceT(applicativeValidation)(validateName(name), validateAge(age)),
    E.map(toPerson)
  )
}

validatePerson('John', '1x') // ?
