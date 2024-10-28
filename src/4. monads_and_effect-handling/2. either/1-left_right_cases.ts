import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
/**
 * ! Working with Eithers when we have Rights
 * We can use map (from Functor) or chain (from Monad).
 * The main practical difference is that the `map` allows us
 * to transform the value while keeping it in the right branch,
 * and the `chain` confers us the power to decide whether
 * to keep on the right or move to the left
 * (i.e. we can decide a computation should be treated as an error from then on).
 */
const goodValue: E.Either<Error, string> = E.right('Good')
const badValue: E.Either<Error, string> = E.left(new Error('Bad'))

const betterValue = pipe(
  goodValue, //* Right<value>
  E.map(value => `${value} is now 'better'`) //* Right<value> ==> Right<value*>
)

const worseValue = pipe(
  goodValue, //* Right<value>
  E.map(value => E.left(new Error(`Nothing can be ${value} in 2020`))), //* Right<value> ==> Right<Left<value*>>
  E.flatten //* Right<Left<value*>> ==> Left<value*>>
)
/**
 * ? Summary:
 * 1. We can mutate right (Right<value> ==> Right<value*>)
 * 2. We can convert right to left (Right<value> ==> Left<value*>)
 */

// ----------------------------------------------------------------------------------
/**
 * ! Working with Either when we have Lefts
 */

// We can modify the error using mapLeft:
const crypticError: E.Either<number, string> = pipe(
  worseValue, //* Left<value>
  E.mapLeft(err => err.message.length) //* Left<value> ==> Left<value*>
)
// Provide alternative value
const improvedValue = pipe(
  worseValue, //* Left<value>
  E.alt(() => E.right('Back to 2015')) //* Left<value> ==> Right<X>
)

// Provide alternative values while peeking at the error:
const optimisticValue = pipe(
  worseValue, //* Left<value>
  E.getOrElse(err => E.right(`${err.message}. But there's always 2021.`)) //* Left<value> ==> Right<value*>
)
// !Note: we don’t necessarily have to provide a right. We can map an error to another error, for instance.

/**
 * Taking things out of Either
 */
if (E.isLeft(worseValue)) {
  // worseValue.left will be available
}
else {
  // worseValue.right will be available
}

if (E.isRight(worseValue)) {
  // worseValue.right will be available
}
else {
  // worseValue.left will be available
}

/**
 * This may be useful in some situations,
 * but it won’t fit with our pipelines as well as the alternatives.
 * Instead, we should use the helper functions defined in Either
 */
// * getOrElse requires us to define a way to build an A from an E:
const mehValue = pipe(
  worseValue, //* Left<value>
  E.getOrElse(err => `I used to be ${err}. Now I'm free`) //* Left<value> ==> value*
)

// * fold requires us to provide mappings from E and A to a common type B:
const answer1 = pipe(
  improvedValue, //* Right<value>
  E.match(
    () => 42,
    value => value.length // * Right<value> ==> value*
  )
)
const answer2 = pipe(
  worseValue, //* Left<value>
  E.match(
    (e: Error) => e.message, //* Left<value> ==> value*
    () => '12'
  )
)

/**
 * match is more powerful than getOrElse,
 * because you can perform transformations
 * (i.e. getOrElse requires you to provide a value of the same type A as in the Either,
 * while match allows you to return a B)
 */

/**
 * ? Summary:
 * 1. We can mutate left (Left<value> ==> Left<value*>)
 * 2. We can provide alternative for left (Left<value> ==> Right<X>)
 * 3. We can convert left to right (Left<value> ==> Right<value*>)
 * 4. We can extract value from left (Left<value> ==> value*)
 * 5. We can extract value from right (Right<value> ==> value*)
 */

/**
 * (Left | Right)<value> <==> (Left | Right)<value*>
 * (Left | Right)<value> ==> value*
 * Left<value> => Right<X>
 * Right<value> => Left<X>
 */
