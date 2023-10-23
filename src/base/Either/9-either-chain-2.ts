import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/lib/function'

interface Person {
  name: string
}

const goodPerson = {
  name: 'John',
}

const wrongPerson = {
  name: '!!!!',
}

/**
 * ? Did you notice the return value is string,
 * ? regardless of whether it is valid or not?
 */
function validateNameImperativeWay(name: string) {
  return /[a-zA-z]/.test(name) ? name : 'not a valid name!'
}

const validateNameFunctionalWay1 = E.fromPredicate(
  (string: string) => /[a-zA-z]/.test(string),
  (name) => `"${name}" is not a valid name!`
)

validateNameImperativeWay(goodPerson.name) // ?
validateNameImperativeWay(wrongPerson.name) // ?
validateNameFunctionalWay1(goodPerson.name) // ?
validateNameFunctionalWay1(wrongPerson.name) // ?

// ---------------------------------------------

const regexLetters = /[a-zA-z]/

const validateName: (name: string) => E.Either<string, string> = E.fromPredicate(
  (name) => regexLetters.test(name), // returns name if this function returns `true`
  (name) => `"${name}" is not a valid name!` // returns `fallback` if this function returns `false`
)

const makeUser: (name: string) => E.Either<Error, Person> = flow(
  validateName,
  E.map((name): Person => ({ name })),
  E.mapLeft((message) => new Error(message))
)

export const validateNameFunctionalWay2: (name: string) => string | Person = flow(
  makeUser,
  E.match(
    (error) => error.message,
    ({ name }) => `Hi, my name is "${name}"`
  )
)
/**
 * ? An alternative option is to use getOrElse,
 * ? which we can use if we don't need to change the output of the Right value in Either
 */
export const validateNameFunctionalWay3: (name: string) => string | Person = flow(
  makeUser,
  E.getOrElseW((error) => error.message)
)

validateNameFunctionalWay2(goodPerson.name) // ?
validateNameFunctionalWay2(wrongPerson.name) // ?

validateNameFunctionalWay3(goodPerson.name) // ?
validateNameFunctionalWay3(wrongPerson.name) // ?
