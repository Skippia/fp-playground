type Group<A> = {
  concat: (x: A, y: A) => A
  empty: A
  inverse: (a: A) => A
}

// Example 1
const addGroup: Group<number> = {
  concat: (x, y) => x + y,
  empty: 0,
  inverse: a => -a
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
  inverse: a => (alphabets.length - a) % alphabets.length
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

export {}
