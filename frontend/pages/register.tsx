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

const Register: NextPage = () => {
  const router = useRouter()

  const [errorMsg, setErrorMsg] = useState('')
  const loginUser = () => {
    let email = (document.getElementById('email') as HTMLInputElement).value
    if (!email) {
      setErrorMsg('Email must be filled!')
    } else {
    }
  }

  return (
    <Layout>
      <main className={styles.container}>
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Sign Up Now</h3>
              <Link href="/login">Log in</Link>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" placeholder="example@mail.com" required />
            </div>

            <button type="submit" onClick={loginUser}>
              Sign Up
            </button>
            <p className="error">{errorMsg}</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Register
