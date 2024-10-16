import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

/**
 * ! The problem
 */

type Person = {
  name: NonEmptyString
  age: Int
}

function person(name: NonEmptyString, age: Int): Person {
  return { name, age }
}

// person('', -1.2) // no error

/**
 * ! The recipe:
 * ? 1. define a type R which represents the refinement (predicate)
 * ? 2. do not export a constructor for R
 * ? 3. do export a function (the smart constructor) with the following signature:
 * ? make: (t: T) => O<R>
 */

export type IntBrand = {
  // for any type R we should define unique symbol in order to guarantee uniqueness
  readonly Int: unique symbol
}
export type NonEmptyStringBrand = {
  // ensures uniqueness across modules / packages
  readonly NonEmptyString: unique symbol
}

export type Int = number & IntBrand
export type NonEmptyString = string & NonEmptyStringBrand

export function isInt(n: number): n is Int {
  return Number.isInteger(n) && n >= 0
}

function isNonEmptyString(s: string): s is NonEmptyString {
  return s.length > 0
}

export const makeInt: (n: number) => O.Option<Int> = O.fromPredicate(isInt)
export const makeNonEmptyString = O.fromPredicate(isNonEmptyString)

makeInt(10) // Some(10)
makeInt(-5) // None

makeNonEmptyString('') // None
makeNonEmptyString('name') // Some(name)

// ---------------------------

// @ts-expect-error ...
person('', -1.2) // static error
// @ts-expect-error ...
person('xxx', -1.2) // static error

const goodName = makeNonEmptyString('Giulio')
const badName = makeNonEmptyString('')
const goodAge = makeInt(45)
const badAge = makeInt(-1.2)

/**
 * They are the same
 */
function checkPerson(name: O.Option<NonEmptyString>, age: O.Option<Int>): O.Option<Person> {
  return pipe(
    name,
    O.flatMap(name =>
      pipe(
        age,
        O.map(age => person(name, age))
      )
    )
  )
}
function _checkPerson(name: O.Option<NonEmptyString>, age: O.Option<Int>): O.Option<Person> {
  return pipe(
    O.Do,
    O.bind('name', () => name),
    O.bind('age', () => age),
    O.map(({ name, age }) => person(name, age))
  )
}

checkPerson(goodName, goodAge) // ?
checkPerson(badName, goodAge) // ?
checkPerson(goodName, badAge) // ?
checkPerson(badName, badAge) // ?
