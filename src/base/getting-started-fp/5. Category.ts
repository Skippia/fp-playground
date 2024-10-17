/**
 * A corner stone of functional programming is composition.
 * But what does that exactely mean? When we can say that two things compose? And when we can say that things compose well?
 * We need a formal definition of composition. That's what categories are all about
 */

/**
 * ! Part 1 (Definition):
 * ! A category is a pair (Objects, Morphisms) where:
 * ? Objects is a collection of objects
 * ? Morphisms is a collection of morphisms (or arrows) between the objects
 * Note. The term "object" here has nothing to do with OOP,
 * you can think of objects as black boxes you can't inspect, or even as some kind of ancillary placeholders for morphisms.
 * ------
 * ? Each morphism f has a source object A and a target object B where A and B are in Objects.
 * ? We write f: A ⟼ B, and we say "f is a morphism from A to B".
 */

/**
 * ! Part II (Composition)
 * ? There's an operation ∘, named "composition", such that the following properties must hold
 * 1. (composition of morphisms) whenever f: A ⟼ B and g: B ⟼ C are two morphism in Morphisms
 * then it must exist a third morphism g ∘ f: A ⟼ C in Morphisms which is the composition of f and g
 * -----
 * 2. (associativity) if f: A ⟼ B, g: B ⟼ C and h: C ⟼ D then h ∘ (g ∘ f) = (h ∘ g) ∘ f
 * -----
 * 3. (identity) for every object X, there exists a morphism identity: X ⟼ X called the identity morphism for X,
 * such that for every morphism f: A ⟼ X and every morphism g: X ⟼ B, we have (identity ∘ f = f) and (g ∘ identity = g).
 * ! https://res.cloudinary.com/practicaldev/image/fetch/s--m_VM8n97--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Category_SVG.svg/1920px-Category_SVG.svg.png
 */

/**
 * ! Categories as programming languages
 * A category can be interpreted as a simplified model of a typed programming language, where:
 * `objects` are types
 * `morphisms` are functions
 * `∘` is the usual function composition
 * --- based on the diagram (check url) above ---
 * can be interpreted as a fairly simple, imaginary programming language with only three types and a small bunch of functions.
 * A = string
 * B = number
 * C = boolean
 * f = string => number
 * g = number => boolean
 * g ∘ f = string => boolean
 * The implementation could be something like:
 */
function x(s: string): number {
  return s.length
}

function y(n: number): boolean {
  return n > 2
}

// h = g ∘ f
function h(s: string): boolean {
  return y(x(s))
}

/**
 * ! A category for TypeScript
 * ? We can define a category, named TS, as a model for the TypeScript language, where:
 * ----
 * `objects` are all the TypeScript types: string, number, Array<string>, ...
 * `morphisms` are all the TypeScript functions: (a: A) => B, (b: B) => C, ... where A, B, C, ... are TypeScript types
 * `identity` morphisms are all encoded as a single polymorphic function const identity = <A>(a: A): A => a
 * `composition` of morphisms is the usual function composition (which is associative)
 * ----
 * As a model for TypeScript, TS might seems too limited: no loops, no ifs, almost nothing...
 * Nonetheless this simplified model is rich enough for our main purpose: reason about a well defined notion of composition
 */

/**
 * ! The central problem with composition
 * ? In TS we can compose two generic functions f: (a: A) => B and g: (c: C) => D as long as B = C
 */

function compose<A, B, D>(g: (b: B) => D, f: (a: A) => B): (a: A) => D {
  return a => g(f(a))
}

/**
 * ! But what if B != C? How can we compose such functions? Should we just give up?
 */

export {}
