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
import Carousel from '../../components/Carousel'
import { links } from '../../util/route-links'

const ShopDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [subtotal, setSubtotal] = useState(0)

  const query = gql`
    query getProductByID($id: ID!) {
      product(id: $id) {
        id
        name
        description
        price
        discount
        stock
        images {
          id
          image
        }
        shop {
          name
          nameSlug
          reputationPoints
          profilePic
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { id: id } })

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error.message}</>
  }

  let product: any = null
  if (data && data.product) {
    product = data.product
  }

  const handleQuantity = (e: any) => {
    let quantity = e.target.value > 0 ? e.target.value : 1
    setSubtotal(product.price * quantity)
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="product-container">
          <div className="product-image">
            {product.images.length > 0 ? (
              <Carousel images={product.images}></Carousel>
            ) : (
              <>
                <Image src="/asset/no-image.png" alt="" layout="fill" objectFit="contain"></Image>
              </>
            )}
          </div>
          <div className="product-detail">
            <h3>{product.name}</h3>
            <p>Sold Count: 0</p>
            <h1 className="product-price">Rp{product.price}</h1>
            <div className="product-description">
              <b>Detail</b>
              <p>{product.description}</p>
              <Link href={links.shopDetail(product.shop.nameSlug)} passHref>
                <div className="shop-container">
                  <div className="shop-image">
                    <Image src={product.shop.profilePic} alt="" layout="fill" objectFit="cover"></Image>
                  </div>
                  <div className="shop-detail">
                    <div className="shop-name">
                      <h2>{product.shop.name}</h2>
                      <div className="shop-badge">
                        <Image
                          src={`/asset/badge/${convertPointsToBadge(product.shop.reputationPoints)}.png`}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="product-action">
            <div className="multi-input">
              <input
                className="multi-input-item"
                min={1}
                max={product.stock}
                placeholder="1"
                type="number"
                name="quantity"
                id="quantity"
                onChange={handleQuantity}
              />
              <p className="multi-input-item">
                Stok <b>{product.stock}</b>
              </p>
            </div>
            <div className="notes">
              <input type="text" name="notes" id="notes" placeholder="Add Notes..." />
            </div>
            <div className="multi-input subtotal">
              <p className="multi-input-item">Subtotal</p>
              <b className="multi-input-item">Rp{subtotal}</b>
            </div>
            <div className="product-button">
              <button className="text-button">+ Add to Cart</button>
              <button className="text-button">Buy</button>
            </div>

            <div className="action-footer">
              <Link href="#" passHref>
                <div className="footer-links">
                  <i className="fas fa-comment-dots"></i>
                  Chat
                </div>
              </Link>
              <div className="footer-links">
                <i className="fas fa-heart"></i>
                Wishlist
              </div>
              <div
                className="footer-links"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                }}
              >
                <i className="fas fa-share-alt"></i>
                Share
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShopDetail
