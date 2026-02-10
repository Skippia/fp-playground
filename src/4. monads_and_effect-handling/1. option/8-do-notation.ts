import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function example1() {
  const aOpt = O.fromNullable(3)
  const bOpt = O.fromNullable(1.5)

  const cOpt = pipe(
    O.Do,
    O.bind('a', () => aOpt),
    O.bind('b', () => bOpt),
    O.map(({ a, b }) => a + b)
  )

  return cOpt
}

example1() // ?

// --------------------------------------------------
type UserScore = {
  score: number | null
}

type User = {
  username: string
  score: UserScore['score']
}

function getUser(isGetUser: boolean, score: UserScore['score']): O.Option<User> {
  return isGetUser ? O.some({ username: 'some_user', score }) : O.none
}

function getUserScore(user: User): O.Option<UserScore> {
  return user.score === null ? O.none : O.some({ score: user.score })
}

function getUserLevel(user: User, userScore: UserScore): string {
  return `Level ${user.username} - ${userScore.score}`
}

function getLevel(isGetUser: boolean, initialScore: UserScore['score']): string {
  const level = pipe(
    O.Do,
    O.bind('user', () => getUser(isGetUser, initialScore)), // if returns O.none - we stop pipe
    O.bind('score', ({ user }) => getUserScore(user)), // if returns O.none - we stop pipe
    O.map(({ user, score }) => getUserLevel(user, score)), // if each bind didn't return O.none - run this function and return result
    O.getOrElse(() => 'Level unknown')
  )

  return level
}

getLevel(false, null) // ?
getLevel(false, 42) // ?

getLevel(true, null) // ?
getLevel(true, 42) // ?
//
