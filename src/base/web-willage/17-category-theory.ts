/**
 * FP is based on Category Theory
 * Category consists of [Objects(points) and Morphs(arrows)] they are primitives in Category Theory
 * No properties or internal structure
 *---
 * Category rules:
 * 1. Composition definition (if there is f(a) = b and g(b) = c then shoud exsists k(a) = c, where k = g q2 f.
 *    This works alfso for more than 2 functions
 * 2. Composition associativity [ h ∘ g ∘ f = (h ∘ g) ∘ f = h ∘ (g ∘ f) ]
 * 3. Composition identity (each object should has arrow for itself (f.e f ∘ id = f, where id1 is object)
 * ----
 * F.e:
 * 1. Order(<=) is Category, but Order(<) not - because "Composition identity" rule doesn't work
 * 2. Subset is Category as well
 * 3. is_round_then_is_even is Category as well
 *
 */
