/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-explicit-any */
import { map } from 'fp-ts/lib/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import type { IO } from 'fp-ts/lib/IO'
import type { TaskEither } from 'fp-ts/lib/TaskEither'
import { chain, tryCatch } from 'fp-ts/lib/TaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/Option'
import { curry, prop } from 'ramda'

// -- Run the App ----------------------------------------------------

// -- Utils ----------------------------------------------------------

const getJSON = (url: string): TaskEither<Error, any> =>
  tryCatch(
    () => fetch(url).then(res => res.json()),
    reason => new Error(String(reason))
  )

const setHtml = (sel: string) => (html: string): IO<void> => () => {
  const element = document.querySelector(sel)
  if (element) {
    element.innerHTML = html
  }
}

// -- Pure -----------------------------------------------------------

const host = 'api.flickr.com'
const path = '/services/feeds/photos_public.gne'
const query = (t: string): string => `?tags=${t}&format=json&nojsoncallback=1`
const url = (t: string): string => `https://www.${host}${path}${query(t)}`

const img = (src: string): string => `<img src="${src}" />` // string => string

const mediaUrl = (item: any): string => item.media.m

const mediaUrls = compose(
  map(mediaUrl),
  prop('items')
) // obj => string[]

const images = map(img) // string[] => string[]

// -- Impure ---------------------------------------------------------

const render = flow(
  mediaUrls,
  images,
  (htmlArray: string[]) => htmlArray.join(''),
  setHtml('#js-main')
)

const app = flow(
  url,
  getJSON,
  chain(data => TE.fromIO(render(data)))
)

const safeProp = (prop: string) => (obj: any): O.Option<string[]> =>
  prop in obj ? O.of(obj[prop] as string[]) : O.none

const safeHead = (arr: string[]): O.Option<string> =>
  arr[0] ? O.of(arr[0]) : O.none

const firstAddressStreet = flow(
  safeProp('address'), // => Option<string[]>
  O.map(safeHead) // map(f)(F<x>) => F<f(F<x>.value)>
)
// const firstAddressStreet = compose(
//   join,
//   map(safeProp('street')),
//   join,
//   map(safeHead), safeProp('addresses'),
// );
