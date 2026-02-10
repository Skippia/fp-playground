import { flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

type Address = {
  addressLine1: string
  addressLine2?: string
}

type Person = {
  name: string
  age: number
  address?: Address
}

const getAddressLine2Final = flow(
  O.fromNullableK((person: Person) => person.address),
  O.map(address =>
    pipe(
      O.fromNullable(address.addressLine2),
      O.getOrElse(() => 'address line 2 not found')
    )
  ),
  O.getOrElse(() => 'not found anything')
)

const personA = {
  name: 'A',
  age: 20,
  address: {
    addressLine1: 'hehe',
    addressLine2: 'haha'
  }
}
const personB = {
  name: 'A',
  age: 20,
  address: {
    addressLine1: 'hehe'
  }
}

const personC = {
  name: 'A',
  age: 20
}

pipe(personA, getAddressLine2Final) // ?
pipe(personB, getAddressLine2Final) // ?
pipe(personC, getAddressLine2Final) // ?
