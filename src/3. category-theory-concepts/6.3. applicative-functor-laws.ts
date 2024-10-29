/* eslint-disable ts/no-unused-expressions */
/* eslint-disable no-unused-expressions */
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

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
const fidentity = O.of(identity)

const f = (x: number) => x + 1
const g = (x: number) => x * 2
const fab = O.of(f)
const fbc = O.of(g)

const a = 5
const fa = O.of(a)

// ? Note: "===" means "≡" in this context
O.ap(fa)(fidentity) === fa // ! Identity (1nd law)
O.ap(fa)(fab) === O.of(f(a)) // ! Homomorphism (2nd law)

// Applying a pure function (ff) to a pure value (fa) equals to:
// Applying a pure function X: (f: (a: A) => B) => f(a) to pure function (ff)
O.ap(fa)(fab) === O.ap(fab)(O.of(f => f(a))) // ! Interchange (3nd law)
/**
 * Another words it applies function wrapped in context:
 * X: f => f(a) to a value wrapped in the same context: f
 * ==>
 * (f => f(a))(f) ≡ (f => f(5))(incr) // 6
 */

// ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>
// of: <A>(a: A) => Option<A>

/**
 * ? Simplified:
 * Step1: x1 = fbc => fab => x => fbc(fab(a))
 * Step2: x2 = x1(fbc)
 * Step3: x3 = x1(fbc)(fab)
 * Step4: x4 = x1(fbc)(fab)(fa)
 * Summary: x4 = (fbc => fab => a => fbc(fab(a)))(fbc)(fab)(fa)
 * Summary: x4 = (fbc => fab => a => fbc(fab(a)))(double)(incr)(5)
 */
const left = O.ap(fa)(
  O.ap(fab)( //
    O.ap(fbc)( //
      (O.of(fbc => fab => a => fbc(fab(a)))) //
    )
  )
)
/**
 * ? Simplified:
 * Step1: x1 = fab(fa)
 * Step2: x2 = fbc(x1)
 * Summary: x2 = fbc(fab(fa))
 * Summary: x2 = double(incr(5))
 */
const right = O.ap(O.ap(fa)(fab))(fbc)

// Applying composed functions within the context should behave associatively
left === right // ! Composition (4th law)
