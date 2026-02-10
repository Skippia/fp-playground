# fp-playground

Функциональное программирование на TypeScript через призму fp-ts. Запускаемые примеры от базовых паттернов до теории категорий.

## Motivation

Концепции ФП разбросаны по Haskell-туториалам, академическим статьям и разрозненным блог-постам. Каждый объясняет функторы по-своему, примеры на Scala не переносятся в TypeScript, а большинство «введений в монады» заканчиваются на `Maybe`.

Здесь я собрал всё в одном месте: от каррирования до natural transformations, от `Option` до `ReaderTaskEither`. Каждый файл — самостоятельный запускаемый пример с комментариями. Можно читать последовательно как курс или использовать как справочник.

Почему fp-ts: это де-факто стандарт для типизированного ФП в TypeScript. Библиотека реализует type classes из Haskell (Functor, Applicative, Monad, Foldable, Traversable) с полной поддержкой вывода типов. В отличие от Ramda, здесь строгая типизация на уровне HKT, а не `any` повсюду.

## Quick Start

**Prerequisites:** Node.js 18.16.0 (см. `.nvmrc`)

```bash
# Если используешь nvm
nvm use

# Установка зависимостей
npm install

# Запуск (компиляция + выполнение src/main.ts)
npm run dev

# Тесты
npm test
```

Точка входа — `src/main.ts`. Для запуска конкретного файла — импортируй нужный модуль в `main.ts` или используй `tsx`:

```bash
npx tsx "src/1. fp-patterns/3. currying.ts"
```

## Project Structure

```
src/
  1. fp-patterns/              -- Базовые паттерны ФП (HOF, каррирование, композиция, point-free)
  2. type-theory_and_type-systems/  -- Система типов (ADT, HKT, type classes, Eq, Ord)
  3. category-theory-concepts/      -- Теория категорий (функторы, аппликативы, монады, моноиды)
  4. monads_and_effect-handling/    -- Монады и обработка эффектов
     1. option/                     -- Option (14 файлов)
     2. either/                     -- Either (11 файлов)
     4. task-either/                -- TaskEither (5 файлов)
  5. advanced-functional-constructs/ -- Оптики, traverse, sequence
  6. mini-projects/                  -- Game of Life, сетевые запросы, рендеринг
  shared/                            -- Утилиты (linked list, measure-performance, typed curry)
```

## Tech Stack

| Библиотека | Назначение |
|---|---|
| `fp-ts` | Type classes, монады, pipe/flow композиция |
| `monocle-ts` | Оптики (Lens, Traversal, Optional) |
| `ramda` | Утилиты ФП (curry, compose, map) в JS-примерах |
| `ts-adt` | Pattern matching для tagged unions |
| `zod` | Runtime-валидация схем (в примерах с Either) |
| `typescript` (strict) | Все strict-флаги включены |
| `jest` + `ts-jest` | Тесты для TaskEither |
| `@mostly-adequate/support` | Утилиты из «Professor Frisby's Mostly Adequate Guide» |
| `eslint-plugin-functional` | Линтинг для ФП-стиля |

## Learning Path

Рекомендованный порядок изучения:

1. **FP Patterns** — фундамент: HOF, каррирование, композиция, point-free
2. **Type Theory** — ADT, HKT, type classes — без этого не понять fp-ts
3. **Category Theory** — функторы, аппликативы, монады — теоретическая база
4. **Monads & Effects** — практика: Option, Either, TaskEither, IO
5. **Advanced Constructs** — оптики, traverse, sequence
6. **Mini-Projects** — всё вместе в реальных сценариях

Секции 1 и 2 можно изучать параллельно. Секция 3 требует понимания HKT из секции 2. Секция 4 — самая объёмная; начинай с Option, потом Either, потом TaskEither.

---

## 1. FP Patterns

Базовые паттерны функционального программирования. Каждый файл — отдельная концепция с примерами.

#### `1. high-order-function(HOF).ts`

Функции высшего порядка — функции, которые принимают другие функции как параметры или возвращают функции. Здесь разбирается создание функции-множителя, которая возвращает унарную функцию. Самый базовый строительный блок ФП.

```typescript
type TMultiply = (factor: number) => TDouble
type TDouble = (val: number) => number

const multiplyBy: TMultiply = factor => val => factor * val

const val = multiplyBy(2)(100) // 200
```

#### `2. partial-applying.ts`

Частичное применение — фиксация первых аргументов функции. В отличие от каррирования, здесь фиксируется произвольное количество аргументов за один раз. Показана разница между partial application и полным каррированием.

```typescript
function add(a: number, b: number, c: number): number {
  return a + b + c
}

function addFive(b: number, c: number): number {
  return add(5, b, c)
}
```

#### `3. currying.ts`

Каррирование — преобразование многоаргументной функции в цепочку унарных. Два подхода: естественное каррирование через стрелочные функции и явный трансформер `curry2` с generic-типизацией.

