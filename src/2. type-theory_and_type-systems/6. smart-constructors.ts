/* eslint-disable style/max-len */
import { pipe } from 'fp-ts/lib/function'
import type { HKT, Kind, URIS } from 'fp-ts/lib/HKT'
import * as O from 'fp-ts/Option'

/**
 * [Definition]:
 * A smart constructor is a function that encapsulates the logic of creating instances
 * of a data type while enforcing certain invariants or validation rules.
 * It ensures that only valid instances can be created.
 */
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

// person('', -1.2) // no error in runtime (in compile time yes, but is not sufficient)

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

export type MakeRefinement<F extends URIS, FromType, IntoType> = (f: FromType) => Kind<F, IntoType>
export type MakeRefinementOption<FromType, IntoType> = MakeRefinement<'Option', FromType, IntoType>

export function isInt(n: number): n is Int {
  return Number.isInteger(n) && n >= 0
}

function isNonEmptyString(s: string): s is NonEmptyString {
  return s.length > 0
}

export const makeInt: MakeRefinementOption<number, Int> = O.fromPredicate(isInt)
export const makeNonEmptyString: MakeRefinementOption<string, NonEmptyString> = O.fromPredicate(isNonEmptyString)

makeInt(10) // Some(10)
makeInt(-5) // None

makeNonEmptyString('') // None
makeNonEmptyString('name') // Some(name)

// ---------------------------

// @ts-expect-error ...
person('', -1.2) // static error (error only in compile time)
// @ts-expect-error ...
person('xxx', -1.2) // static error (error only in compile time)

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

function _checkPerson(
  initialName: O.Option<NonEmptyString>,
  initialAge: O.Option<Int>
): O.Option<Person> {
  return pipe(
    O.Do,
    O.bind('name', () => initialName),
    O.bind('age', () => initialAge),
    O.map(({ name, age }) => person(name, age))
  )
}

console.log(checkPerson(goodName, goodAge)) // ?
console.log(checkPerson(badName, goodAge)) // ?
console.log(checkPerson(goodName, badAge)) // ?
console.log(checkPerson(badName, badAge)) // ?
