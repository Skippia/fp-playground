import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'

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

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const phoneNumberRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/

const validateEmail = E.fromPredicate(
  (maybeEmail: string) => emailRegex.test(maybeEmail),
  (invalidEmail) => (invalidEmail.includes('@') ? 'Malformed email' : 'Not a email')
)

const validatePhoneNumber = E.fromPredicate(
  (maybePhoneNumber: string) => phoneNumberRegex.test(maybePhoneNumber),
  () => 'InvalidPhoneNumber' as const
)

const validateLoginName = (loginName: string) =>
  pipe(
    loginName,
    validateEmail,
    E.orElseW((e) =>
      e === 'Not a email'
        ? validatePhoneNumber(loginName) //
        : E.left(e)
    )
  )

validateLoginName('user@example.com') // ?
validateLoginName('user@example.') // ?

validateLoginName('1234567890') // ?
validateLoginName('foo 123') // ?

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
      value: email,
    })
  )
)

const _validatePhoneNumberFlow = flow(
  E.fromPredicate(
    (maybePhoneNumber: string) => phoneNumberRegex.test(maybePhoneNumber),
    (): InvalidPhoneNumber => ({
      type: 'InvalidPhoneNumber',
      error: new Error('Invalid phone number'),
    })
  ),
  E.map(
    (phoneNumber): PhoneNumber => ({
      type: 'PhoneNumber',
      value: phoneNumber,
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

_validateLoginName('user@example.com') // ?
_validateLoginName('user@example.') // ?

_validateLoginName('1234567890') // ?
_validateLoginName('foo 123') // ?