```typescript
type Curry2 = <A, B, Z>(f: (a: A, b: B) => Z) => (a: A) => (b: B) => Z
const curry2: Curry2 = f => a => b => f(a, b)

const sum2 = curry2(normalSum)
const x = sum2(1)(2)
```

#### `4. function-composition.ts`

Композиция функций — ядро ФП. Определение `compose` с полной типизацией через дженерики: `(A -> B) -> (B -> C) -> (A -> C)`. Математическое определение, перенесённое в TypeScript.

```typescript
type Compose = <A, B, C>(
  f: (x: B) => C,
  g: (x: A) => B
) => (x: A) => C

export const compose: Compose = (f, g) => a => f(g(a))
```

#### `4. recursion.ts`

Рекурсия вместо циклов. Два варианта суммирования массива: классический с базовым случаем и компактный с тернарным оператором. Демонстрирует мышление в терминах «базовый случай + шаг рекурсии».

#### `5. point-free-style.ts`

Point-free стиль — написание функций без явного упоминания аргументов. Сравнение «pointful» стиля (с промежуточными переменными) и point-free через `flow`. Показывает, как убрать шум из кода.

```typescript
const toUpperCase = (s: string): string => s.toUpperCase()
const exclaim = (s: string): string => s + '!'

// Pointful
const pointfulUpEx = (s: string) => {
  const uppercased = toUpperCase(s)
  return exclaim(uppercased)
}

// Point-free
const pointfreeUpEx = flow(toUpperCase, exclaim)
```

#### `6. lazy-evaluation.ts`

Ленивое вычисление через генераторы. Бесконечный поток чисел, который вычисляет значения только при вызове `next()`. Полезно для работы с потенциально бесконечными последовательностями без выделения памяти заранее.

```typescript
function* lazyRange(start: number) {
  let current = start
  while (true) {
    yield current++
  }
}

const numbers = lazyRange(1)
numbers.next().value // 1
numbers.next().value // 2
```

#### `7. pattern-matching.ts`

Сопоставление по образцу для Option, Either и пользовательских ADT (List). Реализация `matchW` вручную и использование ts-adt для автоматического сопоставления. Показывает как разбирать алгебраические типы данных type-safe способом.

```typescript
type OMatchW = <A, B, C>(onNone: () => B, onSome: (a: A) => C) => (x: O.Option<A>) => B | C

const omatchW: OMatchW = (onNone, onSome) => x =>
  O.isNone(x) ? onNone() : onSome(x.value)
```

#### `7.2 pattern-matching.ts`

Расширенный пример: обработка ошибок при оформлении платежа. Несколько типов ошибок (`AccountFrozen`, `NotEnoughBalance`) обрабатываются через ts-adt с дискриминирующим полем `type`. Практический сценарий с business logic.

#### `8. tagless-final.ts`

Паттерн tagless-final — описание программы через абстрактный интерфейс, независимый от конкретной монады. Полиморфная программа для поиска пользователей и преобразования их в администраторов может работать с Identity, Either или Task — без изменения логики.

```typescript
type UserOps<M> = {
  search: (params: Partial<User>) => HKT<M, User[]>
  makeAdmins: (users: User[]) => HKT<M, User[]>
  save: (users: User[]) => HKT<M, boolean[]>
}

class Program implements TProgram {
  getMain<M>(M: App<M>): () => HKT<M, boolean[]> {
    return () => {
      const johns = M.search({ name: 'John' })
      const admins = M.chain(johns, M.makeAdmins)
      return M.chain(admins, M.save)
    }
  }
}
```

#### `9. type-driven-development.ts`

Разработка, управляемая типами. Абстрактные сигнатуры функций (`sequence`, `liftA2`) показывают как типы определяют реализацию. Идея в том, что правильная сигнатура типа оставляет единственную корректную реализацию.

#### `10. functional-error-handling.ts`

Обработка ошибок без исключений. Реализация Option и Either с нуля (без fp-ts). Сравнение try-catch с типобезопасным функциональным подходом через `fold`.

```typescript
const head = <A>(as: Array<A>): Option<A> =>
  as.length === 0 ? none : some(as[0]!)

const s = fold(
  head([]),
  () => 'Empty array',
  a => String(a)
)
```

#### `11. trace.ts`

Функция `trace` для отладки пайплайнов — логирует промежуточное значение, не нарушая поток данных. Незаменима при отладке длинных `compose`/`pipe` цепочек.

```typescript
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

const dasherize = compose(
  intercalate('-'),
  toLower,
  trace('after split'),
  split(' '),
  replace(/\s{2,}/g, ' ')
)
```

---

## 2. Type Theory & Type Systems

Типовая система TypeScript как инструмент моделирования. Здесь разбираются концепции, которые делают fp-ts возможным.

#### `1. algebraic-data-type(ADT-s).ts`

