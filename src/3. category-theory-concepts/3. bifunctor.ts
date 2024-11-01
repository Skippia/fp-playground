/**
 * map = g => bimap(id, g)
 * mapLeft = f => bimap(f, id)
 * id = bimap(id, id)
 * bimap = f => g => mapLeft(f) ∘ map(g)
 * bimap = f => g => map(g) ∘ mapLeft(f)
 * map(f ∘ g) = map(f) ∘ map(g)
 * mapLeft(f ∘ g) = mapLeft(f) ∘ mapLeft(g)
 */

import * as E from 'fp-ts/Either'
import type { Kind2, URIS2 } from 'fp-ts/HKT'
import { pipe } from 'fp-ts/lib/function'

type Bifunctor2<F extends URIS2> = {
  URI: F
  bimap: <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) => (fab: Kind2<F, A, B>) => Kind2<F, C, D>
}

const EitherFunctor: Bifunctor2<'Either'> = {
  URI: 'Either',
  bimap: (f, g) =>
    E.match(
      a => E.left(f(a)),
      b => E.right(g(b))
    )
}

const isEmail = (email: string) => email.includes('@')
const toString = (val: number) => `The value is: ${val}`

const eitherFunctor = EitherFunctor.bimap(toString, isEmail)

const val = eitherFunctor(E.left(12))
const val2 = eitherFunctor(E.right('helloworld'))
const val3 = eitherFunctor(E.right('hello@world'))

console.dir(
  {
    val,
    val2,
    val3
  },
  { depth: Infinity }
)

// ------------------------

const l1 = E.left('Error 1') as E.Left<string>
const l2 = E.left('Error 2') as E.Left<string>

const r: E.Either<string, number> = E.of(1)
const r2: E.Either<string, number> = E.left('Initial error')

const combineErrors = (customError: E.Left<string>) => (e: string[] | string): string[] =>
  Array.isArray(e) ? [...e, customError.left] : [e, customError.left]

const res = pipe(
  // r,
  r2,
  E.bimap(
    combineErrors(l1),
    a => a + 1
  ),
  E.bimap(
    combineErrors(l2),
    a => a * 2
  )
)

console.log(res)
