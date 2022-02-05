import { gql, useMutation } from '@apollo/client'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import { links } from '../util/route-links'

interface Cart {
  productID: string
  image: string
  name: string
  price: number
  discount: number
  shop: string
  shopNameSlug: string
  quantity: number
  notes: string
}

const ListCard = (c: Cart) => {
  const router = useRouter()

  const [quantity, setQuantity] = useState(c.quantity)

  const updateMutation = gql`
    mutation updateCart($productID: ID!, $quantity: Int!, $notes: String!) {
      updateCart(productID: $productID, quantity: $quantity, notes: $notes) {
        product {
          name
        }
        quantity
      }
    }
  `
  const [updateCart, { data, loading, error }] = useMutation(updateMutation)

  const deleteMutation = gql`
    mutation deleteCart($productID: ID!) {
      deleteCart(productID: $productID)
    }
  `
  const [deleteCart, { data: d, loading: l, error: e }] = useMutation(deleteMutation)

  const handleQuantity = (e: any) => {
    let productID = e.target.accessKey
    setQuantity(e.target.value)

    updateCart({ variables: { productID: productID, quantity: e.target.value, notes: '' } })
  }

  const handleDeleteCart = (e: any) => {
    // console.log(e.target.accessKey)
    let productID = e.target.accessKey

    deleteCart({ variables: { productID: productID } })
  }

  if (d && d.deleteCart) {
    router.reload()
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Link href={links.shopDetail(c.shopNameSlug)} passHref>
            <b className="store-link">
              <i className="fas fa-store"></i>
              {c.shop}
            </b>
          </Link>
        </div>
        <Link href={links.productDetail(c.productID)} passHref>
          <div className="card-content">
            <div className="card-image">
              <Image src={c.image} alt="image" layout="fill" objectFit="cover"></Image>
            </div>
            <div className="product-info">
              <p className="product-name">{c.name}</p>
              <div className="product-price">
                <p className="product-discount">{Math.round(c.discount * 100)}%</p>
                <s className="original-price">Rp.{c.price}</s>
                <b>Rp.{Math.round(c.price * (1 - c.discount))}</b>
              </div>
            </div>
          </div>
        </Link>
        <div className="card-footer">
          <div>
            <p>
              <b>Notes</b>: {c.notes}
            </p>
          </div>
          <div className="left-footer">
            <div>
              <i accessKey={c.productID} className="far fa-trash-alt" onClick={handleDeleteCart}></i>
            </div>
            <input
              className="multi-input-item"
              min={1}
              // max={product.stock}
              value={quantity}
              placeholder="1"
              type="number"
              name="quantity"
              id="quantity"
              accessKey={c.productID}
              onChange={handleQuantity}
              // onChange={(e) => {
              //   console.log(e.target.key)
              // }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ListCard
