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
import { convertToBase64 } from '../../util/convert-base64'
import UserSession from '../../util/user-session'
import { convertPointsToBadge } from '../../util/shop-badge'
import Card from '../../components/Card'
import { links } from '../../util/route-links'

const ShopDetail: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query

  // const [pageLinks, setPageLinks] = useState([])
  // const [totalPage, setTotalPage] = useState(0)
  const [shopID, setShopID] = useState('')
  const limit = 10
  // console.log(page)
  const [offset, setOffset] = useState(0)
  // console.log(offset)

  // console.log('page:' + parseInt(page as string))
  // if (offset == -1 && !isNaN(parseInt(page as string))) {
  //   let pageNumber = parseInt(page as string) > 0 ? parseInt(page as string) - 1 : 0
  //   setOffset(pageNumber * limit)
  //   console.log(offset)
  // }

  const query = gql`
    query getShopBySlug($nameSlug: String!) {
      shopBySlug(nameSlug: $nameSlug) {
        id
        name
        profilePic
        reputationPoints
        slogan
        description
        products {
          id
          price
          name
          images {
            image
          }
        }
        bestSelling: products(topSold: true) {
          price
          name
          originalProduct {
            id
            metadata
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
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { nameSlug: slug } })

  const paginateQuery = gql`
    query paginateProducts($shopID: ID!, $limit: Int!, $offset: Int!) {
      products(shopID: $shopID, limit: $limit, offset: $offset) {
        # id
        price
        name
        # images {
        #   image
        # }
        originalProduct {
          id
          metadata
          images {
            id
            image
          }
        }
      }
    }
  `

  const { loading: l, data: d, error: e } = useQuery(paginateQuery, { variables: { shopID: shopID, limit: limit, offset: offset } })

  if (loading || l) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error.message}</>
  }

  let shop: any = null
  let pages: any = []
  if (data && data.shopBySlug) {
    shop = data.shopBySlug
    let totalPage = Math.ceil(shop.products.length / limit)
    pages = Array.from(Array(totalPage), (_, i) => i + 1)
    if (!shopID) {
      setShopID(shop.id)
      // setPageLinks(temp)
    }
    // console.log(totalPage, pages)
  }

  if (d && d.products) {
    console.log(d.products)
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="shop-container">
          <div className="shop-image">
            <Image src={shop.profilePic} alt="" layout="fill" objectFit="cover"></Image>
          </div>
          <div className="shop-detail">
            <div className="shop-name">
              <h2>{shop.name}</h2>
              <div className="shop-badge">
                <Image src={`/asset/badge/${convertPointsToBadge(shop.reputationPoints)}.png`} alt="" layout="fill" objectFit="contain"></Image>
              </div>
            </div>
            <p className="shop-slogan">
              <i>{shop.slogan}</i>
            </p>
            <p className="shop-desc">{shop.description}</p>
          </div>
        </div>
        <h2 className="section-title">Best Selling Products</h2>
        <div className="card-container discount">
          {shop.bestSelling.map((p: any) => (
            <Card
              key={p.originalProduct.id}
              image={p.originalProduct.images.length > 0 ? p.originalProduct.images[0].image : '/asset/no-image.png'}
              productID={p.originalProduct.id}
              priceTag={<b>Rp.{p.updatedProducts.length > 0 ? p.updatedProducts[0].price : p.price}</b>}
              // name={p.updatedProducts.length > 0 ? p.updatedProducts[0].name : p.name}
              name={p.updatedProducts.length > 0 ? p.updatedProducts[0].name : p.name}
              shop={shop.name}
              shopNameSlug={slug as string}
            ></Card>
          ))}
        </div>
        <h2 className="section-title">All Products</h2>

        <div className="card-container">
          {d.products.map((p: any) => (
            <Card
              key={p.originalProduct.id}
              image={p.originalProduct.images.length > 0 ? p.originalProduct.images[0].image : '/asset/no-image.png'}
              productID={p.originalProduct.id}
              priceTag={<b>Rp.{p.price}</b>}
              name={p.name}
              shop={shop.name}
              shopNameSlug={slug as string}
            ></Card>
          ))}
        </div>
        <div className="page-links">
          Page
          {pages.map((i: any) => (
            <div
              className={offset / limit + 1 == i ? 'current' : ''}
              onClick={() => {
                setOffset((i - 1) * limit)
              }}
              key={i}
            >
              <div>{i}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ShopDetail
