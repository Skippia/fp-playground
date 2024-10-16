/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

type Option<A> =
  | { type: 'None' } // represents a failure
  | { type: 'Some', value: A } // represents a success

// a nullary constructor can be implemented as a constant
const none: Option<never> = { type: 'None' }

const some = <A>(value: A): Option<A> => ({ type: 'Some', value })

const fold = <A, R>(fa: Option<A>, onNone: () => R, onSome: (a: A) => R): R =>
  fa.type === 'None' ? onNone() : onSome(fa.value)

/**
 * ! The Option type can be used to avoid throwing exceptions
 * and/or to represent optional values, so we can go from...
 */

//                this is a lie ↓
const _head = <A>(as: Array<A>): A => {
  if (as.length === 0) {
    throw new Error('Empty array')
  }
  return as[0]
}

let _s: string
try {
  _s = String(_head([]))
}
catch (e) {
  _s = (e as any).message
}

// ...where the type system is unaware of possible failures, to...
//                              ↓ the type system "knows" that this computation may fail
const head = <A>(as: Array<A>): Option<A> => (as.length === 0 ? none : some(as[0]))

const s = fold(
  head([]),
  () => 'Empty array',
  a => String(a)
)

// ----------------------------------------------------------

// ! The Either type
/**
 * A common use of Either is as an alternative to Option for dealing with possible missing values.
 * In this usage, None is replaced with a Left which can contain useful information.
 * Right takes the place of Some.
 * Convention dictates that Left is used for failure and Right is used for success.
 */

type Either<L, A> =
  | { type: 'Left', left: L } // represents a failure
  | { type: 'Right', right: A } // represents a success

const left = <L, A>(left: L): Either<L, A> => ({ type: 'Left', left })

const right = <L, A>(right: A): Either<L, A> => ({ type: 'Right', right })

const _fold = <L, A, R>(fa: Either<L, A>, onLeft: (left: L) => R, onRight: (right: A) => R): R =>
  fa.type === 'Left' ? onLeft(fa.left) : onRight(fa.right)

// Getting back to our callback example

declare function readFile(path: string, callback: (err?: Error, data?: string) => void): void

readFile('./myfile', (err, data) => {
  let message: string
  if (err !== undefined) {
    message = `Error: ${err.message}`
  }
  else if (data !== undefined) {
    message = `Data: ${data.trim()}`
  }
  else {
    // should never happen
    message = 'The impossible happened'
  }
  console.log(message)
})

// we can change its signature to
declare function _readFile(path: string, callback: (result: Either<Error, string>) => void): void

// and then consume the API like this:
_readFile('./myfile', (e) => {
  const message = _fold(
    e,
    err => `Error: ${err.message}`,
    data => `Data: ${data.trim()}`
  )
  console.log(message)
})
