import { log } from 'fp-ts/Console'
import { now } from 'fp-ts/Date'
import type { IO } from 'fp-ts/IO'
import { io } from 'fp-ts/IO'

export function fib(n: number): number {
  return n === 0 || n === 1 ? n : fib(n - 1) + fib(n - 2)
}

export function time<A>(ma: IO<A>): IO<[A, number]> {
  return io.chain(now, start => io.chain(ma, a => io.map(now, end => [a, end - start])))
}

export function withLogging<A>(ma: IO<A>): IO<A> {
  return io.chain(time(ma), ([a, millis]) =>
    io.map(log(`Result: ${String(a)}, Elapsed: ${millis}`), () => a))
}

export const program = withLogging(io.map(() => 35, fib))
