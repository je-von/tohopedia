import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import UserSession from '../util/user-session'

const Home: NextPage = () => {
  let u = UserSession.getCurrentUser()

  // const handleSubmit = async (e: any) => {
  //   // let image = (document.getElementById('image') as HTMLInputElement).value
  //   // console.log(image)
  //   const image = e.target.files[0]
  //   const base64 = await convertToBase64(image)

  //   console.log(base64)
  // }

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="#">tohopedia</a>, {u ? u.name : 'Guest'} !
          </h1>
          {/* <input type="file" name="image" id="image" onChange={handleSubmit} />
          <button type="submit">tes</button> */}
          {/* <Image src={u ? u.profilePic : '/asset/logo.png'} alt="img" width={100} height={100}></Image> */}
        </main>
      </div>
    </Layout>
  )
}

export default Home
