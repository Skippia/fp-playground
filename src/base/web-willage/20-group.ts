/**
 * Magma is a Set A and closed binary operation ×: A × A -> A
 * Semigroup is a Magma with Associativity on ×: a × (b × c) = (a × b) × c
 * Monoid is a Semigroup with Identity value: a × I = I × a = a
 * Group is a Monoid that each value has a unique inverse:
 *  a  x  a' = I
 *  a' ×  a  = I
 *
 * Group is fundamental structure in Math (ofc subject to laws: (composition definition, composition assoc-y, composition iden-y))
 * Group encodes the concept of symmetry
 */

interface Group<A> {
  concat: (x: A, y: A) => A
  empty: A
  inverse: (a: A) => A
}

// Symmetry of trianle is simmertic regarding 120 deg * N + flipping around any axes

// Example ==================================================

// Example 1
const addGroup: Group<number> = {
  concat: (x, y) => x + y,
  empty: 0,
  inverse: (a) => -a,
}

const walletBalance = addGroup.concat(
  addGroup.empty,
  addGroup.concat(
    80,
    addGroup.concat(
      20,
      addGroup.inverse(10) //
    )
  )
)

// Example 2
type Encrypt = (plainText: string, key: number) => string
type Decrypt = (cipherText: string, key: number) => string

const alphabets = 'abcdefghijklmnopqrstuvwxyz'

const caesarGroup: Group<number> = {
  concat: (x, y) => (x + y) % alphabets.length,
  empty: 0,
  inverse: (a) => (alphabets.length - a) % alphabets.length,
}

const encrypt: Encrypt = (plainText, shift) =>
  plainText
    .toLowerCase()
    .split('')
    .map((c) => {
      const idxLetterInAlphabet = alphabets.indexOf(c)

      if (idxLetterInAlphabet === -1) return c

      const newIndex = caesarGroup.concat(idxLetterInAlphabet, shift)
      const letterReplacement = alphabets[newIndex]

      return letterReplacement
    })
    .join('')

const decrypt: Decrypt = (cipherText, shift) => encrypt(cipherText, caesarGroup.inverse(shift))

const encryptedVal = encrypt('hello world!', 7) // ?
const decriptedVal = decrypt(encryptedVal, 7) // ?
