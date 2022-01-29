var UserSession = (function () {
  let u: any

  var getCurrentUser = function () {
    return u
  }

  var setCurrentUser = function (user: any) {
    u = user
  }

  return {
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
  }
})()

export default UserSession
