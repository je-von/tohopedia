import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import UserSession from '../util/user-session'
import Card from '../components/Card'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useContext, useEffect, useState } from 'react'
import { convertToBase64 } from '../util/convert-base64'
import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { links } from '../util/route-links'
import ProductList from '../components/ProductList'
import { LimitContext } from '../util/context'
import PromoCarousel, { ImageType } from '../components/PromoCarousel'

let str = ''
let flag = false
const Home: NextPage = () => {
  // const [limit, setLimit] = useState(5)
  // const [currentScroll, setCurrentScroll] = useState({ x: 0, y: 0 })
  const router = useRouter()
  const faker = require('faker')
  // const { currentUser } = useContext(UserContext)
  const [productsLimit, setProductsLimit] = useState(5)

  // if (currentScroll.y != 0) {
  //   console.log('masuk')
  //   scrollTo(currentScroll.x, currentScroll.y)
  //   setCurrentScroll({ x: 0, y: 0 })
  // }
  // console.log(faker.commerce.productName())
  // console.log(faker.datatype.number({ min: 1000, max: 10000000 }))
  // console.log(faker.datatype.float({ min: 0, max: 0.7, precision: 0.15 }))
  // const u = UserSession.getCurrentUser()
  // console.log(u)
  // const [products, setProducts] = useState([])

  // const { setProductsLimit } = useContext(LimitContext)
  // const handleSubmit = () => {
  //   setProductsLimit(4)
  // }

  // const handleSubmit = () => {
  //   // let image = (document.getElementById('image') as HTMLInputElement).value
  //   // console.log(image)
  //   //   const image = e.target.files[0]
  //   // const base64 = await convertToBase64(faker.image.abstract())
  //   //   const base64 = await convertToBase64(image)

  //   // console.log(base64)

  //   for (let i = 0; i < 100; i++) {
  //     let shopID = ''
  //     if (i % 2 == 0) {
  //       shopID = 'ae7cb621-811f-4922-9188-59746dc67c33'
  //     } else {
  //       shopID = '0752607c-d3a4-4a59-b1dc-66df2ede17cd'
  //     }

  //     let categoryIDs = [
  //       '076daac9-3d6f-4f67-9445-8c39700ba5b4',
  //       '53ad5a1d-d296-4bb8-a69b-826a79f10468',
  //       '6b80f43b-5e8a-4152-930b-decd78144ce5',
  //       'bb767cba-0a45-4f5d-8f6b-8d1f3ce9a08',
  //       'cb388680-b1ca-43ed-a163-624c3603c0e8',
  //       'd716d4eb-c687-4ed7-9f32-09528fc84054',
  //       'e344d720-14d9-46af-b642-40711efb5964',
  //       'e514d2fd-5a03-4817-bca1-1f3a9a5ec3b5',
  //     ]
  //     // if (i < 10) {
  //     //   categoryID = 'e344d720-14d9-46af-b642-40711efb5964'
  //     // } else if (i < 20) {
  //     //   categoryID = 'bb767cba-0a45-4f5d-8f6b-8d1f3ce9a08'
  //     // } else {
  //     //   categoryID = '076daac9-3d6f-4f67-9445-8c39700ba5b4'
  //     // }

  //     createProduct({
  //       variables: {
  //         name: faker.commerce.productName(),
  //         description: faker.lorem.lines(20),
  //         price: faker.datatype.number({ min: 1000, max: 100000 }),
  //         discount: faker.datatype.float({ min: 0, max: 0.7, precision: 0.15 }),
  //         metadata: '',
  //         categoryID: categoryIDs[faker.datatype.number({ min: 0, max: 7 })],
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
  // const [createProduct, { data: d1, loading: l1, error: e1 }] = useMutation(mutation)

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

  const discountedProductsQuery = gql`
    query products {
      products(input: { isDiscount: true }) {
        # id
        name
        price
        discount
        # images {
        #   image
        # }
        shop {
          name
          nameSlug
        }
        originalProduct {
          id
          images {
            id
            image
          }
        }
        # updatedProducts {
        #   id
        #   name
        #   price
        #   discount
        # }
      }
    }
  `

  const { loading, error, data } = useQuery(discountedProductsQuery)

  const recommendationProductsQuery = gql`
    query recommendation {
      products(topSold: true) {
        name
        price
        discount
        shop {
          name
          nameSlug
        }
        originalProduct {
          id
          images {
            id
            image
          }
        }
        updatedProducts {
          id
          name
          price
          discount
        }
      }
    }
  `

  const { loading: l2, error: e2, data: d2 } = useQuery(recommendationProductsQuery)

  const categoryQuery = gql`
    query categories {
      categories(limit: 8) {
        id
        name
      }
    }
  `

  const { loading: l, error: e, data: d } = useQuery(categoryQuery)

  const [images, setImages] = useState<ImageType[]>()

  useEffect(() => {
    setImages([
      { id: 1, url: '/asset/promo/1.webp' },
      { id: 2, url: '/asset/promo/2.webp' },
      { id: 3, url: '/asset/promo/3.jpg' },
      { id: 4, url: '/asset/promo/4.jpg' },
    ])
  }, [])

  if (loading || l || l2) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }
  if (error) {
    console.log(error)
  }

  // if(data){

  // }

  if (!d) {
    // removeCookies('token')
    // router.reload()
  } else {
    // console.log(d.categories)
    // let str = ''
    // for (let c of d.categories) {
    //   console.log(c.id)
    //   str += `"${c.id}",`
    // }
    // console.log(str)
  }

  // window.onscroll = function (ev) {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     ev.preventDefault()
  //     setCurrentScroll({ x: scrollX, y: scrollY })
  //     setLimit(limit + 10)
  //     // scrollTo(scrollX, scrollY)
  //   }
  // }
  // console.log('limit: ' + productsLimit)

  return (
    <LimitContext.Provider value={{ productsLimit, setProductsLimit }}>
      <Layout>
        <main>
          <div className="home">
            <PromoCarousel images={images}></PromoCarousel>
            <h2 className="section-title">Top Discounted Items</h2>
            <div className="card-container discount">
              {data
                ? data.products.map((p: any) => (
                    <Card
                      key={p.originalProduct.id}
                      image={p.originalProduct.images.length > 0 ? p.originalProduct.images[0].image : '/asset/no-image.png'}
                      productID={p.originalProduct.id}
                      priceTag={
                        <div className="product-price">
                          <p className="product-discount">
                            {/* {Math.round(p.updatedProducts.length > 0 ? p.updatedProducts[0].discount : p.discount * 100)}% */}
                            {Math.round(p.discount * 100)}%
                          </p>
                          {/* <s className="original-price">Rp.{p.updatedProducts.length > 0 ? p.updatedProducts[0].price : p.price}</s> */}
                          <s className="original-price">Rp.{p.price}</s>

                          {/* {p.updatedProducts.length > 0 ? (
                        <b>Rp.{Math.round(p.updatedProducts[0].price * (1 - p.updatedProducts[0].discount))}</b>
                      ) : ( */}
                          <b>Rp.{Math.round(p.price * (1 - p.discount))}</b>
                          {/* )} */}
                        </div>
                      }
                      // name={p.updatedProducts.length > 0 ? p.updatedProducts[0].name : p.name}
                      name={p.name}
                      shop={p.shop.name}
                      shopNameSlug={p.shop.nameSlug}
                    ></Card>
                  ))
                : ''}
            </div>
            <h2 className="section-title">Top Product Recommendations</h2>
            <div className="card-container discount">
              {d2
                ? d2.products.map((p: any) => (
                    <Card
                      key={p.originalProduct.id}
                      image={p.originalProduct.images.length > 0 ? p.originalProduct.images[0].image : '/asset/no-image.png'}
                      productID={p.originalProduct.id}
                      priceTag={
                        <div className="product-price">
                          <b>Rp.{p.updatedProducts.length > 0 ? p.updatedProducts[0].price : p.price}</b>
                        </div>
                      }
                      // name={p.updatedProducts.length > 0 ? p.updatedProducts[0].name : p.name}
                      name={p.updatedProducts.length > 0 ? p.updatedProducts[0].name : p.name}
                      shop={p.shop.name}
                      shopNameSlug={p.shop.nameSlug}
                    ></Card>
                  ))
                : ''}
            </div>
            <h2 className="section-title">Categories</h2>
            <div className="card-container category">
              {d.categories.map((c: any) => (
                <Link key={c.id} href={links.search('?category=' + c.id)} passHref>
                  <div className="card">
                    <div className="card-content">
                      <b>{c.name}</b>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="section-title">Products</h2>
            <ProductList
              query={gql`
                query products($limit: Int) {
                  products(limit: $limit) {
                    id
                    name
                    price
                    images {
                      image
                    }
                    shop {
                      name
                      nameSlug
                    }
                  }
                }
              `}
              variables={{ limit: productsLimit }}
            ></ProductList>
            {/* <div className="card-container"> */}
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

            {/* {data.products.map((p: any) => (
              <Card
                key={p.id}
                image={p.images.length > 0 ? p.images[0].image : '/asset/no-image.png'}
                productID={p.id}
                priceTag={<b>Rp.{p.price}</b>}
                name={p.name}
                shop={p.shop.name}
                shopNameSlug={p.shop.nameSlug}
              ></Card>
            ))} */}
            {/* <Card image="/asset/test.jpg" productID="1" price={1000000} name="halo halo" shop="JVShop" /> */}
          </div>
          {/* </div> */}
        </main>
      </Layout>
    </LimitContext.Provider>
  )
}

export default Home
