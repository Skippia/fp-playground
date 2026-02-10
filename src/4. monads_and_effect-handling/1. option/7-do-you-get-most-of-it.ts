import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'

function isDotComImperativeWay(url: string): boolean {
  try {
    const parsedUrl = new URL(url).hostname // ?
    const domain = parsedUrl.split('.').pop()

    return domain === 'com'
  }
  catch {
    return false
  }
}

function tryToParseURL(maybeUrl: string): O.Option<URL> {
  return O.tryCatch(() => new URL(maybeUrl))
}

function tryToExtractDomain(url: URL): O.Option<string> {
  const domain = url.hostname.split('.')
  return A.last(domain)
}

function isDotComFunctionalWay(url: string): boolean {
  return pipe(
    url,
    tryToParseURL,
    O.flatMap(tryToExtractDomain),
    O.map(domain => domain === 'com'),
    O.getOrElse(() => false)
  )
}

isDotComFunctionalWay('https://www.google.com') // ?
isDotComFunctionalWay('fsdfasdfasdfesf') // ?
