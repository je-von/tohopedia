import { gql, useQuery } from '@apollo/client'
import { getCookie } from 'cookies-next'
import client from './apollo-client'
var UserSession = (function () {
  let u: any

  var getCurrentUser = async function () {
    let data = null
    await client
      .query({
        query: gql`
          query tes {
            getCurrentUser {
              id
              name
              email
            }
          }
        `,
      })
      .then((d) => {
        // console.log(d)
        data = d.data.getCurrentUser
        // console.log(data)
      })
    return data
  }

  return {
    getCurrentUser: getCurrentUser,
  }
})()

export default UserSession
