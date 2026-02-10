import * as A from 'fp-ts/Array'
import * as B from 'fp-ts/lib/boolean'
import * as F from 'fp-ts/lib/Foldable'
import { getSemigroup, pipe } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as N from 'fp-ts/lib/number'
import * as O from 'fp-ts/lib/Option'
import { getSemigroupAny } from 'fp-ts/lib/Predicate'
import type { Predicate } from 'fp-ts/lib/Predicate'
import * as S from 'fp-ts/lib/Semigroup'
import * as Str from 'fp-ts/lib/string'
import * as Ord from 'fp-ts/Ord'

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
type Customer = {
  name: string
  favoriteThings: string[]
  registeredAt: number
  lastUpdatedAt: number
  hasMadePurchase: boolean
}

const mockedCustomerRecordCollection: Customer[] = [
  {
    name: 'Andrew',
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

const getLongestString: M.Monoid<string> = {
  concat: (str1: string, str2: string) => str1.length > str2.length ? str1 : str2,
  empty: ''
}

const monoidCustomer: M.Monoid<Customer> = M.struct<Customer>({
  name: getLongestString,
  favoriteThings: A.getMonoid<string>(),
  registeredAt: M.min(N.Bounded),
  lastUpdatedAt: M.max(N.Bounded),
  hasMadePurchase: B.MonoidAny
})

const allMerged = pipe(
  mockedCustomerRecordCollection,
  pipe(
    mockedCustomerRecordCollection[0]!,
    S.concatAll(monoidCustomer)
  )
)
console.log('🚀 ~ allMerged:', allMerged)
