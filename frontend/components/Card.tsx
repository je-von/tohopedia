import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { links } from '../util/route-links'

interface Product {
  productID: string
  image: string
  name: string
  price: number
  shop: string
  shopNameSlug: string
}

const Card = ({ productID, image, name, price, shop, shopNameSlug }: Product) => {
  return (
    <Link href={links.productDetail(productID)} passHref>
      <div className="card">
        <div className="card-image">
          <Image src={image} alt="image" layout="fill" objectFit="cover"></Image>
        </div>
        <div className="card-content">
          <p className="product-name">{name}</p>
          <b>Rp.{price}</b>
          <Link href={links.shopDetail(shopNameSlug)} passHref>
            <p className="store-link">
              <i className="fas fa-store"></i>
              {shop}
            </p>
          </Link>
        </div>
      </div>
    </Link>
  )
}

export default Card