Два основных вида ADT: произведения (product types — кортежи, объекты) и суммы (sum types — tagged unions). Объясняется концепция мощности (cardinality) типов. Реализация связного списка как sum type с `fold` для pattern matching.

```typescript
type List<A> = { type: 'Empty' } | { type: 'Element'; value: A; next: List<A> }

const fold = <A, R>(
  list: List<A>,
  onEmpty: () => R,
  onNext: (head: A, tail: List<A>) => R
): R => (list.type === 'Empty' ? onEmpty() : onNext(list.value, list.next))

const length = <A>(list: List<A>): number =>
  fold(list, () => 0, (_, tail) => 1 + length(tail))
```

#### `2. higher-kinded-types(HKT-s).ts`

HKT в TypeScript — через URI-паттерн и маппинг `_URItoKind`. Этот трюк позволяет создавать generic-функции, параметризованные не конкретным типом, а type constructor-ом (Option, Either, List). Основа всей архитектуры fp-ts.

```typescript
type _URItoKind<A> = {
  Option: O.Option<A>
  List: List<A>
}

type _Kind<URI extends _URIS, A> = URI extends _URIS ? _URItoKind<A>[URI] : any
```

#### `3.1. type-classes.ts`

Type classes как интерфейсы с URI-привязкой. Определения Show и Functor через HKT. Type class — это контракт: «если тип поддерживает эту операцию, он — экземпляр type class».

```typescript
type _Functor1<F extends _URIS> = {
  URI: F
  map: <A, B>(fa: _Kind<F, A>, f: (a: A) => B) => _Kind<F, B>
}
```

#### `3.2. type-classes-impl.ts`

Реализация type classes из fp-ts. Функция `lift`, которая обобщает `map` для любого функтора — перегруженная для `Functor1`, `Functor2` и базового `Functor`. Показывает как один и тот же код работает с Option, Either и Array.

```typescript
function lift<F extends URIS>(
  F: Functor1<F>
): <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>
function lift<F>(
  F: Functor<F>
): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B> {
  return f => fa => F.map(fa, f)
}
```

#### `4. parametric-polymorphism.ts`

Параметрический полиморфизм — обобщённые функции и классы. `identity<T>` и `Box<A>` с `map`. Тип параметризован, реализация единственная — в этом и смысл параметрического полиморфизма.

#### `5. ad-hoc-polymorphism.ts`

Ad-hoc полиморфизм через перегрузку функций. Функция `add` с разными сигнатурами для `number` и `string`. Противопоставление параметрическому: поведение зависит от типа.

#### `6. smart-constructors.ts`

Смарт-конструкторы с branded types. `Int` и `NonEmptyString` — типы с инвариантами, гарантированными на уровне системы типов. Создание только через `fromPredicate`, который возвращает `Option`.

```typescript
export type Int = number & IntBrand
export type NonEmptyString = string & NonEmptyStringBrand

export const makeInt: MakeRefinementOption<number, Int> = O.fromPredicate(isInt)
export const makeNonEmptyString: MakeRefinementOption<string, NonEmptyString> =
  O.fromPredicate(isNonEmptyString)
```

#### `7. eq.ts`

Eq type class — определение равенства для типов. Законы (рефлексивность, симметрия, транзитивность). Комбинирование через `struct` для объектов и `contramap` для проекций.

```typescript
const eqPoint: Eq.Eq<Point> = Eq.struct({
  x: eqNumber,
  y: eqNumber
})

const eqUser = Eq.contramap((user: User) => user.userId)(eqNumber)
```

#### `7.2. eq.ts`

Производные экземпляры Eq. Создание Eq для массивов и вложенных структур через `getEq`. Показывает композицию: `getEq(getEq(eqNumber))` даёт Eq для `ReadonlyArray<ReadonlyArray<number>>`.

#### `8. ord.ts`

Ord type class — расширение Eq с операцией сравнения. Комбинаторы `min`, `max`, `reverse` для создания разных порядков сортировки. Использование `contramap` для сортировки по полям структур.

```typescript
const min = <A>(O: Ord.Ord<A>) => (x: A, y: A): A =>
  O.compare(x, y) === 1 ? y : x

function max<A>(O: Ord.Ord<A>): (x: A, y: A) => A {
  return min(Ord.reverse(O))
}
```

---

## 3. Category Theory Concepts

Теория категорий в коде. Файлы сгруппированы по уровню абстракции: от базовых структур (Magma) до сложных конструкций (Kleisli, Natural Transformations).

### Foundations

#### `1. category.ts`

Категория как формализация композиции. TypeScript как категория: объекты — типы, морфизмы — функции, композиция — `compose`. Центральная проблема: как компоновать функции с несовместимыми типами (решение — функторы и монады).

#### `2. functor.ts`

Функтор — способ «поднять» чистую функцию в контекст эффекта. Реализация `mapOption` вручную. Демонстрирует как функтор позволяет компоновать чистые функции с эффектными без разворачивания контейнера.

