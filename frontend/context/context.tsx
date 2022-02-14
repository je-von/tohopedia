import { createContext } from 'react'

export const LimitContext = createContext({
  productsLimit: 5,
  setProductsLimit: (lim: number) => {},
})

// export const UserContext = createContext({
//   currentUser: null,
//   setCurrentUser: (u: any) => {},
// })
