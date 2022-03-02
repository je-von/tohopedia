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
  const [isEdit, setIsEdit] = useState(false)
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

  const deleteMutation = gql`
    mutation deleteWishlist($productID: ID!) {
      deleteWishlist(productID: $productID)
    }
  `

  const [deleteWishlist, { data: d, loading: l, error: e }] = useMutation(deleteMutation)

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

  const handleDelete = async () => {
    for (const w of wishlists) {
      // console.log(w.product.originalProduct.id)
      let productID = w.product.originalProduct.id
      let isChecked = (document.getElementById(productID) as HTMLInputElement).checked
      if (!isChecked) continue
      try {
        await deleteWishlist({ variables: { productID: productID } })
      } catch (e) {}
    }

    router.reload()
  }

  return (
    <Layout>
      <div className="main-container">
        <h2>Wishlist</h2>
        {isEdit ? (
          <>
            <button className="text-button danger-button" onClick={handleDelete}>
              Delete Wishlist
            </button>
            <button
              className="text-button"
              onClick={() => {
                setIsEdit(false)
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="text-button"
            onClick={() => {
              setIsEdit(true)
            }}
          >
            Change Wishlist
          </button>
        )}
        <div className="card-container">
          {wishlists.map((w: any) => (
            <div className="card" key={w.product.originalProduct.id}>
              {isEdit ? (
                <div className="check-wishlist">
                  <input type="checkbox" id={w.product.originalProduct.id}></input>
                </div>
              ) : (
                ''
              )}
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
                <button className="text-button">Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Wishlist
