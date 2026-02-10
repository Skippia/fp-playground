/* eslint-disable style/max-len */
import { pipe } from 'fp-ts/lib/function'
import type { Kind, URIS } from 'fp-ts/lib/HKT'
import * as O from 'fp-ts/Option'

type Person = {
  name: NonEmptyString
  age: Int
}

function person(name: NonEmptyString, age: Int): Person {
  return { name, age }
}

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

const goodName = makeNonEmptyString('Giulio')
const badName = makeNonEmptyString('')
const goodAge = makeInt(45)
const badAge = makeInt(-1.2)

// ---------------------------------------------------------------

function checkPerson(
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
