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

const Transaction: NextPage = () => {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(0)
  const [pages, setPages] = useState([0])
  // const limit = 10

  const query = gql`
    query getCurrentUser($limit: Int, $offset: Int) {
      getCurrentUser {
        id
        name
        transactionHeaders(limit: $limit, offset: $offset) {
          id
          transactionDate
          status
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

  const { loading, data, error } = useQuery(query, { variables: { limit: limit == 0 ? null : limit, offset: offset } })

  if (loading) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  let user: any = null
  // let pages: any = []
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    console.log(user.transactionHeaders)

    if (limit == 0) {
      let totalPage = Math.ceil(user.transactionHeaders.length / 10)
      setPages(Array.from(Array(totalPage), (_, i) => i + 1))
      console.log('length: ' + user.transactionHeaders.length + ', page: ' + totalPage)
      console.log(pages)

      setLimit(10)
    }
  }

  const calculatePrice = (details: any) => {
    // console.log(details)
    let totalPrice = details.map((d: any) => d.product.price * d.quantity).reduce((a: any, b: any) => a + b, 0)
    let totalDiscount = details
      .map((d: any) => Math.round(d.product.discount.toFixed(2) * d.product.price) * d.quantity)
      .reduce((a: any, b: any) => a + b, 0)

    // console.log(totalPrice, totalDiscount)
    return totalPrice - totalDiscount
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container">
            <h2>Transaction</h2>
            {user.transactionHeaders.map((h: any) => (
              <div className="card" key={h.id}>
                <div className="card-header">
                  <p>
                    {h.transactionDate.split('T')[0]} | <b>{h.status}</b> | Invoice no. {h.id}
                  </p>
                </div>
                <div className="card-header">
                  <Link href={links.shopDetail(h.transactionDetails[0].product.shop.nameSlug)} passHref>
                    <b className="store-link multi-input">
                      <div className="shop-badge">
                        <Image
                          src={`/asset/badge/${convertPointsToBadge(h.transactionDetails[0].product.shop.reputationPoints)}.png`}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                      {h.transactionDetails[0].product.shop.name}
                    </b>
                  </Link>
                </div>
                <Link href={links.productDetail(h.transactionDetails[0].product.originalProduct.id)} passHref>
                  <div className="card-content">
                    <div className="card-image">
                      <Image
                        src={
                          h.transactionDetails[0].product.originalProduct.images.length > 0
                            ? h.transactionDetails[0].product.originalProduct.images[0].image
                            : '/asset/no-image.png'
                        }
                        alt="image"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                    </div>
                    <div className="product-info">
                      <p className="product-name">{h.transactionDetails[0].product.name}</p>
                      {/* <div className="product-price">
                        <p className="product-discount">discount%</p>
                        <s className="original-price">Rp.price</s>
                        <b>Rp.price</b>
                      </div> */}
                    </div>
                  </div>
                </Link>
                <div className="card-footer">
                  <div>
                    <p>+{h.transactionDetails.length - 1} other product(s)</p>
                    <p>
                      Total transaction price: <b>Rp.{calculatePrice(h.transactionDetails)}</b>
                    </p>
                  </div>
                  <div className="left-footer">
                    <Link href={links.transactionDetail(h.id)} passHref>
                      <button className="text-button">Detail</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
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
    </Layout>
  )
}

export default Transaction
