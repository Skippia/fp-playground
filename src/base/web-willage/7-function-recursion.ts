function sumRecursion(arr: number[]): number {
  if (arr.length === 1) return arr[0]
  return arr[0] + sumRecursion(arr.slice(1))
}

sumRecursion([1, 2, 3, 4, 5]) // ?
