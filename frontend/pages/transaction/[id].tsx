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
import { links } from '../../util/route-links'
import { convertPointsToBadge } from '../../util/shop-badge'

const TransactionDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const query = gql`
    query getCurrentUser($transactionID: ID) {
      getCurrentUser {
        id
        name
        transactionHeaders(id: $transactionID) {
          id
          transactionDate
          status
          shipping {
            name
          }
          paymentType {
            name
          }
          address {
            name
            detail
          }
          transactionDetails {
            quantity
            product {
              name
              price
              discount
              originalProduct {
                id
                images {
                  id
                  image
                }
              }
              shop {
                id
                nameSlug
                name
                reputationPoints
              }
            }
          }
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { transactionID: id ? id : null } })

  if (loading) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }
  if (error) {
    // router.reload()
    // console.log(error.message)
    return (
      <Layout>
        <main>{error.message}</main>
      </Layout>
    )
  }

  let transactionHeader: any = null
  if (data && data.getCurrentUser && data.getCurrentUser.transactionHeaders && data.getCurrentUser.transactionHeaders.length > 0) {
    transactionHeader = data.getCurrentUser.transactionHeaders[0]
    console.log(data.getCurrentUser)
    console.log(transactionHeader.transactionDetails)
    // console.log(user.transactionHeaders)
  } else {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  const calculateDiscount = (details: any) => {
    console.log(details)
    // let totalPrice = details.map((d: any) => d.product.price * d.quantity).reduce((a: any, b: any) => a + b, 0)
    let totalDiscount = details
      .map((d: any) => Math.round(d.product.discount.toFixed(2) * d.product.price) * d.quantity)
      .reduce((a: any, b: any) => a + b, 0)

    // console.log(totalPrice, totalDiscount)
    return totalDiscount
  }

  const calculatePrice = (details: any) => {
    let totalPrice = details.map((d: any) => d.product.price * d.quantity).reduce((a: any, b: any) => a + b, 0)
    let totalDiscount = details
      .map((d: any) => Math.round(d.product.discount.toFixed(2) * d.product.price) * d.quantity)
      .reduce((a: any, b: any) => a + b, 0)
    return totalPrice - totalDiscount
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container">
            <h2>Transaction</h2>
            <p className="text-button">{transactionHeader.status}</p>
            <div className="multi-input">
              <b className="multi-input-item">No. Invoice</b>
              <p className="multi-input-item">{transactionHeader.id}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Transaction Date</b>
              <p className="multi-input-item">{transactionHeader.transactionDate.replace('T', ' ').replace('+07:00', '')}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Shipping Vendor</b>
              <p className="multi-input-item">{transactionHeader.shipping.name}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Shipping Address</b>
              <p className="multi-input-item">
                <b>{transactionHeader.address.name}</b>
                <p>{transactionHeader.address.detail}</p>
              </p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Payment Type</b>
              <p className="multi-input-item">{transactionHeader.paymentType.name}</p>
            </div>
            {transactionHeader.transactionDetails.map((d: any) => (
              <div className="card" key={transactionHeader.transactionID + d.productID}>
                <div className="card-header">
                  <Link href={links.shopDetail(d.product.shop.nameSlug)} passHref>
                    <b className="store-link multi-input">
                      <div className="shop-badge">
                        <Image
                          src={`/asset/badge/${convertPointsToBadge(d.product.shop.reputationPoints)}.png`}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                      {d.product.shop.name}
                    </b>
                  </Link>
                </div>
                <Link href={links.productDetail(d.product.originalProduct.id)} passHref>
                  <div className="card-content">
                    <div className="card-image">
                      <Image
                        src={d.product.originalProduct.images.length > 0 ? d.product.originalProduct.images[0].image : '/asset/no-image.png'}
                        alt="image"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                    </div>
                    <div className="product-info">
                      <p className="product-name">{d.product.name}</p>
                    </div>
                  </div>
                </Link>
                <div className="card-footer">
                  <div>
                    <p>
                      {d.quantity} x Rp{d.product.price}
                    </p>
                  </div>
                  <div className="left-footer">Subtotal: Rp{d.quantity * d.product.price}</div>
                </div>
              </div>
            ))}
            <div className="multi-input">
              <b className="multi-input-item">Total Discount</b>
              <p className="multi-input-item">Rp{calculateDiscount(transactionHeader.transactionDetails)}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Grand Total</b>
              <p className="multi-input-item">Rp{calculatePrice(transactionHeader.transactionDetails)}</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default TransactionDetail
