function sumRecursion(arr: number[]): number {
  if (arr.length === 1) return arr[0] as number
  return (arr[0] as number) + sumRecursion(arr.slice(1))
}

/**
 * #######
 */

type SumAll = (xs: number[]) => number

const sum2Recursion: SumAll = xs => (xs[0] ? xs[0] + sum2Recursion(xs.slice(1)) : 0)

sumRecursion([1, 2, 3, 4, 5]) // ?

export {}
