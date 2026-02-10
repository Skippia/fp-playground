/* eslint-disable style/max-len */
/* eslint-disable ts/no-explicit-any */
import type * as E from 'fp-ts/Either'
import type * as O from 'fp-ts/Option'

import type { List } from '@shared/linked-list'

// ? Define an interface that ties a URI to its corresponding type constructor.
type _HKT<URI, A> = {
  _URI: URI
  _A: A
}

// ? URItoKind Mapping: Create a mapping from URIs to their concrete type representations
type _URItoKind<A> = {
  Option: O.Option<A>
  List: List<A>
  // ...
}
type _URItoKind2<E, A> = {
  Either: E.Either<E, A>
  // ...
}

type _URIS = keyof _URItoKind<any> // 'Option' | ...
type _URIS2 = keyof _URItoKind2<any, any> // 'Either' | ...
type _Kind<URI extends _URIS, A> = URI extends _URIS ? _URItoKind<A>[URI] : any // O.Option<A> | ...
type _Kind2<URI extends _URIS2, E, A> = URI extends _URIS2 ? _URItoKind2<E, A>[URI] : any // E.Either<E, A> | ...

export type { _HKT, _Kind, _Kind2, _URIS, _URIS2, _URItoKind }
