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
  const [createdAtRange, setCreatedAtRange] = useState(0)
  const [highRating, setHighRating] = useState(false)
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
    query searchProducts(
      $keyword: String!
      $minPrice: Int!
      $maxPrice: Int!
      $orderBy: String!
      $categoryID: String
      $createdAtRange: Int
      $highRating: Boolean
    ) {
      products(
        input: {
          keyword: $keyword
          minPrice: $minPrice
          maxPrice: $maxPrice
          orderBy: $orderBy
          categoryID: $categoryID
          createdAtRange: $createdAtRange
          highRating: $highRating
        }
      ) {
        # id
        name
        price
        # images {
        #   image
        # }
        shop {
          name
          nameSlug
        }
        originalProduct {
          id
          images {
            id
            image
          }
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
    createdAtRange: createdAtRange > 0 ? createdAtRange : null,
    highRating: highRating,
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
          # id
          name
          price
          # images {
          #   image
          # }
          shop {
            name
            nameSlug
          }
          originalProduct {
            id
            images {
              id
              image
            }
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
              <input
                onKeyDown={handleKeyDown}
                defaultValue={priceRange.min > 0 ? priceRange.min : ''}
                type="number"
                id="min_price"
                name="min_price"
                placeholder="Minimum Price"
              />
              <input
                onKeyDown={handleKeyDown}
                defaultValue={priceRange.max < Number.MAX_SAFE_INTEGER ? priceRange.max : ''}
                type="number"
                id="max_price"
                name="max_price"
                placeholder="Maximum Price"
              />
            </div>
            <div>
              <label>Rating</label>
              <div>
                <input
                  type="checkbox"
                  checked={highRating}
                  onChange={(e) => {
                    setHighRating(e.target.checked)
                  }}
                />{' '}
                &ge; 4 <i className="fas fa-star"></i>
              </div>
            </div>
            <div>
              <label>Created At</label>
              <button
                className={'text-button ' + (createdAtRange != 7 && 'unselected-button')}
                onClick={() => {
                  setCreatedAtRange(7)
                }}
              >
                7 days ago
              </button>
              <button
                className={'text-button ' + (createdAtRange != 14 && 'unselected-button')}
                onClick={() => {
                  setCreatedAtRange(14)
                }}
              >
                14 days ago
              </button>
              <button
                className={'text-button ' + (createdAtRange != 30 && 'unselected-button')}
                onClick={() => {
                  setCreatedAtRange(30)
                }}
              >
                1 month ago
              </button>
              <button
                className={'text-button ' + (createdAtRange != 90 && 'unselected-button')}
                onClick={() => {
                  setCreatedAtRange(90)
                }}
              >
                3 months ago
              </button>
            </div>
          </div>
          <div className="result-container">
            <div className="result-header">
              <p>
                Showing products for &quot;<b>{keyword}</b>&quot;
              </p>
              <div>
                <label>Order By</label>
                <select name="order-by" id="order-by" onChange={handleOrderByChange} defaultValue={orderBy}>
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
                          key={p.originalProduct.id}
                          image={p.originalProduct.images.length > 0 ? p.originalProduct.images[0].image : '/asset/no-image.png'}
                          productID={p.originalProduct.id}
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
