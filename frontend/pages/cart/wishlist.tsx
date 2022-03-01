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

const Wishlist: NextPage = () => {
  const router = useRouter()

  const query = gql`
    query wishlists {
      wishlists {
        product {
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
          shop {
            nameSlug
            name
          }
        }
        user {
          name
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error.message}</>
  }

  let wishlists: any = null
  if (data && data.wishlists) {
    wishlists = data.wishlists
  }

  return (
    <Layout>
      <div className="main-container">
        <h2>Wishlist</h2>
        <div className="card-container">
          {wishlists.map((w: any) => (
            <Card
              key={w.product.originalProduct.id}
              image={w.product.originalProduct.images.length > 0 ? w.product.originalProduct.images[0].image : '/asset/no-image.png'}
              productID={w.product.originalProduct.id}
              priceTag={<b>Rp.{w.product.price}</b>}
              name={w.product.name}
              shop={w.product.shop.name}
              shopNameSlug={w.product.shop.nameSlug as string}
            ></Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Wishlist
