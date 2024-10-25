type List<A> = Nil | Cons<A>

type Nil = {
  _tag: 'Nil'
}

type Cons<A> = {
  _tag: 'Cons'
  head: A
  tail: List<A>
}

const nil: List<never> = { _tag: 'Nil' }
const cons = <A>(head: A, tail: List<A>): List<A> => ({
  _tag: 'Cons',
  head,
  tail
})

const isNil = <A>(xs: List<A>): xs is Nil => xs._tag === 'Nil'

// 1, 2, 3
const myList: List<number> = cons(1, cons(2, cons(3, nil)))
const myListEmpty: List<never> = nil

type ShowList = <A>(xs: List<A>) => string
const showList: ShowList = xs =>
  isNil(xs) ? '' : `${String(xs.head)}` + (isNil(xs.tail) ? '' : ` ${showList(xs.tail)}`)

showList(myList)

type LMatch = <A, B>(onNil: () => B, onCons: (head: A, tail: List<A>) => B) => (xs: List<A>) => B
const match: LMatch = (onNil, onCons) => xs => (isNil(xs) ? onNil() : onCons(xs.head, xs.tail))

export type { Cons, List, Nil }
export { cons, isNil, match, myList, myListEmpty, nil, showList }
