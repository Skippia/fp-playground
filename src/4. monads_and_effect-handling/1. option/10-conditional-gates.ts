import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function example1(a: string): O.Option<string> {
  if (!a.startsWith('lovely')) {
    return O.some(a)
  }

  return O.none
}

function example1Improved(a: string): O.Option<string> {
  return O.fromPredicate((a2: string) => a2.startsWith('lovely'))(a)
}

// ---------------------------------------------

const startsWithLovely = (a: string) => a.startsWith('lovely')

const containsMeet = (a: string) => a.includes('meet')

const endsWithYou = (a: string) => a.endsWith('you')

const oExample = (a: string | null): O.Option<string> =>
  pipe(
    a,
    O.fromNullable,
    O.flatMap(O.fromPredicate(startsWithLovely)),
    O.flatMap(O.fromPredicate(endsWithYou)),
    O.flatMap(O.fromPredicate(containsMeet))
  )

// ---------------------------------------------
type TCondition = (a: string) => boolean
const conditions = [startsWithLovely, containsMeet, endsWithYou] as TCondition[]

export const oExampleImproved = (a: string): O.Option<string> =>
  /**
   * Accumulator always equals to the initial value O.some(a)
   * It does always full iteration through all conditions
   */
  A.reduce(O.some(a), (acc: O.Option<string>, cur: TCondition) => {
    const result = pipe(
      acc, // O.Option<string>
      O.map(O.fromPredicate(cur)), // O.Option<O.Option<string>>, cause O.map always wraps value into O.Option
      O.flatten // O.Option<string>
    ) // ?
    return result
  })(conditions)

oExampleImproved('lovely meet you!') // ?
// oExampleImproved('lovely meet you') // ?
