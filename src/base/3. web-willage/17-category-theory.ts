/**
 * FP is based on Category Theory
 * Category consists of (primitives in Category Theory):
 *  1. Objects(points)
 *  2. Morphs(arrows)
 * No properties or internal structure
 *---
 * Category rules:
 * 1. Composition definition (if there is f(a) = b and g(b) = c then should exist k(a) = c, where k = g ∘ f.
 *    This works also for >= 2 functions
 * 2. Composition associativity [ h ∘ g ∘ f = (h ∘ g) ∘ f = h ∘ (g ∘ f) ] (train from pipes)
 * 3. Composition identity (each object should has arrow for itself (f.e f ∘ id = f, where id is Point(function)
 *    for all functions within composition definition (objects (points))
 * ----
 * F.e:
 * 1. Order(<=) is Category, but Order(<) not - because "Composition identity" rule doesn't work
 * 2. Subset is Category as well:
 *  - {x} is subset {x,y} is subset {x,y,z},... and {x} is subset {x,y,z}
 *  - composition order doesn't matter
 *  - {x,y} is subset of {x,y}
 * 3. is_round_then_is_even_to_string is Category as well:
 *  - Composition definition:
 *     - Float --round -> Integer
 *    - Integer --isEven-> Boolean
 *    - Float --round_then_isEven-> Boolean
 *    - Boolean --toString-> String
 *  - Composition associativity:
 *    - toString(round(isEven(x)) =
 *        isEven_then_toString(round(x)) =
 *        toString(round_then_isEven(x))
 *  - Composition identity:
 *    - const id = x => x; => round = id ∘ round; isEven = id ∘ isEven
 */
export {}
