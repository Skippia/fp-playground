import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

type Transaction = { id: string, amount: number }

type Balance = number

type StatementError =
  | 'invalid bank account'
  | 'missing account number'
  | 'malformed header'
  | 'transaction can\'t be zeroes'

type Statement = {
  readonly transactions: Transaction[]
}

declare function parseBankStatement(rawStatement: string): E.Either<StatementError, Statement>

declare function validateTransactions(
  transactions: Transaction[]
): E.Either<StatementError, Transaction[]>

declare function buildBalance(transactions: Transaction[]): Balance

const balanceFromRawStatement = (rawStatement: string): E.Either<StatementError, Balance> =>
  pipe(
    parseBankStatement(rawStatement), //* get - E.Either<StatementError, Statement>
    E.map(s => s.transactions), //* E.Either<StatementError, Transaction[]>
    E.map(validateTransactions), //* E.Either<StatementError, Either<StatementError, Transaction[]>>
    E.flatten, //* Either<StatementError, Transaction[]>
    E.map(buildBalance) //* E.Either<StatementError, Balance>
  )