```typescript
type MapOption = <A, B>(f: (x: A) => B) => (Fx: O.Option<A>) => O.Option<B>
const mapOption: MapOption = f =>
  O.match(
    () => O.none,
    value => O.some(f(value))
  )

const function2 = mapOption(flow(strLength, increment))
function2(O.some('abcd')) // O.some(6)
```

#### `2.2. functor.ts`

Функторы как отображения между категориями. Определение `lift` для Array, Option и Task. Показывает, что функтор — это не просто `map`, а полноценное отображение, сохраняющее структуру (identity и composition laws).

```typescript
function liftO<B, C>(g: (b: B) => C): (fb: O.Option<B>) => O.Option<C> {
  return fb => (O.isNone(fb) ? O.none : O.some(g(fb.value)))
}

function liftT<B, C>(g: (b: B) => C): (fb: T.Task<B>) => T.Task<C> {
  return fb => () => fb().then(g)
}
```

#### `2.3. functor.ts`

Законы функторов: identity (`map(id) = id`) и composition (`map(f . g) = map(f) . map(g)`). Проверка на примере Option. Если законы нарушены — это не функтор.

#### `3. bifunctor.ts`

Бифунктор — функтор с двумя параметрами типа. Операция `bimap` трансформирует обе стороны (например, Left и Right в Either). Реализация для Either через `match`.

```typescript
const EitherFunctor: Bifunctor2<'Either'> = {
  URI: 'Either',
  bimap: (f, g) =>
    E.match(
      a => E.left(f(a)),
      b => E.right(g(b))
    )
}
```

#### `4. contramap.ts`

Контравариантное отображение — `contramap` работает «в обратную сторону». Если есть `Eq<A>` и функция `B -> A`, получаем `Eq<B>`. Используется для создания экземпляров type classes через проекцию.

```typescript
const contramap: TContramap = f => E =>
  fromEquals((x, y) => E.equals(f(x), f(y)))

const eqUser: Eq<User> = contramap((user: User) => user.id)(numberEq)
```

### Composition

#### `5. functor-composition.ts`

Композиция функторов — `Option<List<A>>` как один функтор. Используется `getFunctorComposition` для создания функтора для вложенных типов. Позволяет применять `map` на глубоком уровне без ручного разворачивания.

#### `6. applicative-functor.ts`

Аппликативные функторы решают проблему применения завёрнутых функций к завёрнутым значениям. Операция `ap` и производные `liftA2`, `liftA3`. Ключевая идея: `map` работает с одним аргументом, `ap` — с несколькими.

```typescript
const liftA2: TLiftA2<'Option'> = F => f => fa => fb => {
  const x = F.map(fa, f)   // Option<(b: B) => C>
  const y = F.ap(x, fb)    // Option<C>
  return y
}

const y = liftA2(O.Applicative)(add)(O.of(2))(O.of(3)) // O.of(5)
```

#### `6.2. applicative-functor-laws.ts`

Четыре закона аппликативов: Identity, Homomorphism, Interchange, Composition. Каждый проверен на Option.

#### `6.3. applicative-functor.ts` / `6.4. applicative-functor.ts`

Различие Apply и Applicative. Реализация `ap` для Array (декартово произведение). Детальное объяснение `ap` через `map` + `flatten`.

#### `7. monad.ts`

Монада — решение проблемы композиции эффектных программ вида `(a: A) => M<B>`. Три закона: левая тождественность, правая тождественность, ассоциативность. Демонстрация на Option и Array.

```typescript
const multi = (x: number): O.Option<number> => O.of(x * 3)
const division = (x: number): O.Option<number> => O.of(x / 5)
const add = (x: number): O.Option<number> => O.of(x + 33)

// Ассоциативность: (f >=> g) >=> h = f >=> (g >=> h)
const left = O.flatMap(compose(O.flatMap(add), division))
const right = compose(O.flatMap(add), O.flatMap(division))
```

### Algebraic Structures

Иерархия алгебраических структур: Magma -> Semigroup -> Monoid -> Group. Каждая надстройка добавляет одно свойство.

#### `9. magma.ts`

Magma — бинарная операция `concat` без ограничений. Самая базовая алгебраическая структура. Единственное требование: замкнутость (результат `concat` принадлежит тому же множеству).

#### `10. semigroup.ts`

Semigroup — Magma с ассоциативностью: `concat(concat(a, b), c) = concat(a, concat(b, c))`. Примеры: числа с +, строки с конкатенацией, булевы с &&. Комбинатор `struct` для создания Semigroup для объектов.

```typescript
type Point = { x: number; y: number }
const semigroupPoint: S.Semigroup<Point> = S.struct<Point>({
  x: N.SemigroupSum,
  y: N.SemigroupSum,
})
```

#### `10.2. semigroup.ts`

Расширенные примеры: `min`, `max`, `struct` для Customer. Semigroup для слияния записей — практический паттерн для merge-стратегий.

