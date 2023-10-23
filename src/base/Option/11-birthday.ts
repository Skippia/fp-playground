import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

function getDateParts(date: Date): number[] {
  return [date.getFullYear(), date.getMonth(), date.getDate()]
}

function isMatchBithdayToday(date: Date): boolean {
  const [_, currentMonth, currentDay] = getDateParts(new Date())
  const [__, birthdayMonth, birthdayDay] = getDateParts(date)

  return currentMonth === birthdayMonth && currentDay === birthdayDay
}

function getBirthdayGreeting(name: string, birthday?: Date): string {
  const checkBirthdayIsToday = (bd: Date): string =>
    pipe(
      bd,
      O.fromPredicate(isMatchBithdayToday),
      O.map(() => `Your birthday is today!`),
      O.getOrElse(() => `${name}, your birthday not today!`)
    )

  return pipe(
    birthday,
    O.fromNullable,
    O.map(checkBirthdayIsToday),
    O.getOrElseW(() => `${name}, set please your birthday`)
  )
}

getBirthdayGreeting('Robert', new Date('09/20/1977')) // ?
getBirthdayGreeting('Robert', new Date('10/25/1977')) // ?
getBirthdayGreeting('Robert') // ?
