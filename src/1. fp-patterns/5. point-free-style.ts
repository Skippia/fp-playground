/**
 * [Definition]:
 * Point-free style is a way of defining functions without explicitly mentioning the arguments on which they operate
 */
import { flow } from 'fp-ts/lib/function'

const toUpperCase = (s: string): string => s.toUpperCase()
const exclaim = (s: string): string => s + '!'

// ! Point-ful style
const pointfulUpEx = (s: string) => {
  const uppercased = toUpperCase(s)
  return exclaim(uppercased)
}

// ! Point-free style
const pointfreeUpEx = flow(toUpperCase, exclaim)

console.log(pointfulUpEx('hello')) // HELLO!
console.log(pointfreeUpEx('hello')) // HELLO!

// -------------------------------------------------
/*
// !! not pointfree because we mention the data: name
const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ')

// !! pointfree
const initials = compose(intercalate('. '), map(compose(toUpperCase, head)), split(' '))

initials('hunter stockton thompson') // 'H. S. T'
 */
