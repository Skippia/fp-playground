// /*
// // TODO
// declare function sequence<T>(promises: Array<Promise<T>>): Promise<Array<T>>

// // TODO
// declare function pushPromise<T>(acc: Promise<Array<T>>, x: Promise<T>): Promise<Array<T>>

// // TODO
// declare function push<T>(x: Array<T>, y: T): Array<T>

// // TODO
// declare function liftA2<A, B, C>(
//   f: (a: A, b: B) => C
// ): (fa: Promise<A>, fb: Promise<B>) => Promise<C>
//  */

// function sequence<T>(promises: Array<Promise<T>>): Promise<Array<T>> {
//   const init: Promise<Array<T>> = Promise.resolve([])
//   return promises.reduce(pushPromise, init)
// }

// function pushPromise<T>(acc: Promise<Array<T>>, x: Promise<T>): Promise<Array<T>> {
//   return liftA2(push)(acc, x)
// }

// function push<T>(x: Array<T>, y: T): Array<T> {
//   return x.concat([y])
// }

// function liftA2<A, B, C>(f: (a: A, b: B) => C): (fa: Promise<A>, fb: Promise<B>) => Promise<C> {
//   return (a, b) => a.then(aa => b.then(bb => f(aa, bb)))
// }

// export {}
