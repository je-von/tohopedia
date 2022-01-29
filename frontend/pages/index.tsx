import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import UserSession from '../util/user-session'
import Card from '../components/Card'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
// import { convertToBase64 } from '../util/convert-base64'
const Home: NextPage = () => {
  let u = UserSession.getCurrentUser()

  const [products, setProducts] = useState([])

  // const handleSubmit = async (e: any) => {
  //   // let image = (document.getElementById('image') as HTMLInputElement).value
  //   // console.log(image)
  //   const image = e.target.files[0]
  //   const base64 = await convertToBase64(image)

  //   console.log(base64)
  // }

  const query = gql`
    query products {
      products {
        id
        name
        price
        images {
          image
        }
        shop {
          name
        }
      }
    }
  `

  const { loading, error, data } = useQuery(query)

  if (loading) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  if (!data || !data.products) {
    return (
      <Layout>
        <main>Error!</main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        <div className="card-container">
          {/* <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="#">tohopedia</a>, {u ? u.name : 'Guest'} !
          </h1> */}
          {/* <input type="file" name="image" id="image" onChange={handleSubmit} /> */}
          {/* <button type="submit">tes</button> */}
          {/* <Image src={u ? u.profilePic : '/asset/logo.png'} alt="img" width={100} height={100}></Image> */}

          {/* </main> */}

          {/* <div className="card">
            <Image src="/asset/no-image.png" alt="product image" width={100} height={100}></Image>
          </div> */}

          {data.products.map((p: any) => (
            <Card key={p.id} image={p.images[0].image} productID={p.id} price={p.price} name={p.name} shop={p.shop.name}></Card>
          ))}
          {/* <Card image="/asset/test.jpg" productID="1" price={1000000} name="halo halo" shop="JVShop" /> */}
        </div>
      </main>
    </Layout>
  )
}

export default Home
