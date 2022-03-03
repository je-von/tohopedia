import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getCookie, removeCookies, setCookies } from 'cookies-next'
import Router from 'next/router'

const token = getCookie('token')

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/query',
  headers: token
    ? {
        Authorization: 'bearer ' + token,
      }
    : {},
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, name }) => console.log(`[GraphQL error]: ${name}`))
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError.name}`)
    if (networkError.name == 'ServerParseError') {
      removeCookies('token')
      operation.setContext({
        headers: {},
      })
      return forward(operation)
    }
    if (networkError.name == 'TypeError') {
      if (!getCookie('alert')) {
        setCookies('alert', 'alert')
        alert('Backend is down\n' + 'Network Error: ' + networkError.message)
        Router.reload()
      } else {
        removeCookies('alert')
      }
    }
  }
})

const client = new ApolloClient({
  // uri: 'http://localhost:8080/query',
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),

  // link: new HttpLink({
  //   uri: 'http://localhost:8080/query',
  //   fetchOptions: {
  //     mode: 'no-cors',
  //   },
  // }),
})

export default client
