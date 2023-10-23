import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

/**
 * ? Predicate is a function that returns true or false:
 * O.fromPredicate(predicate) - returns Option
 * O.fromPredicate(refinement) - refinemnet is predicate that refines a type
 */

/**
 *  !Predicate example
 */

const isEven = (a: number) => a % 2 === 0

const getEven = O.fromPredicate(isEven) // if predicate returns true, return Option<number> else return O.none

getEven(4) // ?
getEven(5) // ?

type Discount = Readonly<{
  percentage: number
  expired: boolean
}>

const isDiscountValue = (discount: Discount) => !discount.expired

const getDiscountText = (discount: Discount): O.Option<string> =>
  pipe(
    discount,
    O.fromPredicate(isDiscountValue), // Option<Discount>
    O.map(({ percentage }) => `Discount - ${percentage}%`) // Option<string>
  )

getDiscountText({ percentage: 10, expired: false }) // ?
getDiscountText({ percentage: 20, expired: true }) // ?

/**
 * !Predicate refinement example:
 * * that's mean instead of A type we can return `B extends A type` (more narrow type)
 */

type Dog = {
  isBig: boolean
  name: string
}

type Cat = {
  lives: number
  name: string
}

const cat: Cat = {
  lives: 9,
  name: 'spike',
}

const dog: Dog = {
  isBig: true,
  name: 'spot',
}

type Animal = Dog | Cat

function isCat(animal: Animal): boolean {
  return typeof (animal as Cat).lives === 'number'
}

function isCatRefinement(animal: Animal): animal is Cat {
  return typeof (animal as Cat).lives === 'number'
}

const getCat = O.fromPredicate(isCat) //* <B extends Animal>(b: B) => O.Option<B>
const getCatRefinement = O.fromPredicate(isCatRefinement) //* (a: Animal) => O.Option<Cat>

// <Cat>(b: Cat) => O.Option<Cat>
getCat(cat) // ?
// <Dog>(b: Dog) => O.Option<Dog>
getCat(dog) // ?

// (a: Animal) => O.Option<Cat>
getCatRefinement(cat) // ?
// (a: Animal) => O.Option<Cat>
getCatRefinement(dog) // ?
