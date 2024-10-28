import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { makeMatch } from 'ts-adt/MakeADT'

type Item = Readonly<{
  name: string
  price: number
}>

type Account = Readonly<{
  balance: number
  frozen: boolean
}>

type Cart = Readonly<{
  items: Item[]
  total: number
}>

type AccountFrozen = Readonly<{
  type: 'AccountFrozen'
  message: string
}>

type NotEnoughBalance = Readonly<{
  type: 'NotEnoughBalance'
  message: string
}>

/**
 * Typical example, but e is union error type
 */
function _checkout(cart: Cart) {
  return (account: Account) =>
    pipe(
      account,
      pay(cart.total),
      E.match(
        e => 'Handle error',
        a => 'Handle success'
      )
    )
}

function pay(amount: number) {
  return (account: Account): E.Either<AccountFrozen | NotEnoughBalance, Account> =>
    account.frozen
      ? E.left({ type: 'AccountFrozen', message: 'Account frozen' })
      : account.balance < amount
        ? E.left({ type: 'NotEnoughBalance', message: 'Not enough balance' })
        : E.right({ ...account, balance: account.balance - amount })
}

const matchError = makeMatch('type')

/**
 * Improved example with matchError
 */
function checkout(cart: Cart) {
  return (account: Account) =>
    pipe(
      account,
      pay(cart.total),
      E.match(
        matchError({
          AccountFrozen: e => `${e.message} - [unfreeze your account]`,
          NotEnoughBalance: e => `${e.message} - [fill your wallet]`
        }),
        a => 'Handle success'
      )
    )
}
const cart: Cart = {
  items: [
    {
      name: 'item1',
      price: 50
    }
  ],
  total: 50
}

const account1: Account = {
  balance: 70,
  frozen: false
}

const account2: Account = {
  balance: 30,
  frozen: false
}

const account3: Account = {
  balance: 100,
  frozen: true
}

checkout(cart)(account1) // ?
checkout(cart)(account2) // ?
checkout(cart)(account3) // ?
//
