import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'

const _ = console.log

type Email = Readonly<{
  type: 'Email'
  value: string
}>

type PhoneNumber = Readonly<{
  type: 'PhoneNumber'
  value: string
}>

// ===========================
type MalformedEmail = Readonly<{
  type: 'MalformedEmail'
  error: Error
}>

type NotAnEmail = Readonly<{
  type: 'NotAnEmail'
  error: Error
}>

type InvalidPhoneNumber = Readonly<{
  type: 'InvalidPhoneNumber'
  error: Error
}>
// ===========================

const emailRegex
  = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-0-9]+\.)+[a-z]{2,})$/i

const phoneNumberRegex = /^\+?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4,6}$/

const validateEmail = E.fromPredicate(
  (maybeEmail: string) => emailRegex.test(maybeEmail),
  invalidEmail => (invalidEmail.includes('@') ? 'Malformed email' : 'Not a email')
)

const validatePhoneNumber = E.fromPredicate(
  (maybePhoneNumber: string) => phoneNumberRegex.test(maybePhoneNumber),
  () => 'InvalidPhoneNumber' as const
)

const validateLoginName = (loginName: string) =>
  pipe(
    loginName,
    validateEmail,
    E.orElseW(e => (e === 'Not a email' ? validatePhoneNumber(loginName) : E.left(e)))
  )

console.log(validateLoginName('user@example.com'))
console.log(validateLoginName('user@example.'))

console.log(validateLoginName('1234567890'))
console.log(validateLoginName('foo 123'))

// ----------------------------------------------------

const _validateEmailFlow = flow(
  E.fromPredicate(
    (maybeEmail: string) => emailRegex.test(maybeEmail),
    (invalidEmail): MalformedEmail | NotAnEmail =>
      invalidEmail.includes('@')
        ? { type: 'MalformedEmail', error: new Error('Malformed email') }
        : { type: 'NotAnEmail', error: new Error('Not an email') }
  ),
  E.map(
    (email): Email => ({
      type: 'Email',
      value: email
    })
  )
)

const _validatePhoneNumberFlow = flow(
  E.fromPredicate(
    (maybePhoneNumber: string) => phoneNumberRegex.test(maybePhoneNumber),
    (): InvalidPhoneNumber => ({
      type: 'InvalidPhoneNumber',
      error: new Error('Invalid phone number')
    })
  ),
  E.map(
    (phoneNumber): PhoneNumber => ({
      type: 'PhoneNumber',
      value: phoneNumber
    })
  )
)

/**
 * Typescript can't automatically infer the type from the union type
 */
const _validateLoginName = (loginName: string) =>
  pipe(
    loginName,
    _validateEmailFlow,
    E.orElseW(
      (e): E.Either<InvalidPhoneNumber | MalformedEmail, PhoneNumber> =>
        e.type === 'NotAnEmail'
          ? _validatePhoneNumberFlow(loginName) //
          : E.left(e)
    )
  )

console.log(_validateLoginName('user@example.com'))
console.log(_validateLoginName('user@example.'))

console.log(_validateLoginName('1234567890'))
console.log(_validateLoginName('foo 123'))
