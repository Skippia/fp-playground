import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function doubler(n: number): O.Option<number> {
  return O.some(n * 2)
}
function tripler(n: number): O.Option<number> {
  return n === 2 ? O.none : O.some(n * 3)
}

function pow3r(n: number): O.Option<number> {
  return O.some(n ** 3)
}

const result = (n: number) =>
  pipe(
    O.of(n),
    O.bindTo('original'),
    O.bind('doubled', ({ original }) => doubler(original)),
    O.bind('tripled', ({ doubled }) => tripler(doubled)), // if any of bind returns O.none - we return O.none as well
    O.bind('cubed', ({ tripled }) => pow3r(tripled))
  )

result(1) // ?
result(2) // ?
