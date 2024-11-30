type Geo = {
  lat: string
  lng: string
}

type Address = {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
  phone: string
  website: string
}

type Company = {
  name: string
  catchPhrase: string
  bs: string
}

export type User = {
  id: number
  name: string
  username: string
  address: Address
  company: Company
}

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}
