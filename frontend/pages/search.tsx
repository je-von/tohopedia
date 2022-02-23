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
import ProductList from '../components/ProductList'
import { LimitContext } from '../util/context'
import Link from 'next/link'
import { links } from '../util/route-links'
import { convertPointsToBadge } from '../util/shop-badge'

let str = ''
let flag = false
const Search: NextPage = () => {
  const router = useRouter()
  const { keyword, category } = router.query
  const [priceRange, setPriceRange] = useState({ min: 0, max: Number.MAX_SAFE_INTEGER })
  const [orderBy, setOrderBy] = useState('')
  const [productsLimit, setProductsLimit] = useState(10)
  // const [pageLinks, setPageLinks] = useState([])
  const [offset, setOffset] = useState(0)
  // if (offset == -1 && !isNaN(parseInt(page as string))) {
  //   let pageNumber = parseInt(page as string) > 0 ? parseInt(page as string) - 1 : 0
  //   setOffset(pageNumber * 25)
  //   // console.log(offset)
  // }
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

  const variables = {
    keyword: keyword ? keyword : '',
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    orderBy: orderBy,
    categoryID: category ? category : null,
    limit: productsLimit,
    offset: offset,
  }

  const { loading, error, data } = useQuery(query, {
    variables: variables,
  })

  const shopQuery = gql`
    query shop($keyword: String!) {
      shop(keyword: $keyword) {
        id
        name
        nameSlug
        profilePic
        products(keyword: $keyword) {
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
    }
  `

  const {
    loading: l,
    error: e,
    data: d,
  } = useQuery(shopQuery, {
    variables: { keyword: keyword ? keyword : '' },
  })

  if (loading || l) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }
  let pages: any = []
  // let topProducts: any = []
  if (data && data.products) {
    let totalPage = Math.ceil(data.products.length / 25)
    pages = Array.from(Array(totalPage), (_, i) => i + 1)

    // topProducts = data.products.slice(0, 2)
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
    // console.log(productsLimit)
  }

  return (
    <LimitContext.Provider value={{ productsLimit, setProductsLimit }}>
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
            {/* <div className="card-container">
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
          </div> */}
            {keyword && d && d.shop ? (
              <div className="top-result">
                <Link href={links.shopDetail(d.shop.nameSlug)} passHref>
                  <div className="shop-container">
                    <div className="shop-image">
                      <Image src={d.shop.profilePic} alt="" layout="fill" objectFit="cover"></Image>
                    </div>
                    <div className="shop-detail">
                      <div className="shop-name">
                        <h2>{d.shop.name}</h2>
                        <div className="shop-badge">
                          <Image
                            src={`/asset/badge/${convertPointsToBadge(d.shop.reputationPoints)}.png`}
                            alt=""
                            layout="fill"
                            objectFit="contain"
                          ></Image>
                        </div>
                      </div>
                    </div>
                    <div className="card-container">
                      {d.shop.products.map((p: any) => (
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
                </Link>
              </div>
            ) : keyword ? (
              <i className="error">
                No shop found for &quot;<b>{keyword}</b>&quot;
              </i>
            ) : (
              ''
            )}

            <ProductList variables={variables}></ProductList>
            <div className="page-links">
              Page
              {pages.map((i: any) => (
                <div
                  className={offset / 25 + 1 == i ? 'current' : ''}
                  onClick={() => {
                    setOffset((i - 1) * 25)
                    setProductsLimit(10)
                    // console.log('jalan')
                  }}
                  key={i}
                >
                  <div>{i}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </LimitContext.Provider>
  )
}

export default Search
