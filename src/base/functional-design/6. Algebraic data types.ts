/* eslint-disable ts/no-unsafe-call */
export {}

/**
 * ! Two common classes of algebraic types are:
 * ? 1. Product type - is a collection of types Ti indexed by a set I
 * ? 2. Sum types - tagged union types.
 */

// ! Product type:
type Tuple1 = [string] // I = [0]
type Tuple2 = [string, number] // I = [0, 1]
type Tuple3 = [string, number, boolean] // I = [0, 1, 2]

// Accessing by index
type Fst = Tuple2[0] // string
type Snd = Tuple2[1] // number

// I = {"name", "age"}
type Person = {
  name: string
  age: number
}

// Accessing by label
type Name = Person['name'] // string
type Age = Person['age'] // number

/**
 * ? If we write C(A) for the number of inhabitants of the type A (aka its cardinality)
 * ? then the following equality holds:
 * ---------------------------
 * ? C([A, B]) = C(A) * C(B)
 * ---------------------------
 * ! - the cardinality of the product is the product of cardinalities
 */

/* Example */
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Period = 'AM' | 'PM'
type Clock = [Hour, Period] // ? The Clock type has 12 * 2 = 24 inhabitants.

/**
 *!  When should I use a product type? - Whenever its components are independent.
 * ? f.e type Clock = [Hour, Period] - Here Hour and Period are independent,
 * ? i.e. the value of Hour doesn't affect the value of Period and vice versa, all pairs are legal and meaningful.
 */

// -----------------------------------------------------------------------------------------------------------------------
// ! Sum type:

/**
 * ? A sum type is a data structure used to hold a value that could take several different,
 * ? but fixed, types. Only one of the types can be in use at any one time,
 * ? and a tag field explicitly indicates which one is in use.
 */

// Example - redux actions
type Action =
  | {
    type: 'ADD_TODO'
    text: string
  }
  | {
    type: 'UPDATE_TODO'
    id: number
    text: string
    completed: boolean
  }
  | {
    type: 'DELETE_TODO'
    id: number
  }
//

/**
 * ? A sum type with n members requires n constructors, one for each member
 */
const add = (text: string): Action => ({
  type: 'ADD_TODO',
  text
})

const update = (id: number, text: string, completed: boolean): Action => ({
  type: 'UPDATE_TODO',
  id,
  text,
  completed
})

const del = (id: number): Action => ({
  type: 'DELETE_TODO',
  id
})

/**
 * ? Sum types can be polymorphic and/or recursive.
 */

// Example (linked lists)
//        ↓ type parameter
type List<A> = { type: 'Empty' } | { type: 'Element', value: A, next: List<A> }
//                                                              ↑ recursion

/**
 * ! Pattern matching
 * JavaScript doesn't have pattern matching (and so TypeScript) however
 * we can define a "poor man" pattern matching by defining a fold functi
 */

const fold = <A, R>(list: List<A>, onEmpty: () => R, onNext: (head: A, tail: List<A>) => R): R =>
  list.type === 'Empty' ? onEmpty() : onNext(list.value, list.next)

const length = <A>(list: List<A>): number =>
  fold(
    list,
    () => 0, // if list.type === 'Empty' returns 0
    (_, tail) => 1 + length(tail) // another
  )

const list: List<string> = {
  type: 'Element',
  value: 'a',
  next: {
    type: 'Element',
    value: 'b', //
    next: {
      type: 'Empty' //
    }
  }
}

length(list) // ?

/**
 * ! Sum types:
 * ----------------------
 * C(A | B) = C(A) + C(B)
 * ----------------------
 * ? the cardinality of the sum is the sum of cardinalities
 */

// Example  - The Option type
type Option<A> =
  | { type: 'None' }
  | {
    type: 'Some'
    value: A
  }
// ? From the general formula C(Option<A>) = 1 + C(A),
// ? we can derive for example the cardinality of Option<boolean>: 1 + 2 = 3 inhabitants.

/**
 * ! When should I use a sum type?
 * When its components would be dependent if implemented as a product type.
 */

// Example (component props)

type Props = {
  editable: boolean
  onChange?: (text: string) => void
}

// @ts-expect-error react demo
class Textbox extends React.Component<Props> {
  render() {
    // @ts-expect-error react demo
    if (this.props.editable) {
      // error: Cannot invoke an object which is possibly 'undefined' :(
      // @ts-expect-error react demo
      this.props.onChange()
    }
  }
}

/**
 * ? The problem here is that Props is modelled as a product type but onChange depends on editable.
 * ? A sum type is a better choice
 */

type _Props =
  | {
    type: 'READONLY'
  }
  | {
    type: 'EDITABLE'
    onChange: (text: string) => void
  }

// @ts-expect-error react demo
class _Textbox extends React.Component<Props> {
  render() {
    // @ts-expect-error react demo
    switch (this.props.type) {
      case 'EDITABLE':
        // @ts-expect-error react demo
        this.props.onChange() // :)
      // ...
    }
  }
}

// example (node callbacks)
declare function readFile(
  path: string,
  //         ↓ ---------- ↓ CallbackArgs
  callback: (err?: Error, data?: string) => void
): void

// The result is modelled as a product type

type CallbackArgs = [Error | undefined, string | undefined]

// however, its components are dependent: you get either an error or a string

/**
 * err        data        legal?
 * Error      undefined     ✓
 * undefined  string        ✓
 * Error      string        ✘
 * undefined  undefined     ✘
 */

// A sum type would be a better choice, but which one?

/**
 * A sum type can be a better choice because the components
 * (error and data) are dependent on each other in this case
 */
/**
 * With this CallbackResult type, you clearly indicate that you can get
 * either an error with no data or data with no error as a result of the readFile callback.
 * This better represents the dependency between the error and data components.
 */
type CallbackResult = { error: Error, data: undefined } | { error: undefined, data: string }

declare function _readFile(path: string, callback: (result: CallbackResult) => void): void

// ! Conclusion
/**
 * In this post we've seen product types and sum types, and how reasoning
 * in terms of the number of states they represent can greatly affect the design of our domain models.
 * ? A common pitfall of many real-world APIs is to misuse product types that,
 * ? in addition to all the legal states, also model many illegal ones.
 *
 * ? Sum types are an incredibly useful and fundamental language feature,
 * ? they are the key to design excellent domain models by allowing to make illegal states irrepresentable.
 */
