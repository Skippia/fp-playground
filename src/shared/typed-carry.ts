/* eslint-disable ts/no-explicit-any */
type Fn = (...args: any[]) => any

type RequiredFirstParam<Func extends Fn> = Parameters<Func> extends [
  infer Head,
  ...infer Tail
]
  ? [Head, ...Partial<Tail>]
  : []

type RemainingParameters<
  AppliedParams extends any[],
  ExpectedParams extends any[]
> = AppliedParams extends [any, ...infer ATail]
  ? ExpectedParams extends [any, ...infer ETail]
    ? RemainingParameters<ATail, ETail>
    : []
  : ExpectedParams

type CurriedFunction<Func extends Fn> = <
  AppliedParams extends RequiredFirstParam<Func>
>(
  ...args: AppliedParams
) => RemainingParameters<AppliedParams, Parameters<Func>> extends [
  any,
  ...any[]
]
  ? CurriedFunction<
    (
      ...args: RemainingParameters<AppliedParams, Parameters<Func>>
    ) => ReturnType<Func>
  >
  : ReturnType<Func>

const curry = <Func extends Fn>(
  f: Func,
  ...args: Partial<Parameters<Func>>
): CurriedFunction<Func> => {
  const curriedFunc = (...nextArgs: RequiredFirstParam<Func>) => {
    const allArgs = [...args, ...nextArgs]

    if (allArgs.length >= f.length) {
      return f(...args, ...nextArgs)
    }
    return curry(f, ...(allArgs as Parameters<Func>))
  }

  return curriedFunc
}

export { curry }
