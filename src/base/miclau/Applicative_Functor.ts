/* eslint-disable ts/no-shadow */
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
/**
 * When you provide a apply function that takes a function which is wrapped with a "Container"
 * and transform it into a corresponding function in the "Container" world, it becomes "Applicative".
 */

/**
 * The apply function takes a function F: Container<(a: A) => (b: B)> that is already wrapped with a "Container" ,
 * then it takes a data fa: Container<A>wrapped with the "Container", unwrap both the function F
 * and the data fa to function f and data a, then apply the function f on the data a,
 * and finally return the transformed data wrapped with the "Container" (fb: Container<B>).
 * The apply function is similar to the "map" function, except the function F it takes is already wrapped with the "Container":
 */

/**
 * The Map function type signature in a functor and
 * The Apply function type signature in an applicative functor
 */
// type Map = (f: (a: A) => (b: B)) => (fa: Container<A>) => (fb: Container<B>)
// type Apply = (F: Container<(a: A) => (b: B)>) => (fa: Container<A>) => (fb: Container<B>)

// ! Let's take a look at the implementation of apply function in <Option> in fp-ts.
/**
 * Note: "apply" is named as "ap" in fp-ts,
 * It takes the data (fa) first and then the function (fab),
 * the order does not matter
 */
/**
 * Type in Option.d.ts
 */
/**
 * @since 2.0.0
 */
type TAp = <A>(fa: O.Option<A>) => <B>(fab: O.Option<(a: A) => B>) => O.Option<B>

/**
 * Implementation in Option.js
 */
// const ap: TAp = fa => fab =>
//   pipe(fab, O.fold(
//     () => O.none,
//     f =>
//       pipe(fa, O.fold(
//         () => O.none,
//         a => O.some(f(a))
//       ))
//   ))

// const ap: TAp = O.chain(f => O.map(f)(fa))(fab)
// const ap: TAp = fa => fab =>
//   pipe(fab, O.chain(
//     f => pipe(fa, O.chain(
//       a => O.some(f(a))
//     ))
//   ))

function flatten<A>(mma: O.Option<O.Option<A>>): O.Option<A> {
  if (O.isNone(mma)) return O.none
  return mma.value
}

const ap
  = <A, B>(fa: O.Option<A>) =>
    (fab: O.Option<(a: A) => B>): O.Option<B> =>
      pipe(
        fab,
        O.map(fab => O.map(fab)(fa)),
        O.flatten
      )

const value1: O.Option<number> = O.some(5)
const func1: O.Option<(a: number) => string> = O.some(n => `Number is ${n}`)

const value2: O.Option<number> = O.some(5)
const func2: O.Option<(a: number) => string> = O.none

const value3: O.Option<number> = O.none
const func3: O.Option<(a: number) => string> = O.some(n => `Number is ${n}`)

const result1 = ap(value1)(func1) // Some('Number is 5')
const result2 = ap(value2)(func2) // Some('Number is 5')
const result3 = ap(value3)(func3) // Some('Number is 5')

console.log(result1)
console.log(result2)
console.log(result3)
/**
 * In the implementation of apply function in Option, it checks whether the Option function value fab and
 * the Option data value fa is None or Some(a). If either of them is None,
 * it will just return None. Otherwise, it unwraps the value from Some(fab) to f and Some(fa) to a,
 * apply the function f on the data a and return the result data b wrapped with Option (Some(b)).
 */

/**
 * ! When to use the Apply function
 * The apply function is useful when you need to "lift" a function that takes more than one parameters into the "Container" world.
 * For example, if you have a function that takes two parameters (F: Container<(a: A) => (b: B) => (c: C))>),
 * you can use apply twice in a row with Container<a: A> and Container<b: C>to get the output Container<c: C>.
 */

/**
 * ! Apply and Map function
 * The applicative functor with apply and return functions is considered "stronger" than map,
 * due to the fact that you can recreate map from them, but not vice versa.
 *
 * (Quick reminder on return) :
 * type Return = (a: A) => (fa: Container<A>)
 * Consider having a function (f: (a: A) => (b: B)) and two data (Container<(a: A)>).
 * Instead of using map, you can use return function on the function f first,
 * which becomes F: Container<(a: A) => (b: B))> ,
 * and then use apply on F and Container<(a: A)> to get the result Container<(b: B)>.
 */

/**
 * ! Applicative functor laws
 * There are four applicative functor laws you need to follow
 * if you are going to create your own applicative functor:
 * - Identity, Homomorphism, Interchange and Composition.
 */
