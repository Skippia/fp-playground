/**
 * Dependant promises
 */

/**
 * There are several useful functions in Do notation:
 * .Do, .apS, .apSW, .bind, .bindTo, .bindW and .let .
 * They are just syntactic sugar functions to manipulate the value inside the TaskEither container.
 * These functions help you to avoid unnecessary unwrapping and wrapping the values between several TaskEither container
 */

import axios from 'axios'
import * as E from 'fp-ts/Either'
import { identity, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

const fetchAPI = TE.tryCatchK(
  (url: string) => axios.get(url),
  reason => new Error(String(reason))
)

const withoutUsingDoNotation = async () => {
  try {
    const fetchUserUrl = 'https://api.github.com/users/github'
    const userResultInTaskEither = pipe(fetchUserUrl, fetchAPI)

    const userResultInEither = await userResultInTaskEither()
    // Throw the error value
    if (E.isLeft(userResultInEither)) {
      throw userResultInEither
    }

    const userResult = userResultInEither.right

    // Fetch token using the user id
    const fetchTokenUrl = `https://fetchTokenExample/${userResult.data.id}`
    const tokenResultInTaskEither = pipe(fetchTokenUrl, fetchAPI)

    const tokenResultInEither = await tokenResultInTaskEither()
    // Throw the error value
    if (E.isLeft(tokenResultInEither)) {
      throw tokenResultInEither
    }

    const tokenResult = tokenResultInEither.right

    // Use both the token and id to fetch orders
    // @ts-expect-error ...
    const fetchOrdersUrl = `https://fetchOrdersExample?token=${token}&id=${userId}`
    const ordersEitherResultInTaskEither = pipe(fetchOrdersUrl, fetchAPI)
    const ordersResultInEither = await ordersEitherResultInTaskEither()

    // Continue with the result ....
  }
  catch (error) {
    console.error(error)
  }
}
withoutUsingDoNotation()

/**
 * If the value in TaskEither is only consumed by the next function in your pipeline of functions,
 * you do not need to use the functions in Do notation.
 * You can just use .chain or .map or other helper functions to pipe the value to the next function.
 * However, if you need to use the value in TaskEither more than once,
 * not just the next function, you should use the functions in Do notation.
 */

export const getAllResults = () => {
  const fetchUserUrl = 'https://api.github.com/users/github'
  const userResultInTaskEither = pipe(fetchUserUrl, fetchAPI)

  const allResultInTaskEither = pipe(
    TE.Do,
    /*
      The next function will receive a result in object type with key "userResult",
      you can access the result of userResultInTaskEither by using the key "userResult"

      Use .apS if you have a TaskEither
    */
    TE.apS('userResult', userResultInTaskEither),
    /*
      An object type with key "userResult" is accessible in the argument.
      The "tokenResult" will be added to the object
      Use .bind if you have a function that return a TaskEither
    */
    TE.bind('tokenResult', ({ userResult }) => {
      const userId = userResult.data.id
      const fetchTokenUrl = `https://fetchTokenExample?id=${userId}`
      const tokenResultInTaskEither = pipe(fetchTokenUrl, fetchAPI)

      return tokenResultInTaskEither
    }),
    TE.bind('ordersResult', ({ userResult, tokenResult }) => {
      const userId = userResult.data.id
      const token = tokenResult.data.token
      const fetchOrdersUrl = `https://fetchOrdersExample?token=${token}&id=${userId}`
      const ordersEitherResultInTaskEither = pipe(fetchOrdersUrl, fetchAPI)

      return ordersEitherResultInTaskEither
    })
  )
  return allResultInTaskEither
}

const main = async () => {
  try {
    /*
      All the "userResult", "tokenResult" and "ordersResult" are accessible.
    */
    const allResultInEither = await getAllResults()()
    pipe(
      allResultInEither,
      E.match(
        (error) => {
          throw error
        },
        // Same as result => result
        identity
      )
    )
  }
  catch (error) {
    console.error(error)
  }
}

/**
 * The default behavior for TE.bind - to trigger only [the function which it receives
 * for processing the input data] only if [the input data is a TaskEither.right value].
 *
 * For example, in case 2, when the fetching of user failed, axios.get is triggered only once for fetching the user.
 * The fetching for token and orders are not triggered because userResultInTaskEither
 * returns a TaskEither.left(Error('user not found')), the next two TE.bind for fetching token
 * and orders will not trigger the fetch function when they receive a TaskEither.left value.
 * As a result, you will get the Error message 'user not found' wrapped in TaskEither.left.
 */

/**
 * A simplified version of the implementation of TE.bind to illustrate the idea:
 */

// Inside TaskEither
const bind = (keyname: string, fn: Function) => (ma: TE.TaskEither<Error, string>) => {
  // if it receives a TaskEither.left value, just return it
  if (TE.isLeft(ma)) {
    return ma
  }

  /*
    If it receives a TaskEither.right value,
    extract the wrapped value,
    then trigger the function fn with the value,
  */
  return (
    ma()
      .then(a => E.isLeft(a)
        ? TE.left(a)
        : TE.right({
          ...a.right,
          [keyname]: fn(a.right)
        })
      )
  )
}

/**
 * For .apSW, .bindW , the W refers to Widen, which is useful when you have different TaskEither.left value in those asynchronous calls.
 *
 * For .bindTo , you can use it to replace .Do at the beginning of Do notation when
 * you already have a TaskEither value instead of a dummy TaskEither value.
 *
 * For .let , it receives a function with type signature f: a: A -> b: B instead of f: a: A -> TaskEither<E,B> .
 * It becomes handy when you need to transform the data synchronously in between the asynchronous calls inside Do notation.
 */
