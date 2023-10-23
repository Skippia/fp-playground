import * as E from 'fp-ts/Either'

/**
 * A lot of functions throw the error - we need to handle it
 */

// First solution

function jsonParse1(text: string): E.Either<Error, unknown> {
  return E.tryCatch(
    () => JSON.parse(text),
    // (e) => (e instanceof Error ? e : new Error(String(e)))
    E.toError // absolutely the same
  )
}
// E.tryCatchK - converts function that might throw into the one returning a `Either`
const jsonParse2: (text: string) => E.Either<Error, unknown> = E.tryCatchK(JSON.parse, E.toError)

type JsonParseError = Readonly<{
  type: 'JsonParseError'
  error: Error
}>

const jsonParse3: (text: string) => E.Either<JsonParseError, unknown> = E.tryCatchK(
  JSON.parse,
  (e) => ({
    type: 'JsonParseError',
    error: E.toError(e),
  })
)

jsonParse3(`{"foo": "bar"}`) // ?
jsonParse3(`"foo": "bar"}`) // ?
