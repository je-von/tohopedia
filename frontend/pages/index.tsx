import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import UserSession from '../util/user-session'
import Card from '../components/Card'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { convertToBase64 } from '../util/convert-base64'
import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'

let str = ''
let flag = false
const Home: NextPage = () => {
  const router = useRouter()
  const faker = require('faker')
  // console.log(faker.commerce.productName())
  // console.log(faker.datatype.number({ min: 1000, max: 10000000 }))
  // console.log(faker.datatype.float({ min: 0, max: 0.7, precision: 0.15 }))
  // const u = UserSession.getCurrentUser()
  // console.log(u)
  // const [products, setProducts] = useState([])

  // const handleSubmit = () => {
  //   // let image = (document.getElementById('image') as HTMLInputElement).value
  //   // console.log(image)
  //   //   const image = e.target.files[0]
  //   // const base64 = await convertToBase64(faker.image.abstract())
  //   //   const base64 = await convertToBase64(image)

  //   // console.log(base64)

  //   for (let i = 0; i < 30; i++) {
  //     let shopID = ''
  //     if (i % 2 == 0) {
  //       shopID = 'ae7cb621-811f-4922-9188-59746dc67c33'
  //     } else {
  //       shopID = '0752607c-d3a4-4a59-b1dc-66df2ede17cd'
  //     }

  //     let categoryID = ''
  //     if (i < 10) {
  //       categoryID = 'e344d720-14d9-46af-b642-40711efb5964'
  //     } else if (i < 20) {
  //       categoryID = 'bb767cba-0a45-4f5d-8f6b-8d1f3ce9a08'
  //     } else {
  //       categoryID = '076daac9-3d6f-4f67-9445-8c39700ba5b4'
  //     }

  //     createProduct({
  //       variables: {
  //         name: faker.commerce.productName(),
  //         description: faker.lorem.lines(10),
  //         price: faker.datatype.number({ min: 1000, max: 10000000 }),
  //         discount: faker.datatype.float({ min: 0, max: 0.7, precision: 0.15 }),
  //         metadata: '',
  //         categoryID: categoryID,
  //         shopID: shopID,
  //         stock: faker.datatype.number({ min: 1, max: 150 }),
  //       },
  //     })

  //     flag = false
  //   }
  // }

  // const [createImg, { data: d2, loading: l2, error: e2 }] = useMutation(gql`
  //   mutation InsertImage($image: String!, $productID: ID!) {
  //     createProductImage(image: $image, productID: $productID) {
  //       id
  //     }
  //   }
  // `)

  // const mutation = gql`
  //   mutation CreateProduct(
  //     $name: String!
  //     $description: String!
  //     $price: Int!
  //     $discount: Float!
  //     $metadata: String!
  //     $categoryID: ID!
  //     $shopID: ID!
  //     $stock: Int!
  //   ) {
  //     createProduct(
  //       input: {
  //         name: $name
  //         description: $description
  //         price: $price
  //         discount: $discount
  //         metadata: $metadata
  //         categoryID: $categoryID
  //         stock: $stock
  //       }
  //       shopID: $shopID
  //     ) {
  //       id
  //     }
  //   }
  // `
  // const [createProduct, { data: d, loading: l, error: e }] = useMutation(mutation)

  // if (!flag && !l && d && d.createProduct) {
  //   str += d.createProduct.id + ','
  //   flag = true
  //   console.log(str)
  // }
  // console.log(d.createProduct.id)

  // const { loading: l, error: e, data: d } = useQuery(UserSession.getQuery())
  // if (d) {
  //   console.log(d)
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
    removeCookies('token')
    router.reload()
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
          {/* <button type="submit" onClick={handleSubmit}>
            tes
          </button> */}
          {/* <Image src={u ? u.profilePic : '/asset/logo.png'} alt="img" width={100} height={100}></Image> */}

          {/* </main> */}

          {/* <div className="card">
            <Image src="/asset/no-image.png" alt="product image" width={100} height={100}></Image>
          </div> */}

          {data.products.map((p: any) => (
            <Card
              key={p.id}
              image={p.images.length > 0 ? p.images[0].image : '/asset/no-image.png'}
              productID={p.id}
              price={p.price}
              name={p.name}
              shop={p.shop.name}
            ></Card>
          ))}
          {/* <Card image="/asset/test.jpg" productID="1" price={1000000} name="halo halo" shop="JVShop" /> */}
        </div>
      </main>
    </Layout>
  )
}

export default Home
