import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

/**
 * Just illustration how we could implement the same function without
 * functional programming
 */
const _getBestMovieImperativeWay = (titles: ReadonlyArray<string>) => {
  const firstTitle = titles[0] // string | undefined

  if (firstTitle === undefined) {
    throw new Error('Cannot get the best movie')
  }

  return `Best - ${firstTitle.toUpperCase()}`
}

function head<A>(as: ReadonlyArray<A>): O.Option<A> {
  return as.length === 0 ? O.none : O.some(as[0])
}

function getBestMovie(titles: ReadonlyArray<string>): O.Option<string> {
  return pipe(
    titles,
    head, // extracts first element of array or returns O.none
    O.map((s) => s.toUpperCase()), // if s is O.None we just don't map anything, else run map-s
    O.map((s) => `Best - ${s}`)
  )
}

getBestMovie([]) // ?
getBestMovie(['hello', 'world']) // ?
