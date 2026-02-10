/* eslint-disable ts/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { compose } from 'ramda'

// Helpers
const toUpperCase = (s: string): string => s.toUpperCase()
const toReverse = (s: string): string => s.split('').reverse().join('')
const concat = (s1: string) => (s2: string): string => s1 + s2

/**
 * ! Applicative functor laws
 * There are four applicative functor laws you need to follow
 * if you are going to create your own applicative functor:
 * — Identity
 * — Homomorphism
 * — Interchange
 * — Composition
 */

const identity = <T>(x: T): T => x

const f = (x: number) => x + 1
const ff = O.of(f)

const a = 5
const fa = O.of(a)

// ? Note: "===" means "≡" in this context
//* Applying the identity function within the context should have no effect on the applicative value
O.ap(fa)(O.of(identity)) === fa // ! Identity (1nd law)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//* Applying a pure function (ff) to a pure value (fa) equals to:
//* Applying the function to the value outside and then lifting the result into the context
O.ap(fa)(ff) === O.of(f(a)) // ! Homomorphism (2nd law)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//* Applying a pure function (ff) to a pure value (fa) equals to:
//* Applying a pure function X: (f: (a: A) => B) => f(a) to pure function (ff)
O.ap(fa)(ff) === O.ap(ff)(O.of(f => f(a))) // ! Interchange (3nd law)
/**
 * Another words it applies function wrapped in context:
 * X: f => f(a) to a value wrapped in the same context: f
 * ==>
 * (f => f(a))(f) ≡ (f => f(5))(incr) // 6
 */

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//* Applying composed functions within the context should behave associatively

const u = O.of(toUpperCase)
const rev = O.of(toReverse)
const con = O.of(concat('beyond & '))
const val = O.of('blood bath ')

type TComposer<T> = (f: (a: T) => T) => (g: (a: T) => T) => (k: (a: T) => T) => (a: T) => T
const composer: TComposer<string> = f => g => k => a => f(g(k(a)))

const left = pipe(
  O.of(composer),
  O.ap(u),
  O.ap(con),
  O.ap(rev),
  O.ap(val)
)

const right = pipe(
  u,
  O.ap(pipe(
    con,
    O.ap(pipe(
      rev,
      O.ap(val)
    ))
  ))
)

left === right // ! Composition (4th law)
