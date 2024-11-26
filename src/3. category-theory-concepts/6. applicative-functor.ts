import type { Kind, URIS } from 'fp-ts/HKT'
import type * as A from 'fp-ts/lib/Applicative'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

/**
 * The true essence (crux) of applicative functor
 */

// 1. We have such need to perform calculation:
const add = (a: number) => (b: number): number => a + b
const add3 = (a: number) => (b: number) => (c: number): number => a + b + c
const val1 = pipe(
  O.of(2),
  O.flatMap(x => O.map(add(x))(O.of(3))
  )
) // O.of(5)

// but is very verbose and we want somehow make it more easier...

/**
 * 2. Do the same using applicative functor
 * (which was designed in order to solve this problem)
 */
const val2 = O.ap(O.of(2))(O.of(add(3))) // O.of(5)

// 3. Make on step forward
const x = O.ap(O.of(2))(O.of(add)) // F<f> = O.of(add(2))
const fx = O.ap(O.of(3))(x) // F<a> = O.ap(O.of(3))(O.of(add(2))) = O.of(add(2)(3))
// or
const fx2 = pipe(
  O.of(add),
  O.ap(O.of(2)),
  O.ap(O.of(3))
)

/**
 * One more example:
 */

/*
$ :: String -> IO DOM
const $ = selector => new IO(() => document.querySelector(selector))

// getVal :: String -> IO String
const getVal = compose(map(prop('value')), $)

// signIn :: String -> String -> Bool -> User
const signIn = curry((username, password, rememberMe) => { ...signing in })

IO.of(signIn).ap(getVal('#email')).ap(getVal('#password')).ap(IO.of(false))
// IO({ id: 3, email: 'gg@allin.com' })
 */

/**
 * ! Lift interfaces
 */
type TLiftA2<F extends URIS> =
(F: A.Applicative1<F>) =>
<A, B, C>(f: ((a: A) => (b: B) => C)) =>
(fa: Kind<F, A>) =>
(fb: Kind<F, B>) => Kind<F, C>

type TLiftA3<F extends URIS> =
(F: A.Applicative1<F>) =>
<A, B, C, D>(f: ((a: A) => (b: B) => (c: C) => D)) =>
(fa: Kind<F, A>) =>
(fb: Kind<F, B>) =>
(fc: Kind<F, C>) => Kind<F, D>

const liftA2: TLiftA2<'Option'> = F => f => fa => (fb) => {
  const x = F.map(fa, f) // O.Option<(b: B) => C>
  const y = F.ap(x, fb) // O.Option<C>
  return y
}

const liftA3: TLiftA3<'Option'> = F => f => fa => fb => (fc) => {
  const x = F.map(fa, f)
  const y = F.ap(x, fb)
  const z = F.ap(y, fc)
  return z
  // pipe(
  //   fa,
  //   O.map(f),
  //   O.ap(fb),
  //   O.ap(fc)
  // )
}

const y = liftA2(O.Applicative)(add)(O.of(2))(O.of(3)) // O.of(7)
const z = liftA3(O.Applicative)(add3)(O.of(2))(O.of(3))(O.of(4)) // O.of(9)
const n = liftA3(O.Applicative)(add3)(O.of(2))(O.of(3))(O.none) // O.none

/**
 * -- Haskell / PureScript
 * ? add <$> Right 2 <*> Right 3
 * -- JavaScript
 * map(add, Right(2)).ap(Right(3));
 */

export { liftA2, liftA3 }
export type { TLiftA2, TLiftA3 }
