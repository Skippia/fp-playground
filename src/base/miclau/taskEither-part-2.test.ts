import axios from 'axios'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { getAllResults } from './3-TaskEither-2'

const notOnRight = (result: unknown) => {
  expect(result).toStrictEqual('Should be E.left')
}
const notOnLeft = (result: unknown) => {
  expect(result).toStrictEqual('Should be E.right')
}

afterEach(() => {
  jest.restoreAllMocks()
})

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('test taskEither Do notation', () => {
  // Mock data
  const userDataMock = {
    data: {
      id: 'idMock',
    },
  }

  const tokenDataMock = {
    data: {
      token: 'tokenMock',
    },
  }

  const ordersDataMock = {
    data: {
      orders: [{ id: '飓', name: 'demo' }],
    },
  }
  const userNotFoundErrorMock = 'user not found'
  const tokenNotFoundErrorMock = 'token not found'
  const ordersNotFoundErrorMock = 'orders not found'

  describe('Case 1: All fetch are successful', () => {
    it('should return the final result with user, token, orders data', async () => {
      mockedAxios.get.mockResolvedValueOnce(userDataMock)
      mockedAxios.get.mockResolvedValueOnce(tokenDataMock)
      mockedAxios.get.mockResolvedValueOnce(ordersDataMock)
      const resultE = await getAllResults()()
      const expectedOutput = {
        userResult: userDataMock,
        tokenResult: tokenDataMock,
        ordersResult: ordersDataMock,
      }
      const onRight = (result: unknown) => {
        console.log('Case 1 result: ', result)
        expect(result).toStrictEqual(expectedOutput)
      }
      expect(mockedAxios.get).toBeCalledTimes(3)
      pipe(resultE, E.match(notOnLeft, onRight))
    })
  })
  describe('Case 2: Fetch user failed', () => {
    it('should return error message user not found', async () => {
      mockedAxios.get.mockRejectedValueOnce(userNotFoundErrorMock)
      mockedAxios.get.mockRejectedValueOnce(tokenNotFoundErrorMock)
      mockedAxios.get.mockRejectedValueOnce(ordersNotFoundErrorMock)
      const resultE = await getAllResults()()
      const expectedOutput = new Error(userNotFoundErrorMock)
      const onLeft = (error: unknown) => {
        console.log('Case 2 error: ', error)
        expect(error).toStrictEqual(expectedOutput)
      }
      expect(mockedAxios.get).toBeCalledTimes(1)
      pipe(resultE, E.match(onLeft, notOnRight))
    })
  })
  describe('Case 3: Fetch user successful but fetch token failed ', () => {
    it('should return error message token not found', async () => {
      mockedAxios.get.mockResolvedValueOnce(userDataMock)
      mockedAxios.get.mockRejectedValueOnce(tokenNotFoundErrorMock)
      mockedAxios.get.mockRejectedValueOnce(ordersNotFoundErrorMock)
      const resultE = await getAllResults()()
      const expectedOutput = new Error(tokenNotFoundErrorMock)
      const onLeft = (error: unknown) => {
        console.log('Case 3 error: ', error)
        expect(error).toStrictEqual(expectedOutput)
      }
      expect(mockedAxios.get).toBeCalledTimes(2)
      pipe(resultE, E.match(onLeft, notOnRight))
    })
  })
  describe('Case 4: Fetch user and token successful but fetch orders failed ', () => {
    it('should return error message orders not found', async () => {
      const errorMock = 'orders not found'
      mockedAxios.get.mockResolvedValueOnce(userDataMock)
      mockedAxios.get.mockResolvedValueOnce(tokenDataMock)
      mockedAxios.get.mockRejectedValueOnce(ordersNotFoundErrorMock)
      const resultE = await getAllResults()()
      const expectedOutput = new Error(errorMock)
      const onLeft = (error: unknown) => {
        console.log('Case 4 error: ', error)
        expect(error).toStrictEqual(expectedOutput)
      }
      expect(mockedAxios.get).toBeCalledTimes(3)
      pipe(resultE, E.match(onLeft, notOnRight))
    })
  })
})
