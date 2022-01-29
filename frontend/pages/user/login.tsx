import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/Home.module.css'
import Layout from '../../components/layout/Layout'
import Link from 'next/link'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { redirect } from 'next/dist/server/api-utils'
import { url } from 'inspector'
import { useRouter } from 'next/router'
import UserSession from '../../util/user-session'

const Login: NextPage = () => {
  const router = useRouter()
  const [credential, setCredential] = useState([''])
  const [errorMsg, setErrorMsg] = useState('')
  const loginUser = async () => {
    let email = (document.getElementById('email') as HTMLInputElement).value
    let password = (document.getElementById('password') as HTMLInputElement).value
    // console.log(email, password)

    if (!email || !password) {
      setErrorMsg('All fields must be filled!')
    } else {
      try {
        await auth({ variables: { email: email, password: password } })
      } catch (e) {
        setErrorMsg('Error')
      }
    }
  }

  const mutation = gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        id
        name
        email
        #password
        dob
        phone
        gender
        role
        profilePic
        isSuspended
      }
    }
  `
  const [auth, { data, loading, error }] = useMutation(mutation)

  if (error) {
    console.log(error)
    if (errorMsg != 'Invalid Email or Password!') setErrorMsg('Invalid Email or Password!')
  }

  if (data && data.login) {
    // console.log(data)
    const user = data.login
    console.log(user)
    UserSession.setCurrentUser(user)
    // alert('Welcome, ' + user.name + ' !')
    router.push('/')
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Login</h3>
              <Link href="/user/register">Sign Up</Link>
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
      </div>
    </Layout>
  )
}

export default Login
