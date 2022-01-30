import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { getCookie } from 'cookies-next'

const token = getCookie('token')

const client = new ApolloClient({
  uri: 'http://localhost:8080/query',
  cache: new InMemoryCache(),
  headers: token
    ? {
        Authorization: 'bearer ' + token,
      }
    : {},
  // link: new HttpLink({
  //   uri: 'http://localhost:8080/query',
  //   fetchOptions: {
  //     mode: 'no-cors',
  //   },
  // }),
})

export default client