```typescript
const semigroupCustomer: S.Semigroup<Customer> = S.struct({
  name: S.max(Ord.contramap((s: string) => s.length)(N.Ord)),
  favoriteThings: A.getMonoid<string>(),
  registeredAt: S.min(N.Ord),
  lastUpdatedAt: S.max(N.Ord),
  hasMadePurchase: B.SemigroupAny
})
```

#### `11. monoid.ts`

Monoid — Semigroup с нейтральным элементом `empty`. Числа + 0, строки + "", булевы + true/false. `concatAll` для свёртки списка с identity.

```typescript
type Monoid<M> = {
  empty: M
} & Semigroup<M>

const concatAll2 = <A>(m: Monoid<A>) =>
  (xs: List<A>): A =>
    match(
      () => m.empty,
      (head: A, tail: List<A>) => m.concat(head, concatAll2(m)(tail))
    )(xs)
```

#### `11.2. monoid.ts` / `11.3. monoid.ts`

Встроенные Monoid в fp-ts: `concatAll`, `replicate`. Законы (левая и правая тождественность). Monoid для `Option` через `getMonoid` — стратегии выбора первого/последнего значения.

#### `11.4. monoid.ts`

Практический пример: слияние настроек (VSCode Settings). `O.getMonoid(S.last())` — последнее значение переопределяет предыдущее. Стандартный паттерн для конфигурирования.

```typescript
type Settings = {
  fontFamily: O.Option<string>
  fontSize: O.Option<number>
  maxColumn: O.Option<number>
}

const monoidSettings: Monoid<Settings> = M.struct({
  fontFamily: O.getMonoid(S.last<string>()),
  fontSize: O.getMonoid(S.last<number>()),
  maxColumn: O.getMonoid(S.last<number>())
})

// userSettings переопределяют workspaceSettings
monoidSettings.concat(workspaceSettings, userSettings)
```

#### `12. group.ts`

Group — Monoid с операцией `inverse`. Каждый элемент имеет обратный: `concat(a, inverse(a)) = empty`. Пример: шифр Цезаря как Group над числами по модулю длины алфавита.

```typescript
const caesarGroup: Group<number> = {
  concat: (x, y) => (x + y) % alphabets.length,
  empty: 0,
  inverse: a => (alphabets.length - a) % alphabets.length
}
```

### Advanced

#### `8. foldable.ts`

Foldable type class — свёртка структур данных. `reduceM` для монадической редукции Tree и Array. `foldMap` для конвертации дерева в массив через Monoid.

```typescript
const t = T.make(1, [T.make(2, []), T.make(3, []), T.make(4, [])])

const treeToArray = pipe(
  t,
  T.foldMap(A.getMonoid<number>())(A.of)
)
```

#### `8. sequence.ts`

Sequence — преобразование `Array<Option<A>>` в `Option<Array<A>>`. Если хотя бы один элемент `None` — результат `None`. Полезно для сбора результатов и проверки «все ли успешны».

```typescript
const t = [O.some(1), O.some(2), O.some(3), O.some(4)]

const a = A.sequence(O.Applicative)(t) // => O.some([1, 2, 3, 4])
```

#### `13. kleisli.ts`

Kleisli-категория — placeholder для будущего контента. Kleisli-стрелки (`a -> M b`) — основа для композиции эффектных функций через `flatMap`.

#### `14. natural-transformations.ts`

Natural Transformations — мосты между контекстами эффектов. Преобразование `Option -> TaskEither` и `Either -> TaskEither`. Практический пример: `getValue` (TaskEither) -> проверка наличия (Option -> TaskEither) -> валидация (Either -> TaskEither) -> отправка.

```typescript
const maybeToTask = (x: O.Option<string>): TE.TaskEither<Error, string> =>
  O.isNone(x)
    ? TE.throwError(new Error('Empty'))
    : TE.of(x.value)

const eitherToTask = (x: E.Either<Error, string>): TE.TaskEither<Error, string> =>
  E.isLeft(x)
    ? TE.throwError(x.left)
    : TE.of(x.right)

const saveCommentWithNT = flow(
  getValue,
  TE.flatMap(maybeToTask),
  TE.map(validate),
  TE.flatMap(eitherToTask),
  TE.map(postComment)
)
```

---

## 4. Monads & Effect Handling

Самая объёмная секция. Каждая монада разбирается от простых случаев к сложным.

### Option (14 файлов)

Option моделирует возможное отсутствие значения. Замена `null`/`undefined` на type-safe контейнер.

#### `0. basic.ts`

Введение в Option: определение `Some<A> | None`, проблема частичных функций. Преобразование `divide2` в `divide2Safe`, возвращающую `Option<number>` вместо throw.

#### `1-basic.ts` / `1-get_or_else.ts`

Вложенные nullable структуры. Цепочка `fromNullableK` -> `map` -> `getOrElse` для безопасного доступа. Разница между `getOrElse` (один тип) и `getOrElseW` (widened — разные типы).

