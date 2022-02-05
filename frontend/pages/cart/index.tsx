import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../../components/layout/Layout'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ListCard from '../../components/ListCard'

const Cart: NextPage = () => {
  const router = useRouter()

  const query = gql`
    query carts {
      carts {
        product {
          id
          name
          images {
            image
          }
          price
          discount
          shop {
            name
            nameSlug
          }
        }
        quantity
        notes
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

  if (!data || !data.carts) {
    removeCookies('token')
    router.reload()
  } else {
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container">
            <h2>Cart</h2>
            {data.carts.map((c: any) => (
              <ListCard
                key={c.product.id}
                productID={c.product.id}
                image={c.product.images.length > 0 ? c.product.images[0].image : '/asset/no-image.png'}
                name={c.product.name}
                price={c.product.price}
                discount={c.product.discount}
                shop={c.product.shop.name}
                shopNameSlug={c.product.shop.nameSlug}
                quantity={c.quantity}
                notes={c.notes}
              ></ListCard>
            ))}
          </div>
          <div className="action-container">
            <div className="product-button">
              <h4>Shopping Summary</h4>
              <div></div>
              <button className="text-button">Buy</button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Cart
