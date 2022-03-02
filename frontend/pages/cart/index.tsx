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

const Cart: NextPage = () => {
  const router = useRouter()

  const query = gql`
    query carts {
      carts {
        product {
          # id
          name
          # images {
          #   image
          # }
          price
          discount
          shop {
            name
            nameSlug
          }
          originalProduct {
            id
            metadata
            images {
              id
              image
            }
          }
        }
        quantity
        notes
      }
    }
  `

  const { loading, error, data } = useQuery(query)

  const wishlistQuery = gql`
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

  const { loading: l, data: d, error: e } = useQuery(wishlistQuery)

  const deleteMutation = gql`
    mutation deleteWishlist($productID: ID!) {
      deleteWishlist(productID: $productID)
    }
  `

  const [deleteWishlist, { data: d3, loading: l3, error: e3 }] = useMutation(deleteMutation)

  const cartMutation = gql`
    mutation addToCart($productID: ID!, $quantity: Int!, $notes: String!) {
      createCart(productID: $productID, quantity: $quantity, notes: $notes) {
        product {
          name
        }
        user {
          name
        }
        quantity
        notes
      }
    }
  `
  const [addToCart, { data: d2, loading: l2, error: e2 }] = useMutation(cartMutation)

  if (loading || l) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  let wishlists: any = null
  if (d && d.wishlists) {
    wishlists = d.wishlists
  }
  if (d2 && d2.createCart) {
    router.reload()
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

  const handleAddToCart = async (id: any) => {
    try {
      await addToCart({
        variables: {
          productID: id,
          quantity: 1,
          notes: '',
        },
      })

      await deleteWishlist({ variables: { productID: id } })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="cart-inner">
            <div className="list-card-container">
              <h2>Cart</h2>
              {data.carts.map((c: any) => (
                <ListCard
                  key={c.product.originalProduct.id}
                  productID={c.product.originalProduct.id}
                  image={c.product.originalProduct.images.length > 0 ? c.product.originalProduct.images[0].image : '/asset/no-image.png'}
                  name={c.product.name}
                  price={c.product.price}
                  discount={c.product.discount}
                  shop={c.product.shop.name}
                  shopNameSlug={c.product.shop.nameSlug}
                  quantity={c.quantity}
                  notes={c.notes}
                  isCheckout={false}
                ></ListCard>
              ))}
            </div>
            <h2 className="section-title">Your wishlist misses you</h2>
            <div className="card-container wishlist">
              {wishlists.map((w: any) => (
                <div className="card" key={w.product.originalProduct.id}>
                  <Link href={links.productDetail(w.product.originalProduct.id)} passHref>
                    <div className="card-image">
                      <Image
                        src={w.product.originalProduct.images.length > 0 ? w.product.originalProduct.images[0].image : '/asset/no-image.png'}
                        alt="image"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                    </div>
                  </Link>
                  <div className="card-content">
                    <p className="product-name">{w.product.name}</p>
                    <b>Rp.{w.product.price}</b>
                    <Link href={links.shopDetail(w.product.shop.nameSlug)} passHref>
                      <p className="store-link">
                        <i className="fas fa-store"></i>
                        {w.product.shop.name}
                      </p>
                    </Link>
                    <button
                      className="text-button"
                      onClick={() => {
                        handleAddToCart(w.product.originalProduct.id)
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="action-container">
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
              <Link href={links.checkout} passHref>
                <button className="text-button">Buy</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Cart