#### `2-get-ui-message.ts`

`O.match` (бывший `fold`) для pattern matching: обработка None и Some в одном выражении.

#### `3-first_movie_inverse.ts` / `4-flatten_chain_inverse.ts`

Перевод императивного кода в функциональный. Разница между `map` (создаёт `Option<Option<A>>`) и `chain`/`flatMap` (возвращает `Option<A>`).

#### `5-from_predicate.ts`

`fromPredicate` — создание Option из условия. Обычные предикаты и type guards (refinement `Animal -> Cat`). Основа для валидации.

#### `6-movie.ts` / `7-do-you-get-most-of-it.ts`

Fallback-паттерн через `O.orElse`. URL parsing через `O.tryCatch`. Функциональные альтернативы if-else-if и try-catch.

#### `8-do-notation.ts`

Do notation для нескольких зависимых Option. `O.Do` + `O.bind` — каждый шаг видит результаты предыдущих. Если любой шаг возвращает None — вся цепочка None.

```typescript
const level = pipe(
  O.Do,
  O.bind('user', () => getUser(isGetUser, initialScore)),
  O.bind('score', ({ user }) => getUserScore(user)),
  O.map(({ user, score }) => getUserLevel(user, score)),
  O.getOrElse(() => 'Level unknown')
)
```

#### `9-fallback-patten.ts` / `10-conditional-gates.ts`

Каскадные дефолты через `O.orElse` + `O.getOrElse`. Цепочка предикатов через `A.reduce` с `O.fromPredicate` — каждый предикат как gate.

#### `11-birthday.ts` / `12-some-constructors.ts`

Практический пример: проверка дня рождения. Взаимопреобразования `O.toNullable`, `O.fromNullable`, `O.some`, `O.of` — мосты между Option и nullable миром.

#### `13-refinement.ts`

Type refinements с branded types. Смарт-конструкторы `makeInt`, `makeNonEmptyString` через `O.fromPredicate` с type guard.

#### `14-do-notation-2.ts`

Do notation с `O.bindTo` для начального значения. Зависимые вычисления: `doubled` зависит от `original`, `tripled` — от `doubled`.

```typescript
const result = (n: number) => pipe(
  O.of(n),
  O.bindTo('original'),
  O.bind('doubled', ({ original }) => doubler(original)),
  O.bind('tripled', ({ doubled }) => tripler(doubled)),
  O.bind('cubed', ({ tripled }) => pow3r(tripled))
)
```

### Either (11 файлов)

Either — Option с информацией об ошибке. `Left<E>` — ошибка, `Right<A>` — успех.

#### `0. basic.ts` / `1. basic.ts`

Введение: три подхода к обработке ошибок — throw, Option (теряет причину), Either (сохраняет причину). Валидация Person через `E.fromPredicate` и `E.chain` с regex для email.

#### `1-left_right_cases.ts`

Операции над сторонами: `E.map` (Right), `E.mapLeft` (Left), `E.match` (pattern matching), `E.alt` (fallback), `E.getOrElse` (извлечение).

#### `2-balance-chaining.ts` / `3-cart_account.ts`

Pipeline с `E.flatten` для сокращения вложенности. Union типов ошибок с ts-adt: `Either<AccountFrozen | NotEnoughBalance, Account>`.

#### `4-try_catch.ts`

`E.tryCatch` и `E.tryCatchK` — обёртки над throwing-функциями. JSON.parse через Either вместо try-catch.

```typescript
const jsonParse1 = (text: string) =>
  E.tryCatch(() => JSON.parse(text), E.toError)

const jsonParse2 = E.tryCatchK(JSON.parse, E.toError)
```

#### `5-transformation.ts` / `6-either-chain.ts`

JSON stringify через `fp-ts/Json`. Многостадийная валидация: base64 decode -> JSON parse -> zod validation с union ошибок.

```typescript
function decodeUserRefactored(
  encodeUser: string
): E.Either<JsonParseError | Base64DecodeError | ValidationUserError, User> {
  return pipe(
    encodeUser,
    base64Decode,
    E.flatMap(jsonParse),
    E.flatMap(decodeUserObjectFromUnknown)
  )
}
```

#### `7-structure-validation.ts` / `8-smart-constructor.ts`

`E.filterOrElse` для валидации структур. Смарт-конструкторы с `E.fromPredicate` + regex.

#### `9-either-chain-2.ts`

Fallback: email или phone number. `E.orElseW` для альтернативного пути с другим типом ошибки.

#### `10-validation-form.ts`

Аппликативная валидация — сбор ВСЕХ ошибок вместо первой. `E.getApplicativeValidation` + `sequenceT`. Ключевое отличие от монадной валидации.

```typescript
const applicativeValidation = E.getApplicativeValidation(
  getSemigroup<string>()
)

export function validatePasswordAllErrors(
  s: string
): E.Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(applicativeValidation)(
      minLengthV(s),
      oneCapitalV(s),
      oneNumberV(s)
    ),
    E.map(() => s)
  )
}
```

