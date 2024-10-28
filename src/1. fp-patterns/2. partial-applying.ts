function add(a: number, b: number, c: number): number {
  return a + b + c
}

// Partially applying the first argument
function addFive(b: number, c: number): number {
  return add(5, b, c)
}

console.log(addFive(3, 2)) // 10

export {}
