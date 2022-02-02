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
  const { slug, page } = router.query

  const [pageLinks, setPageLinks] = useState([])
  // const [totalPage, setTotalPage] = useState(0)
  const [shopID, setShopID] = useState('')
  const limit = 10
  // console.log(page)
  const [offset, setOffset] = useState(-1)
  // console.log(offset)

  // console.log('page:' + parseInt(page as string))
  if (offset == -1 && !isNaN(parseInt(page as string))) {
    let pageNumber = parseInt(page as string) > 0 ? parseInt(page as string) - 1 : 0
    setOffset(pageNumber * limit)
    console.log(offset)
  }

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
      }
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { nameSlug: slug } })

  const paginateQuery = gql`
    query paginateProducts($shopID: ID!, $limit: Int!, $offset: Int!) {
      products(shopID: $shopID, limit: $limit, offset: $offset) {
        id
        price
        name
        images {
          image
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
  if (data && data.shopBySlug) {
    shop = data.shopBySlug
    if (!shopID) {
      setShopID(shop.id)
      let totalPage = Math.ceil(shop.products.length / limit)
      let temp: any = []
      for (let i = 1; i <= totalPage; i++) {
        temp.push(
          <a href={links.shopDetail(slug as string) + '?page=' + i} key={i}>
            <div>{i}</div>
          </a>
        )
        console.log('masuk')
      }
      setPageLinks(temp)
      console.log(totalPage, temp)
    }
  }

  if (d) {
    console.log(d)
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
        <div className="card-container">
          {d.products.map((p: any) => (
            <Card
              key={p.id}
              image={p.images.length > 0 ? p.images[0].image : '/asset/no-image.png'}
              productID={p.id}
              price={p.price}
              name={p.name}
              shop={shop.name}
            ></Card>
          ))}
        </div>
        <div className="page-links">Page {pageLinks}</div>
      </div>
    </Layout>
  )
}

export default ShopDetail
