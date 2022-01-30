import Head from 'next/head'
import React, { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface Prop {
  children: ReactNode
}

const Layout = ({ children }: Prop) => {
  return (
    <>
      <Head>
        <title>tohopedia by JV</title>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Layout
