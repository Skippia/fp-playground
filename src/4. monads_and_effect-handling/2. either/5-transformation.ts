import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as J from 'fp-ts/lib/Json'

type Response = Readonly<{
  body: string
  contentLength: number
}>

type JsonStringifyError = Readonly<{
  type: 'JsonStringifyError'
  error: Error
}>

// eslint-disable-next-line ts/no-explicit-any
const circular: any = {}
circular.self = circular

const jsonStringify: (payload: unknown) => E.Either<JsonStringifyError, string> = flow(
  J.stringify,
  E.mapLeft(e => ({ type: 'JsonStringifyError', error: E.toError(e) }))
)

/**
 * ? E.map(f) + E.mapLeft(g) are equivalent to E.bimap(f, g)
 */
function createResponse(payload: unknown): E.Either<JsonStringifyError, Response> {
  return pipe(
    payload,
    jsonStringify,
    E.map(s => ({
      body: s,
      contentLength: s.length
    }))
  )
}

createResponse({
  balance: 100,
  success: true
}) // ?

const a = createResponse(circular)
