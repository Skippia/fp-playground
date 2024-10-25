type Compose = <A, B, C>(
  f: (x: B) => C, //
  g: (x: A) => B
) => (x: A) => C

export const compose: Compose = (f, g) => a => f(g(a))
// export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => f(g(a))
