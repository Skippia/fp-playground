import base64 from 'base-64'
import * as E from 'fp-ts/Either'
import * as J from 'fp-ts/Json'
import { flow, pipe } from 'fp-ts/lib/function'
import z from 'zod'

type User = Readonly<{
  id: number
  username: string
}>

/**
 * ? Error types
 */

type TypeError<X, E extends Error = Error> = Readonly<{ type: X; error: E }>
type Base64DecodeError = TypeError<'Base64DecodeError'>
type JsonParseError = TypeError<'JsonParseError'>
type ValidationUserError = TypeError<'ValidationUserError'>

const jsonParse: (text: string) => E.Either<JsonParseError, unknown> = flow(
  J.parse,
  E.mapLeft((e) => ({ type: 'JsonParseError', error: E.toError(e) }))
)

const base64Decode = E.tryCatchK(
  base64.decode,
  (e): Base64DecodeError => ({
    type: 'Base64DecodeError',
    error: E.toError(e),
  })
)

function zodValidateFunctional<
  I,
  O,
  _TypeError extends TypeError<ErrorName>,
  ErrorName = _TypeError['type'],
>(schema: z.ZodType<O>, payload: I, typeErrorName: ErrorName): E.Either<TypeError<ErrorName>, O> {
  return E.tryCatch(
    () => schema.parse(payload),
    (e): TypeError<ErrorName> => ({
      type: typeErrorName,
      error: E.toError(e),
    })
  )
}

function decodeUserObjectFromUnknown(u: unknown) {
  const userSchema: z.ZodType<User> = z.object({
    id: z.number(),
    username: z.string(),
  })

  return pipe(
    zodValidateFunctional<unknown, User, ValidationUserError>(userSchema, u, 'ValidationUserError')
  )
}

function decodeUser(encodeUser: string) {
  return pipe(
    encodeUser,
    base64Decode, // ==> Either<Base64DecodeError,string>
    E.map(jsonParse), // ==> Either<Base64DecodeError, Either<JsonParseError,unknown>>
    E.flattenW, // ==> Either<Base64DecodeError | JsonParseError, unknown>
    E.map(decodeUserObjectFromUnknown), // ==> Either<Base64DecodeError | JsonParseError, Either<ValidationUserError, User>>
    E.flattenW // ==> Either<Base64DecodeError | JsonParseError | ValidationUserError, User>>
  )
}

/**
 * ? The same, but more consise
 */
function decodeUserRefactored(
  encodeUser: string
): E.Either<JsonParseError | Base64DecodeError | ValidationUserError, User> {
  return pipe(
    encodeUser,
    base64Decode, // ==> Either<Base64DecodeError,string>
    E.flatMap(jsonParse), // ==> Either<Base64DecodeError | JsonParseError, unknown>
    E.flatMap(decodeUserObjectFromUnknown) // ==> Either<Base64DecodeError | JsonParseError | ValidationUserError, User>>
  )
}
//

//? All works
decodeUserRefactored('eyJpZCI6MSwidXNlcm5hbWUiOiJqaW1teSJ9') // ?

//? Base64DecodeError
decodeUserRefactored('!!!') // ? +

//? JsonParseError
decodeUserRefactored('e2ludmFsaWR9') // ? +

//? ValidationUserError
decodeUserRefactored('eyJmb28iOiJiYXIifQ') // ?