#### `11-either-or-else-recovery.ts`

Восстановление после ошибок через `E.orElseW`. Если не email — попробовать как phone number.

### Task (1 файл)

#### `3. task.ts`

Task — ленивый `Promise` без обработки ошибок: `() => Promise<A>`. Placeholder; основное использование — через TaskEither.

### TaskEither (5 файлов)

TaskEither = Task + Either. Асинхронные операции с типизированными ошибками.

#### `TaskEither-1.ts`

Введение: `TE.fromPredicate`, `TE.tryCatchK` для обёртки axios. Pipeline: API call -> DB query через `TE.flatMap`.

```typescript
const fetchAPIUsingTaskEither = TE.tryCatchK(
  (url: string) => axios.get(url),
  reason => new Error(String(reason))
)

const result = pipe(
  apiUrl,
  fetchAPIUsingTaskEither,
  TE.flatMap(apiResult =>
    fetchDbUsingTaskEither(dbClientMock)(apiResult.data.id)
  )
)
```

#### `TaskEither-2.ts`

Do notation для TaskEither. `TE.apS` для независимых TaskEither, `TE.bind` для зависимых. Каждый последующий запрос видит результаты предыдущих.

#### `TaskEither-3.ts`

`traverseArray` vs `sequence` + `ApplicativePar`. Монадный способ (как `Promise.all` — fail fast) и аппликативный (как `Promise.allSettled` — собрать все).

```typescript
// Последовательно (монадный)
const traverseExample = TE.traverseArray(timerToTaskEither)(timers)

// Параллельно (аппликативный)
const getResult = pipe(
  timers,
  A.map(timerToTaskEither),
  A.sequence(T.ApplicativePar)
)
```

#### `TaskEither-4.ts`

Сложный пример: смарт-конструкторы + TaskEither + обработка ошибок на каждом этапе. Преобразование ошибок в единую `ErrorResult` структуру.

#### `taskEither-part-2.test.ts`

Jest-тесты для TaskEither. Мокирование axios для разных сценариев (успех, ошибки). `E.match` в тестах для проверки Left и Right.

### IO (1 файл)

#### `5. io.ts`

IO монада — чистое описание побочных эффектов. Функция `time` замеряет время выполнения. `withLogging` добавляет логирование с таймингом. IO не выполняет эффект — только описывает.

```typescript
export function time<A>(ma: IO<A>): IO<[A, number]> {
  return io.chain(now, start =>
    io.chain(ma, a =>
      io.map(now, end => [a, end - start])
    )
  )
}
```

### Reader, RTE, State, Writer

`6. reader.ts`, `7. reader-task-either.ts`, `8. state.ts`, `9. writer.ts` — placeholder-файлы для будущего контента.

### `10. do-notation.ts`

Do notation со смарт-конструкторами и branded types. `O.Do` + `O.bind` для проверки нескольких зависимых условий (имя + возраст -> Person).

### `11. array.ts`

Функциональная работа с массивами: `A.zip`, `A.map`, `A.reduce`. Эквивалентность `pipe` и `flow`.

---

## 5. Advanced Functional Constructs

#### `1. optics.ts`

Оптики из monocle-ts для работы с глубоко вложенными структурами. Композиция Lens + Traversal + Optional для доступа к `users[*].posts[*].comments?.text` и модификации всех значений одной функцией.

```typescript
const usersTextTraversal = usersTraversal
  .composeLens(postsLens)
  .composeTraversal(postTraversal)
  .composeOptional(commentsOptional)
  .composeTraversal(commentTraversal)
  .composeLens(textLens)

const modifiedDataOptics = usersTextTraversal.modify(capitalize)(exampleData)
```

#### `2.1. sequence.ts`

Sequence для преобразования контейнеров эффектов. `E.sequenceArray`, `sequenceT` (кортежи), `sequenceS` (объекты). Объединение результатов через Applicative.

```typescript
const tt4 = pipe(
  input,
  ({ a, b }) => sequenceS(E.Apply)({
    a: validateNumber(a),
    b: validateString(b)
  }),
  E.map(register)
)
```

#### `2.2. traversal.ts`

Traverse — map + sequence за один шаг. Преобразование `Option<Either<E, Option<A>>>` в нужную форму. Разница между аппликативным и монадным traverse.

#### `2.3. traverse_and_sequence_with_TE.ts`

Параллельное vs последовательное выполнение с TaskEither. `ApplicativeSeq` (sequential), `ApplicativePar` (parallel, как Promise.all), `getRaceMonoid` (как Promise.race).

```typescript
// Параллельно (Promise.all)
const y = pipe(
  timers,
  A.map(timerToTaskEither),
  A.sequence(TE.ApplicativePar)
)

// Race (Promise.race)
const raceMonoid = T.getRaceMonoid<E.Either<Error, string>>()
const b = pipe(
  timers,
  A.map(timerToTaskEither),
  monoid.concatAll(raceMonoid)
)
```

