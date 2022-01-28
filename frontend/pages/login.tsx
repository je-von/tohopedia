import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import Link from 'next/link'

const Home: NextPage = () => {
  const loginUser = () => {
    let email = (document.getElementById('email') as HTMLInputElement).value
    let password = (document.getElementById('password') as HTMLInputElement).value
    // console.log(email, password)
  }

  return (
    <Layout>
      <main className={styles.container}>
        <div className="form-container">
          <form method="post" onSubmit={loginUser}>
            <div className="container-header">
              <h3>Login</h3>
              <Link href="/register">Sign Up</Link>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" placeholder="example@mail.com" />
            </div>

            <div className="form-input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Password" />
            </div>

            <div className="container-header">
              <div>
                <input type="checkbox" name="remember_me" id="remember_me" /> Remember me
              </div>
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    </Layout>
  )
}

export default Home
