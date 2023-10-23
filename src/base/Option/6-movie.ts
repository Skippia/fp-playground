import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

type Movie = Readonly<{
  title: string
  releaseYear: number
  ratingPosition: number
  award?: string
}>

const movie1: Movie = {
  title: 'The King',
  releaseYear: 2018,
  ratingPosition: 1,
  award: 'Oscar',
}

const movie2: Movie = {
  title: 'Natural transformation',
  releaseYear: 2023,
  ratingPosition: 3,
}

const movie3: Movie = {
  title: 'Fun with loops',
  releaseYear: 2023,
  ratingPosition: 74,
}

const getMovieAwardHighlight = (movie: Movie): O.Option<string> =>
  pipe(
    movie.award,
    O.fromNullable,
    O.map((award) => `Awarded with ${award}`)
  )

const getMovieTop10Highlight = (movie: Movie): O.Option<string> =>
  pipe(
    movie,
    O.fromPredicate(({ ratingPosition }) => ratingPosition <= 10),
    O.map(({ ratingPosition }) => `In top 10 at position ${ratingPosition}`)
  )

const getMovieHighlight = (movie: Movie): string =>
  pipe(
    movie,
    getMovieAwardHighlight, // returns value if movie has award or O.none if not (* if *) [Option<string>]
    O.orElse(() => getMovieTop10Highlight(movie)), // we get here if prev func returns O.None (* if else *) [Option<string>]
    O.getOrElse(() => `Released in ${movie.releaseYear}`) // we get here if orElse returns O.None (* else *) [string]
  )

getMovieHighlight(movie1) // ?
getMovieHighlight(movie2) // ?
getMovieHighlight(movie3) // ?

const f = (a: O.Option<number>): O.Option<string> | number =>
  pipe(
    a,
    O.getOrElseW(() => O.some('invalids'))
  )
