import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'

// readFile :: Filename -> Either String (Task Error String)
// httpPost :: String -> String -> Task Error JSON
// upload :: Filename -> Either String (Task Error JSON)
declare const readFile: (filename: string) => E.Either<string, T.Task<string>>
declare const httpPost: (path: string) => (content: string) => T.Task<string>
type TUpload = (filename: string) => E.Either<string, T.Task<string>>
/**
 * compose(map(chain(httpPost('/uploads'))), readFile)
 * f = chain(httpPost('/uploads')), x = readfile(filename); map(f)(x) = F<f(x.value)>
 * TE.of(chain(httpPost('/uploads'))(readfile(filename)))
 * TE.of( httpPost('/uploads')(readfile(filename)) )
 */
/**
 * FP-way
 */
const upload: TUpload = flow(
  readFile,
  E.map(
    T.flatMap(httpPost('/uploads'))
  )
)
//
/**
 * Imperative way
 */

// upload :: Filename -> (String -> a) -> Void
/* const __upload = (filename, callback) => {
  if (!filename) {
    throw new Error('You need a filename!')
  }
  else {
    readFile(filename, (errF, contents) => {
      if (errF) throw errF
      httpPost('/uploads', contents, (errH, json) => {
        if (errH) throw errH
        callback(json)
      })
    })
  }
}
 */
