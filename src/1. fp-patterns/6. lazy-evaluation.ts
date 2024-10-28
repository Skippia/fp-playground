function* lazyRange(start: number) {
  let current = start

  while (true) {
    yield current++
  }
}

const numbers = lazyRange(1)

console.log(numbers.next().value) // 1
console.log(numbers.next().value) // 2
console.log(numbers.next().value) // 3

export {}