---

## 6. Mini-Projects

Всё вместе в приближенных к реальности сценариях.

#### `game-of-life.ts`

Игра жизни Конвея. Either как состояние клетки (`Left<'dead'> | Right<'alive'>`), `bimap` для правил (dead с 3 соседями -> alive, alive с 2-3 -> alive). Чистые функции для вычисления поколений.

```typescript
type Cell = E.Either<'dead', 'alive'>
const dead: Cell = E.left('dead')
const alive: Cell = E.right('alive')
```

#### `renderer.js`

Классический пример из «Professor Frisby's Mostly Adequate Guide». Ramda + jQuery для работы с Flickr API. Разделение чистых функций и Impure-обёрток. JavaScript-версия.

#### `renderer.ts`

TypeScript-версия рендерера. TaskEither для HTTP, IO для DOM-манипуляций, flow для типизированной композиции. Тот же функционал, но type-safe.

#### `small-example1.ts`

Either + Task композиция. `readFile` возвращает `Either<string, Task<string>>`, затем `E.map(T.flatMap(httpPost))` для асинхронной операции внутри Either.

#### `demonstration-showcase/examples/merge-strategy.ts`

Semigroup для слияния данных. Стратегии для каждого поля Customer: максимальная длина имени, объединение массивов, экстремумы дат. `foldMap` для агрегирования предикатов через Monoid.

#### `demonstration-showcase/examples/network/`

Три подхода к сетевым запросам:

- **`classic.ts`** — Promise chain, callback hell, вложенность
- **`network-request-impl1.ts`** — TaskEither + Option + sequence для параллельного выполнения
- **`network-request-impl2.ts`** — Упрощённая версия через flatMap и rightTask

**`types.ts`** — типы для JSONPlaceholder API (User, Post).

---

## Shared Utilities

#### `measure-performance.ts`

Класс для замера времени выполнения. Статические методы `start(id)` / `end(id)` с Map для хранения timestamps.

#### `linked-list.ts`

Функциональный связный список как ADT. Tagged union (`Nil | Cons<A>`), `match` для pattern matching, `showList` для отображения. Используется в примерах с Monoid.

```typescript
type List<A> = Nil | Cons<A>
type Nil = { _tag: 'Nil' }
type Cons<A> = { _tag: 'Cons'; head: A; tail: List<A> }

const match: LMatch = (onNil, onCons) => xs =>
  isNil(xs) ? onNil() : onCons(xs.head, xs.tail)
```

#### `typed-carry.ts`

Продвинутая реализация типизированного каррирования. Условные типы для вычисления оставшихся параметров. Функция `curry` может вызываться с произвольным количеством аргументов до полного насыщения.

#### `global.ts` / `index.ts`

Регистрация MeasurePerformance в global scope и ре-экспорт утилит.

---

## Key Patterns & Idioms

Паттерны, которые повторяются по всему репозиторию.

**`pipe()` и `flow()`** — два способа композиции. `pipe` начинается со значения: `pipe(value, f, g, h)`. `flow` создаёт функцию: `flow(f, g, h)`. `pipe` для inline-использования, `flow` для point-free определений.

**Pattern matching через `match` / `fold` / `matchW`** — разбор ADT на варианты. `match` — строгий (оба варианта одного типа), `matchW` — widened (типы могут отличаться).

**`fromPredicate`** — создание Option/Either из булева условия. С обычным предикатом или type guard (для сужения типа). Основной инструмент валидации.

**Do-notation** — последовательные монадические операции с доступом к предыдущим результатам. `Do` -> `bind('name', () => ...)` -> `bind('age', ({ name }) => ...)` -> `map(...)`.

**Natural transformations** — мосты между эффектами: `Option -> TaskEither`, `Either -> TaskEither`. Используются когда pipeline содержит разные типы эффектов.

**Brand types** — refinement типов на уровне компиляции. `number & IntBrand` гарантирует, что значение прошло валидацию. Создаётся только через смарт-конструктор.

**Applicative validation** — сбор всех ошибок вместо short-circuit на первой. `getApplicativeValidation` + `sequenceT` вместо монадного `chain`.

---

## Scripts Reference

| Скрипт | Описание |
|---|---|
| `npm run dev` | Компиляция + запуск `src/main.ts` с watch-режимом (nodemon) |
| `npm run build` | Компиляция TypeScript в `build/` |
| `npm run build:watch` | Компиляция в watch-режиме |
| `npm run start:debug` | Запуск с `--inspect-brk` для отладки |
| `npm test` | Запуск Jest с coverage |
| `npm run test:watch` | Jest в watch-режиме |
| `npm run ts:check` | Проверка типов без компиляции |
| `npm run eslint` | Линтинг |
| `npm run eslint:fix` | Линтинг с автофиксом |
| `npm run format` | Prettier |

## License

MIT
