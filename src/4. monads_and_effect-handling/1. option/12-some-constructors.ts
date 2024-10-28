import * as O from 'fp-ts/Option'

O.toNullable(O.none) // ?
O.toNullable(O.some(3)) // ?

O.toUndefined(O.none) // ?
O.toUndefined(O.some(3)) // ?

O.fromNullable(null) // ?
O.fromNullable(3) // ?

/**
 * Exact same things
 */
const a = O.some(3) // ?
const b = O.of(3) // ?

//
