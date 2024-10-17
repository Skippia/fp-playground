/* eslint-disable ts/no-shadow */
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

export type FindOrdersRequest = {
  body: {
    count: number
    date: Date
  }
}

export enum GeneralErrors {
  InternalServerError = 'An unexpected server error was found.',
  AuthTokenError = 'Unable to fetch the auth token.'
}

export enum FindOrderResponseErrors {
  InvalidCount = 'Invalid Count'
}

type ErrorResult = {
  status: number
  name: FindOrderResponseErrors | GeneralErrors | Error['name']
  description: string
}

type Product = {
  readonly id: string
  readonly code: string
  readonly unit: number
}

type Order = {
  readonly id: string
  readonly amount: number
  readonly productIds: readonly {
    id: Product['id']
  }[]
}

type OrderResult = {
  readonly id: Order['id']
  readonly amount: Order['amount']
  products: Product[]
}

type FetchOrdersInput = {
  url: string
  authToken: string
  count: number
  date: Date
}

/**
 * Function that fetch the orders
 */
const fetchOrders = TE.tryCatchK(
  // Mock the orders
  ({ url, authToken, count, date }: FetchOrdersInput) => {
    const demoOrders: Order[] = [
      {
        id: '123',
        amount: 100,
        productIds: [
          {
            id: 'PRODUCT_A'
          }
        ]
      },
      {
        id: '234',
        amount: 200,
        productIds: [
          {
            id: 'PRODUCT_B'
          },
          {
            id: 'PRODUCT_C'
          }
        ]
      }
    ]

    // Mock the results
    return Promise.resolve(demoOrders)
  },
  reason => new Error(`Failed to fetch orders due to Error ${String(reason)}`)
)

type FetchProductsInput = {
  url: string
  authToken: string
  ids: string[]
}

/**
 * Function that fetch the products
 */
const fetchProducts = TE.tryCatchK(
  // Mock the Product
  ({ url, authToken, ids }: FetchProductsInput) => {
    const products = ids.map((id) => {
      switch (id) {
        case 'PRODUCT_A': {
          const mockProduct: Product = {
            code: 'A',
            id: 'PRODUCT_A',
            unit: 1
          }
          return mockProduct
        }
        case 'PRODUCT_B': {
          const mockProduct: Product = {
            code: 'B',
            id: 'PRODUCT_B',
            unit: 2
          }
          return mockProduct
        }
        case 'PRODUCT_C': {
          const mockProduct: Product = {
            code: 'C',
            id: 'PRODUCT_C',
            unit: 3
          }
          return mockProduct
        }
        default: {
          const mockProduct: Product = {
            code: 'DEFAULT',
            id: 'PRODUCT_DEFAULT',
            unit: 1
          }
          return mockProduct
        }
      }
    })
    return Promise.resolve(products)
  },
  reason => new Error(`Failed to fetch product due to Error ${String(reason)}`)
)

/**
 * Function that fetch the authToken
 */
const fetchAuthToken = TE.tryCatchK(
  // Mock the token
  ({ authUrl }) => Promise.resolve('DEMO_AUTH_TOKEN'),
  reason => new Error(`Failed to fetch authToken due to Error ${String(reason)}`)
)

// -----------------------------------------------------------------------------------------------------

// Root fn?
const findOrders = async (req: FindOrdersRequest) => {
  try {
    const { count, date } = req.body

    // Suppose the authUrl, orderUrl and productUrl is stored in a env file
    const authUrl = 'https://YOUR_URL/auth'
    const orderUrl = 'https://YOUR_URL/order'
    const productUrl = 'https://YOUR_URL/product'

    const ordersResultTE = pipe(
      TE.Do,
      TE.apS(
        'count',
        pipe(
          TE.fromEither(
            pipe(
              count,
              E.fromPredicate(
                count => count > 0,
                count => new Error(`Order ${count} is less than 0`)
              )
            )
          ),
          TE.mapLeft<Error, ErrorResult>(error => ({
            name: FindOrderResponseErrors.InvalidCount,
            description: error.message,
            status: 400
          }))
        )
      ),
      TE.apS(
        'authToken',
        pipe(
          fetchAuthToken({ authUrl }),
          TE.mapLeft<Error, ErrorResult>(error => ({
            name: GeneralErrors.AuthTokenError,
            description: error.message,
            status: 400
          }))
        )
      ),
      TE.flatMap(({ count, authToken }) =>
        pipe(
          fetchOrders({ url: orderUrl, authToken, count, date }),
          TE.mapLeft<Error, ErrorResult>(error => ({
            name: GeneralErrors.AuthTokenError,
            description: error.message,
            status: 400
          })),
          TE.flatMap(orders =>
            pipe(
              orders,
              A.map(order =>
                pipe(
                  fetchProducts({
                    ids: order.productIds.map(({ id }) => id),
                    url: productUrl,
                    authToken
                  }),
                  TE.map((products) => {
                    const { productIds, ...orderWithoutProductIds } = order
                    const ordersResult: OrderResult = {
                      ...orderWithoutProductIds,
                      products
                    }
                    return ordersResult
                  })
                )
              ),
              TE.sequenceArray,
              TE.mapLeft<Error, ErrorResult>(error => ({
                name: GeneralErrors.InternalServerError,
                description: error.message,
                status: 500
              }))
            )
          )
        )
      )
    )
    // const result: E.Either<ErrorResult, TE.TaskEither<ErrorResult, readonly OrderResult[]>>
    // const result: E.Either<ErrorResult, readonly OrderResult[]>
    const result = await ordersResultTE()
    return result
  }
  catch (error) {
    return {
      name: GeneralErrors.InternalServerError,
      description: error,
      status: 500
    }
  }
}
