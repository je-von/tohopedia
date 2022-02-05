import { gql, useQuery } from '@apollo/client'
import { getCookie } from 'cookies-next'
import client from './apollo-client'
var UserSession = (function () {
  let u: any

  var getCurrentUser = function () {
    return u
  }

  var setCurrentUser = function (user: any) {
    u = user
    // console.log(u)
  }

  return {
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
  }
})()

export default UserSession
