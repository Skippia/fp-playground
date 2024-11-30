/* eslint-disable style/max-len */
import * as A from 'fp-ts/lib/Array'
import * as B from 'fp-ts/lib/boolean'
import { pipe } from 'fp-ts/lib/function'
import type {
  Monoid
} from 'fp-ts/lib/Monoid'
import * as M from 'fp-ts/lib/Monoid'
import * as N from 'fp-ts/lib/number'
import * as Ord from 'fp-ts/lib/Ord'
import * as S from 'fp-ts/lib/Semigroup'

type Customer = {
  name: string
  favoriteThings: string[]
  registeredAt: number
  lastUpdatedAt: number
  hasMadePurchase: boolean
}

// ? semigroup merge strategy
const semigroupCustomer: S.Semigroup<Customer> = S.struct({
  // ? keep the longer name
  name: S.max(
    Ord.contramap((s: string) => s.length)(N.Ord)
  ),
  // ? accumulate favorite things
  favoriteThings: A.getMonoid<string>(),
  // ? keep the least recent date
  registeredAt: S.min(N.Ord),
  // ? keep the most recent date
  lastUpdatedAt: S.max(N.Ord),
  // ? mark as true if any purchases were ever made
  hasMadePurchase: B.SemigroupAny
})

// ? ℹ️ create our own Monoid
const longestStringMonoid: Monoid<string> = {
  concat: (x, y) => (x.length > y.length ? x : y),
  empty: ''
}

// ? monoid merge strategy
const monoidCustomer: Monoid<Customer> = M.struct({
  name: longestStringMonoid,
  favoriteThings: A.getMonoid<string>(),
  registeredAt: M.min(N.Bounded),
  lastUpdatedAt: M.max(N.Bounded),
  hasMadePurchase: B.MonoidAny
})

const mockedCustomerRecordCollection: Customer[] = [
  {
    name: 'Andrew!',
    favoriteThings: ['cooking', 'reading'],
    registeredAt: new Date(2020, 1, 20).getTime(),
    lastUpdatedAt: new Date(2020, 2, 18).getTime(),
    hasMadePurchase: false
  },
  {
    name: '',
    favoriteThings: ['functional programming'],
    registeredAt: new Date(2018, 1, 22).getTime(),
    lastUpdatedAt: new Date(2018, 2, 9).getTime(),
    hasMadePurchase: false
  },
  {
    name: 'Bobby Axelrod',
    favoriteThings: ['playing guitar'],
    registeredAt: new Date(1971, 1, 1).getTime(),
    lastUpdatedAt: new Date(5000, 1, 1).getTime(),
    hasMadePurchase: true
  }
]

const doubleMerged = monoidCustomer.concat(
  mockedCustomerRecordCollection[0] as Customer,
  mockedCustomerRecordCollection[1] as Customer
)

const allMerged = pipe(
  mockedCustomerRecordCollection,
  pipe(
    mockedCustomerRecordCollection[0]!,
    S.concatAll(monoidCustomer)
  )
)

/* {
 ? name: 'Andrew!',
 ? favoriteThings: [ 'cooking', 'reading', 'functional programming' ],
 ? registeredAt: 1519246800000,
 ? lastUpdatedAt: 1584478800000,
 ? hasMadePurchase: false
} */
console.log(doubleMerged)

/* {
  ? name: 'Bobby Axelrod',
  ? favoriteThings: [
  ?  'cooking', 'reading', 'cooking', 'reading', 'functional programming', 'playing guitar'
  ? ],
  ? registeredAt: 34203600000,
  ? lastUpdatedAt: 95620251600000,
  ? hasMadePurchase: true
}
 */
console.log(allMerged)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const isMineName = ({ name }: Customer) => name.includes('Andrew')
const isComplicatedHobby = ({ favoriteThings }: Customer) => favoriteThings.some(hobby => hobby.split(' ').length > 1)
const registeredAfterApocalypse = ({ registeredAt }: Customer) => Number(registeredAt) > 1325376000000 // > 2012
const lastUpdateInThisYear = ({ lastUpdatedAt }: Customer) => Number(lastUpdatedAt) > 1704067200000// > 2024

const foldWithMonoid = (
  monoid: M.Monoid<boolean>,
  predicate: (customer: Customer) => boolean,
  customers: Customer[]
): boolean => pipe(
  customers,
  A.foldMap(monoid)(predicate)
)

const getStatsByCustomers = (customers: Customer[]) => ({
  atLeastMyName: foldWithMonoid(B.MonoidAny, isMineName, customers),
  isThereCompicatedHobby: foldWithMonoid(B.MonoidAny, isComplicatedHobby, customers),
  areAllRegisteredAfterApocalypse: foldWithMonoid(
    B.MonoidAll,
    registeredAfterApocalypse,
    customers
  ),
  areAllUpdatedInThisYear: foldWithMonoid(
    B.MonoidAll,
    lastUpdateInThisYear,
    customers
  ),
})
/**
 * ? atLeastMyName: true,
 * ? isThereCompicatedHobby: true,
 * ? areAllRegisteredAfterApocalypse: false,
 * ? areAllUpdatedInThisYear: false
 */
const stats = getStatsByCustomers(mockedCustomerRecordCollection)
console.log('🚀 ~ stats:', stats)
