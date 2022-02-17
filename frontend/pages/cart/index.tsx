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

  let totalPrice = 0,
    totalDiscount = 0
  if (!data || !data.carts) {
    // removeCookies('token')
    // router.reload()
  } else {
    // let prices = data.carts.map((c: any) => Math.round(c.product.price * (1 - c.product.discount)))
    // console.log(prices.reduce((a: any, b: any) => a + b, 0))

    totalPrice = data.carts.map((c: any) => c.product.price * c.quantity).reduce((a: any, b: any) => a + b, 0)
    totalDiscount = data.carts
      .map((c: any) => Math.round(c.product.discount.toFixed(2) * c.product.price) * c.quantity)
      .reduce((a: any, b: any) => a + b, 0)

    console.log(totalPrice, totalDiscount)
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
              <div className="multi-input subtotal">
                <p className="multi-input-item">Total Price</p>
                <b className="multi-input-item">Rp{totalPrice}</b>
              </div>
              <div className="multi-input subtotal">
                <p className="multi-input-item">Total Discount</p>
                <b className="multi-input-item">-Rp{totalDiscount}</b>
              </div>
              <hr />
              <div className="multi-input subtotal">
                <p className="multi-input-item">Grand Total</p>
                <b className="multi-input-item">Rp{totalPrice - totalDiscount}</b>
              </div>

              <button className="text-button">Buy</button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Cart
