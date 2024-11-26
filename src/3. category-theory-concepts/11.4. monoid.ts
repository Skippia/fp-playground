/* eslint-disable style/max-len */
import * as Apply from 'fp-ts/Apply'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as IO from 'fp-ts/lib/IO'
import type * as S from 'fp-ts/Semigroup'
import { intercalate } from 'fp-ts/Semigroup'

// ! IN THE BELOW EXAMPLE WE TRY TO BUILD ERROR AGGREGATOR

class ValidationError extends Error {}
type TMap = Map<string, string>
const formValues = (selector: string): IO.IO<TMap> => () =>
  selector === '#signup'
    ? new Map([['signup', 'forbidden']])
    // ? new Map([['signup', 'allowed']])
    : new Map([['terms', 'forbidden']])
    // : new Map([['terms', 'allowed']])

const validate = (data: TMap): E.Either<ValidationError, TMap> => {
  if (data.has('signup')) return data.get('signup') === 'allowed' ? E.right(data) : E.left(new ValidationError('Signup not allowed'))
  else if (data.has('terms')) return data.get('terms') === 'allowed' ? E.right(data) : E.left(new ValidationError('Terms not allowed'))

  return E.left(new ValidationError('Either signup or terms should be included into data'))
}

const val1 = pipe(
  '#signup',
  formValues,
  IO.map(validate)
) // => IO<Either<ValidationError, TMap>>

const val2 = pipe(
  '#terms',
  formValues,
  IO.map(validate)
) // => IO<Either<ValidationError, TMap>>

// ! Option 1 (manual implementation)
/* const semigroupValidation: S.Semigroup<E.Either<Error, TMap>> = {
  concat: (val1, val2) =>
    pipe(
      val1,
      E.fold(
        error1 =>
          pipe(
            val2,
            E.fold(
              error2 => E.left(new ValidationError(`${error1.message}; ${error2.message}`)), // 1th option: both validations are failed
              () => E.left(error1) // 2th option: only first validation is failed
            )
          ),
        result1 =>
          pipe(
            val2,
            E.fold(
              error2 => E.left(new ValidationError(error2.message)), // 3th option: only second validation is failed
              result2 => E.right(new Map([...result1, ...result2])) // 4th option: both validations are successful
            )
          )
      )
    ),
} */

// ! Option 2 (built-in abstractions)
const errorSemigroupString: S.Semigroup<string> = intercalate(', ')('') // Combine error messages into 1 string
const errorSemigroupValidationError: S.Semigroup<ValidationError> = {
  concat: (err1, err2) => new ValidationError(`${err1.message}; ${err2.message}`), // Combine error messages into 1 string and then wrap it into ValidationError
}
// const ApplicativeValidation = E.getApplicativeValidation(errorSemigroupString)
const ApplicativeValidation = E.getApplicativeValidation(errorSemigroupValidationError)

const concatResults = (x: IO.IO<E.Either<Error, TMap>>, y: IO.IO<E.Either<Error, TMap>>): IO.IO<E.Either<Error, TMap>> => pipe(
  IO.Do,
  IO.bind('xResult', () => x),
  IO.bind('yResult', () => y),
  // IO.map(({ xResult, yResult }) => semigroupValidation.concat(xResult, yResult))
  IO.map(({ xResult, yResult }) =>
    pipe(
      Apply.sequenceT(ApplicativeValidation)(xResult, yResult),
      E.map(([map1, map2]) => new Map([...map1, ...map2]))
    )
  )
)

const result = concatResults(val1, val2)() // => Either<Error, TMap>
console.log(result)
