/* eslint-disable style/max-len */
/* eslint-disable ts/no-explicit-any */
import * as E from 'fp-ts/Either'
import type * as O from 'fp-ts/Option'

import type { List } from './13-list_linked-list'
/* eslint-disable jsdoc/no-multi-asterisks */
/**
 * `Kind universe` is an abstraction over the `Type universe`
 * `Kind` is a classification for `types` and `type constructors`
 * `Type Constructors` in the Kind universe are like `Functions` in the Type universe
 * ------------------------------------------------------------------------------------------------
 * Types: A type classifies values. For example, number, string, or Array<number> are types.
 * Kinds: Kinds classify types, similar to how types classify values. They are like "types of types."
 * ------------------------------------------------------------------------------------------------
 * Kind notation:
 * * (Type): Represents a concrete type. For example, number or string.
 * * -> * (Type Constructor): Represents a type that takes one type parameter and returns a concrete type. For example, Array<T>.
 * ------------------------------------------------------------------------------------------------
 * Higher-Kinded Types (HKTs)
 * [Definition]:
 * 1. HKTs are types that are parameterized over types that themselves are type constructors. In other words, they allow abstraction over type constructors.
 * 2. HKTs are types that abstract over type constructors, allowing functions and interfaces to be generic over types that themselves are generic.
 * [Example]: In languages like Haskell, you can define functions or type classes that operate over any type constructor f :: * -> *.
 * ------------------------------------------------------------------------------------------------
 * [Main problem with HKT]
 * In TS there is native supporting of HKT-s (it cannot abstract over type constructors in the same way languages like Haskell can)
 * ------------------------------------------------------------------------------------------------
 * [Implementation in TS (workaround)]
 * Key concepts:
 *  URI pattern: sort of unique identifier for each type constructor
 *  Type-level programming: using TS types to emulate HKT-s
 */

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

// Let's assume that F = 'Option', then:

export type { _HKT, _Kind, _Kind2, _URIS, _URIS2, _URItoKind }
