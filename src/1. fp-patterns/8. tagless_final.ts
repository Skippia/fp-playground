import type { HKT, Type, URIS } from 'fp-ts/lib/HKT'
import type { Identity, URI } from 'fp-ts/lib/Identity'
import { identity } from 'fp-ts/lib/Identity'
import type { Monad, Monad1 } from 'fp-ts/lib/Monad'

// Task: get all users named 'John' and make them admins

type User = {
  id: number
  name: string
  age: number
  isAdmin: boolean
}

const fakeUsers: User[] = [
  {
    id: 1,
    name: 'John Connor',
    age: 32,
    isAdmin: false,
  },
  {
    id: 2,
    name: 'John Smith',
    age: 18,
    isAdmin: false,
  },
  {
    id: 3,
    name: 'Mark Brian',
    age: 28,
    isAdmin: false,
  },
]

type UserOps<M> = {
  search: (params: Partial<User>) => HKT<M, User[]>
  makeAdmins: (users: User[]) => HKT<M, User[]>
  save: (users: User[]) => HKT<M, boolean[]>
}
type UserOps2<M extends URIS> = {
  search: (params: Partial<User>) => Type<M, User[]>
  makeAdmins: (users: User[]) => Type<M, User[]>
  save: (users: User[]) => Type<M, boolean[]>
}

type App<M> = { } & UserOps<M> & Monad<M>
type App2<M extends URIS> = { } & UserOps2<M> & Monad1<M>

type TProgram = {
  getMain: <M extends URIS>(M: App2<M>) => () => Type<M, boolean[]>
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

const testInstance: App2<URI> = {
  ...(identity as Monad1<URI>),
  search: (params: Partial<User>) => identity.of(fakeUsers.filter(u => u.name.includes(params.name))),
  makeAdmins: (users: User[]) => identity.of(users.map(u => ({ ...u, isAdmin: true }))),
  save: (users: User[]) => identity.of(users.map(u => u.isAdmin)),
}

const main = new Program().getMain(testInstance)

const result = main() as Identity<boolean[]>
console.log(result.value)
