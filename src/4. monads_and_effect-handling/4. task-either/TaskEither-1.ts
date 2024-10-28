import axios from 'axios'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
/**
 * ! TaskEither - basic introduction
 */

/**
 * TaskEither is Data Structure (Container), which helps you to store data with two possible states after an asynchronous action:
 * E the value is on the left(Left)
 * or it is on the right (Right).
 * We store the error value in Left and the data value in Right.
 * For asynchronous action that never fails, use Task instead.
 */

// Example 1
const checkAgeAsync = (age: number) => {
  if (age >= 18) {
    return Promise.resolve('Allowed.')
  }
  return Promise.reject(new Error('Not allowed.'))
}

checkAgeAsync(20)
  .then(msg => console.log(msg))
  .catch(error => console.log(error))

checkAgeAsync(12)
  .then(msg => console.log(msg))
  .catch(error => console.log(error))

// async/await style with try catch
const _main = async () => {
  try {
    // Return the age value back (20)
    const allowedAge = await checkAgeAsync(20)
    // Return "Not allowed"
    const underAge = await checkAgeAsync(12)
  }
  catch (error) {
    console.log({ error })
  }
}

// Let’s do the same using TaskEither:

const checkAgeUsingTaskEither = TE.fromPredicate(
  (age: number) => age >= 18,
  () => new Error('Not allowed.')
)

const mainWithTaskEither = async () => {
  try {
    // The return value is Either<Error, number>
    // Return Either.right(20)
    const allowedAge = await checkAgeUsingTaskEither(20)()
    pipe(
      allowedAge,
      // Destruct and handle the data
      E.match(
        (error) => {
          throw error
        },
        msg => console.log({ msg })
      )
    )
  }
  catch (error) {
    console.log({ error })
  }
}

void mainWithTaskEither()

// ==================================================

// Example 2

// Make a network call to a third part API
const fetchAPI = async (url: string) => {
  try {
    const response = await axios.get(url)
    return response
  }
  catch (error) {
    throw new Error(String(error))
  }
}

// Mock db client type
type DbClientMock = {
  findById: (id: number) => Promise<{
    id: number
    name: string
  }>
}

// Query the database using the id
const fetchDB = (dbClient: DbClientMock) => async (id: number) => {
  try {
    const response = await dbClient.findById(id)
    return response
  }
  catch (error) {
    throw new Error(String(error))
  }
}

// Mock db client
const dbClientMock = {
  findById: (id: number) => Promise.resolve({ id, name: 'demoObjName' })
}

const main = async () => {
  try {
    const apiUrl = 'https://api.github.com/users/github'
    const apiResult = await fetchAPI(apiUrl)
    const id = apiResult.data.id

    const dbResult = await fetchDB(dbClientMock)(id)
    console.log(dbResult)
  }
  catch (error) {
    console.error(error)
  }
}
void main()

// TaskEither version:

const fetchAPIUsingTaskEither = TE.tryCatchK(
  (url: string) => axios.get(url),
  reason => new Error(String(reason))
)

const fetchDbUsingTaskEither = (dbClient: DbClientMock) =>
  TE.tryCatchK(
    (id: Parameters<DbClientMock['findById']>[0]) => dbClient.findById(id),
    reason => new Error(String(reason))
  )

const mainWithTaskEither2 = async () => {
  try {
    const apiUrl = 'https://api.github.com/users/github'

    const resultInTaskEither = pipe(
      apiUrl,
      fetchAPIUsingTaskEither,
      TE.flatMap(apiResult => fetchDbUsingTaskEither(dbClientMock)(apiResult.data.id))
    )

    const resultInEither = await resultInTaskEither()

    pipe(
      resultInEither,
      E.match(
        (error) => {
          throw error
        },
        result => console.log(result)
      )
    )
  }
  catch (error) {
    console.error(error)
  }
}
void mainWithTaskEither2()

// ==================================
/**
 * Note: if you do not need any argument for the asynchronous function,
 * you can use TE.tryCatch instead of TE.tryCatchK:
 */

const fetchUsingTryCatch = TE.tryCatch(
  () => axios.get('https://example.com'),
  reason => new Error(String(reason))
)
