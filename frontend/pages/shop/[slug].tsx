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

const ShopDetail: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query

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

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error.message}</>
  }

  let shop: any = null
  if (data && data.shopBySlug) {
    shop = data.shopBySlug
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
          {shop.products.map((p: any) => (
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
      </div>
    </Layout>
  )
}

export default ShopDetail
