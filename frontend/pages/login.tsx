import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { redirect } from 'next/dist/server/api-utils'
import { url } from 'inspector'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
  const router = useRouter()
  const [credential, setCredential] = useState([''])
  const [errorMsg, setErrorMsg] = useState('')
  const loginUser = () => {
    let email = (document.getElementById('email') as HTMLInputElement).value
    let password = (document.getElementById('password') as HTMLInputElement).value
    // console.log(email, password)

    if (!email || !password) {
      setErrorMsg('All fields must be filled!')
    } else {
      setCredential([email, password])
    }
  }

  const query = gql`
    query auth($email: String!, $password: String!) {
      user(email: $email, password: $password) {
        id
        name
        gender
        email
      }
    }
  `
  const { loading, error, data } = useQuery(query, {
    variables: {
      email: credential[0],
      password: credential[1],
    },
  })

  if (loading || credential.length <= 1) {
    //loading
    // console.log('loading')
  } else {
    if (!data || !data.user) {
      // alert('Invalid email or password!')
      if (errorMsg != 'Invalid Email or Password!') setErrorMsg('Invalid Email or Password!')
    } else {
      const user = data.user
      console.log(user)

      // alert('Welcome, ' + user.name + ' !')
      router.push('/')
    }
  }
  return (
    <Layout>
      <main className={styles.container}>
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Login</h3>
              <Link href="/register">Sign Up</Link>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" placeholder="example@mail.com" required />
            </div>

            <div className="form-input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Password" required />
            </div>

            <div className="container-header">
              <div>
                <input type="checkbox" name="remember_me" id="remember_me" /> Remember me
              </div>
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" onClick={loginUser}>
              Login
            </button>
            <p className="error">{errorMsg}</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Login
