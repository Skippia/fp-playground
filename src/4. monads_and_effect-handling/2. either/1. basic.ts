import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'

type Person = {
  name: string
  age: number
  nationality: string
}

const personA = {
  name: 'A',
  age: 17,
  nationality: 'Amercian'
}

/**
 * Imperative approach
 */
const _checkEligibility = (person: Person): Person | string => {
  if (person.age <= 18) {
    return 'The Person\'s age must be under 18'
  }

  if (person.nationality !== 'American') {
    return 'The Person\'s must be a U.S. citizen'
  }

  return person
}

if (typeof _checkEligibility(personA) === 'string') {
  // ... handle not elgible case
}
else {
  // ... handle elgible case
}

/**
 * Functional approach
 */
const checkEligibility = (person: Person) =>
  pipe(
    person,
    E.fromPredicate(
      person => person.age <= 18,
      () => 'The Person\'s age must be under 18'
    ),
    E.chain(
      E.fromPredicate(
        person => person.nationality === 'American',
        () => 'The Person must be a U.S. citizen'
      )
    )
  )

// ==================================================

type Nullable<T> = T | undefined | null

const getValidStringE = (field: Nullable<string>) =>
  pipe(
    field,
    E.fromNullable(new Error(`${field} is null or undefined`)),
    E.flatMap(E.fromPredicate(S.isString, value => new Error(`${value} is not a string`)))
  )

const getValidEmailFormat = (regex: RegExp) => (email: string) =>
  pipe(
    email,
    E.fromPredicate(
      value => regex.test(value),
      value => new Error(`"${value}" is not in a valid email format`)
    )
  )

const getValidEmailUsingDefaultRegex = getValidEmailFormat(/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/)

/*
  For email, first check if it is a valid string or not, then check if it is a valid email or not
  We compose the functions here using "flow"!
  And we use "chain" because we want to flatten the result
*/
const getValidEmailAddressesE = flow(getValidStringE, E.flatMap(getValidEmailUsingDefaultRegex))

// @ts-expect-error ...
getValidEmailAddressesE(45) // ?
getValidEmailAddressesE(undefined) // ?
getValidEmailAddressesE('myemail@email.com') // ?
getValidEmailAddressesE('myemailemail.com') // ?
