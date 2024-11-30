/* eslint-disable ts/no-floating-promises */

// ℹ️ traditional single fetch
export const fetchUsers = () =>
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.error(err))

// ℹ️ traditional chained network request
/**
 * @Explanation flow
 * 1. fetch all users
 * 2. fetch first user among all by gotten id
 * 3. fetch posts related to the first user
 */
export const sequentialRequestChain = () =>
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response1 => response1.json())
    .then((users) => {
      console.log('fetched all users', users)
      fetch(`https://jsonplaceholder.typicode.com/users/${users[0].id}`)
        .then(response2 => response2.json())
        .then((singleUser) => {
          console.log('fetched single user', singleUser)
          fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${users[0].id}`
          )
            .then(response3 => response3.json())
            .then(postsByUserId =>
              console.log('fetched post related to user', postsByUserId)
            )
        })
    })
    .catch(err => console.error(err))

// ℹ️ traditional async network request
/**
 * @Explanation flow
 * Same flow as previous
 */
export const sequentialRequestAsync = async () => {
  let allUsersInfo

  try {
    const users = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    ).then(response1 => response1.json())

    allUsersInfo = users
    console.log('fetched all users', users)
  }
  catch (error) {
    console.log('failed to fetch users')
  }

  if (allUsersInfo && allUsersInfo[0].id < 2) {
    try {
      const singleUser = await fetch(
        `https://jsonplaceholder.typicode.com/users/${allUsersInfo[0].id}`
      ).then(response2 => response2.json())
      console.log('fetched single user', singleUser)
    }
    catch (error) {
      console.log('failed to fetch single user')
    }

    try {
      const postByUserId = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${
          allUsersInfo[0].id
        }`
      ).then(response3 => response3.json())
      console.log('fetched post related to user', postByUserId)
    }
    catch (error) {
      console.log('failed to fetch users post')
    }
  }
}
