import Head from 'next/head'
import React, { ReactNode, useContext } from 'react'
// import { UserContext } from '../../context/context'
import Footer from './Footer'
import Header from './Header'

interface Prop {
  children: ReactNode
}

const Layout = ({ children }: Prop) => {
  // const { currentUser, setCurrentUser } = useContext(UserContext)

  return (
    // <UserContext.Provider value={{ currentUser, setCurrentUser }}>
    // <b>{currentUser}</b>
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
    // </UserContext.Provider>
  )
}

export default Layout
