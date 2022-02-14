import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout/Layout'
import UserSession from '../util/user-session'
import Card from '../components/Card'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { convertToBase64 } from '../util/convert-base64'
import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'

let str = ''
let flag = false
const Search: NextPage = () => {
  const router = useRouter()
  const { keyword, category } = router.query
  const [priceRange, setPriceRange] = useState({ min: 0, max: Number.MAX_SAFE_INTEGER })
  const [orderBy, setOrderBy] = useState('')

  const query = gql`
    query searchProducts($keyword: String!, $minPrice: Int!, $maxPrice: Int!, $orderBy: String!, $categoryID: String) {
      products(input: { keyword: $keyword, minPrice: $minPrice, maxPrice: $maxPrice, orderBy: $orderBy, categoryID: $categoryID }) {
        id
        name
        price
        images {
          image
        }
        shop {
          name
          nameSlug
        }
      }
    }
  `

  const { loading, error, data } = useQuery(query, {
    variables: {
      keyword: keyword ? keyword : '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      orderBy: orderBy,
      categoryID: category ? category : null,
    },
  })

  if (loading) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  if (!data || !data.products) {
    removeCookies('token')
    router.reload()
  }

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      let min = parseInt((document.getElementById('min_price') as HTMLInputElement).value)
      let max = parseInt((document.getElementById('max_price') as HTMLInputElement).value)
      setPriceRange({ min: min > 0 ? min : 0, max: max > 0 ? max : Number.MAX_SAFE_INTEGER })
    }
  }

  const handleOrderByChange = (e: any) => {
    setOrderBy(e.target.value)
  }

  return (
    <Layout>
      <main>
        <div className="filter-container">
          <h3>Filter</h3>
          <div className="price-filter">
            <label>Price</label>
            <input onKeyDown={handleKeyDown} type="number" id="min_price" name="min_price" placeholder="Minimum Price" />
            <input onKeyDown={handleKeyDown} type="number" id="max_price" name="max_price" placeholder="Maximum Price" />
          </div>
        </div>
        <div className="result-container">
          <div className="result-header">
            <p>
              Showing products for &quot;<b>{keyword}</b>&quot;
            </p>
            <div>
              <label>Order By</label>
              <select name="order-by" id="order-by" onChange={handleOrderByChange}>
                <option value="-">-</option>
                <option value="newest">Newest</option>
                <option value="highest-price">Highest Price</option>
                <option value="lowest-price">Lowest Price</option>
              </select>
            </div>
          </div>
          <div className="card-container">
            {data.products.map((p: any) => (
              <Card
                key={p.id}
                image={p.images.length > 0 ? p.images[0].image : '/asset/no-image.png'}
                productID={p.id}
                priceTag={<b>Rp.{p.price}</b>}
                name={p.name}
                shop={p.shop.name}
                shopNameSlug={p.shop.nameSlug}
              ></Card>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Search
