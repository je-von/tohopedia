import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../../components/layout/Layout'

import { gql, useMutation, useQuery } from '@apollo/client'
import { ReactElement, useState } from 'react'

import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ListCard from '../../components/ListCard'
import { links } from '../../util/route-links'
import AddressModal from '../../components/AddressModal'

const Checkout: NextPage = () => {
  const router = useRouter()
  const [modal, setModal] = useState<ReactElement>()

  const userQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        name
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
        addresses {
          id
          name
          detail
          isPrimary
        }
      }
    }
  `

  const { loading, error, data } = useQuery(userQuery)

  const paymentQuery = gql`
    query payments {
      paymentTypes {
        id
        name
      }
    }
  `

  const { loading: l2, error: e2, data: d2 } = useQuery(paymentQuery)

  const shippingQuery = gql`
    query shippings {
      shippings {
        id
        name
        price
      }
    }
  `

  const { loading: l, error: e, data: d } = useQuery(shippingQuery)

  if (loading || l || l2) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  let totalPrice = 0,
    totalDiscount = 0
  if (!data || !data.getCurrentUser || !data.getCurrentUser.carts) {
    router.push(links.home)
    // removeCookies('token')
    // router.reload()
  } else {
    // let prices = data.carts.map((c: any) => Math.round(c.product.price * (1 - c.product.discount)))
    // console.log(prices.reduce((a: any, b: any) => a + b, 0))

    totalPrice = data.getCurrentUser.carts.map((c: any) => c.product.price * c.quantity).reduce((a: any, b: any) => a + b, 0)
    totalDiscount = data.getCurrentUser.carts
      .map((c: any) => Math.round(c.product.discount.toFixed(2) * c.product.price) * c.quantity)
      .reduce((a: any, b: any) => a + b, 0)

    console.log(totalPrice, totalDiscount)

    // console.log(data.getCurrentUser)
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container">
            <h2>Checkout</h2>
            <div>
              <div className="multi-input">
                <h4>Shipping Address</h4>
                <button
                  className="text-button"
                  onClick={() => {
                    setModal(<AddressModal></AddressModal>)
                  }}
                >
                  Change Address
                </button>
              </div>
              {data.getCurrentUser.addresses ? (
                <div className="address-list">
                  <div className="address-content">
                    <p className="address-header">
                      <b className="user-name">{data.getCurrentUser.name} </b> ({data.getCurrentUser.addresses[0].name})
                      {data.getCurrentUser.addresses[0].isPrimary ? <b className="primary-tag">Primary</b> : ''}
                    </p>
                    <p className="address-detail">{data.getCurrentUser.addresses[0].detail}</p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            {data.getCurrentUser.carts.map((c: any) => (
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
                isCheckout={true}
              ></ListCard>
            ))}
          </div>
          <div className="action-container">
            {/* <div className="product-button"> */}
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
            <div className="product-button">
              <select name="shipping" id="shipping">
                <option value="">Choose Shipping</option>
                {d.shippings.map((s: any) => (
                  <option value={s.id} key={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select name="payment" id="payment">
                <option value="">Choose Payment</option>
                {d2.paymentTypes.map((p: any) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button className="text-button">Buy</button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </main>
      {modal}
    </Layout>
  )
}

export default Checkout
