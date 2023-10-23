/**
 * ! Order concept
 */

import { Eq } from 'fp-ts/Eq'
import * as Ord from 'fp-ts/Ord'

type Ordering = -1 | 0 | 1

interface _Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering
}

const _ordNumber: _Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
}

//* Note. A lawful equals can be derived from compare in the following way
// equals: (x, y) => compare(x, y) === 0

const ordNumber: Ord.Ord<number> = Ord.fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))

function min<A>(O: Ord.Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x)
}

min(ordNumber)(11, 4) // ?

//------------------------------------------------------------
type User = {
  name: string
  age: number
}

const __byAge: Ord.Ord<User> = {
  equals: (x: User, y: User) => ordNumber.compare(x.age, y.age) === 0,
  compare: (x: User, y: User) => ordNumber.compare(x.age, y.age),
}
const _byAge: Ord.Ord<User> = Ord.fromCompare((x, y) => ordNumber.compare(x.age, y.age))
const byAge: Ord.Ord<User> = Ord.contramap((user: User) => user.age)(ordNumber)

__byAge.compare({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?
_byAge.compare({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?
byAge.compare({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?

const __getYounger = min(__byAge)
const _getYounger = min(_byAge)
const getYounger = min(byAge)

__getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?
_getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?
getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?

/**
 * ? What if we want to pick the older instead?
 * ? We'd need to "reverse the order", or more technically speaking, get the dual order.
 * ? Fortunately there's another exported combinator for this
 */

function max<A>(O: Ord.Ord<A>): (x: A, y: A) => A {
  return min(Ord.reverse(O))
}

const getOlder = max(byAge)

getOlder({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // ?
