/**
 * The term Functor could be confusing.
 * Basically when we say Functor in programming sense, we refer to a "Container" that is "Mappable".
 * When you provide a "map" function that takes a function and transform it into
 * a corresponding function in the "Container" world, it becomes "Mappable".
 *
 * When we have a "Container" that is "Mappable" and a "return" function that takes a data and
 * transform it into the "Container" world, then you have a Functor! (Well, you still need to fulfil the Functor laws :) )
 */

import * as O from 'fp-ts/lib/Option'
import type { Pointed1 } from 'fp-ts/lib/Pointed'

/**
 * The Map and Return function type signature in a functor
 *
 * type Map = (f: (a: A) => (b: B)) => (fa: Container<A>) => (fb: Container<B>)
 * type Return = (a: A) => (fa: Container<A>)
 */

/**
 * map is also known as lift
 * type Lift = (f: (a: A) => (b: B)) => ((fa: Container<A>) => (fb: Container<B>))
 *
 * After it takes a function (f: (a: A) => (b: B)),
 * it returns a "lifted" version function ((fa: Container<A>) => (fa: Container<B>)).
 */

/**
 * The implementation of "map" function should help you to unwrap the data from the "Container" (from fa to a ),
 * perform the transformation using the function f (from a to b ), and then wrap the result b with the "Container" and return it (fb).
 * The "return" function is much simpler, it should just helps you to the wrap the data with the "Container" (from a to fa ).
 */

// ! Examples
// Let's take a look at the implementation of "map" and "return" function in <Option> in fp-ts.

/**
 * Note: "return" is named as "of" in fp-ts (probably "return" is a reserved keyword in JS)
 */
/**
 * Type in Option.d.ts
 */
type TMap = <A, B>(f: (a: A) => B) => (fa: O.Option<A>) => O.Option<B>
declare const of: Pointed1<O.URI>['of']

/**
 * Implementation in Option.js
 */

const map: TMap = f => fa => (O.isNone(fa) ? O.none : O.some(f(fa.value)))

const double = (n: number): number => n * 2

const result1 = map(double)(O.some(5)) // Some(10)
const result2 = map(double)(O.none) // None

/**
 * In the implementation of "map" function in Option, it checks whether the Option value is None or Some(a).
 * If it is None, it will just return None. Otherwise, it unwraps the value from Some(a) to a,
 * apply the function f on the data a and return the result data b wrapped with Option (Some(b)).
 * For the "return" (of) function in Option, it will just help you to wrap the data with Option (from a to Some(a)).
 */

/**
 * ! Functor laws
 * There are two functor laws you need to follow
 * if you are going to create your own functor: identity law and composition law.

 * 1. identity law:
 *   map(id) = id

 * 2. composition law:
 *   map(compose(f, g)) = compose(map(f), map(g))
 */

/**
 * 1. id function is simply a function that returns data itself(a => a).
 * The identity law tells us that after the "map" function takes the id function,
 * it must the same as the id function in the "Container" (fa => fa).
 *
 * 2. The composition law tells us that when we compose two functions f and g,
 * and then feed it into the "map" function, the resulting function should be the same as
 * if you feed the function f and g into the "map" function first respectively and compose them afterwards.
 */
