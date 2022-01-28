import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="#">tohopedia!</a>
          </h1>
        </main>
      </div>
    </Layout>
  )
}

export default Home
