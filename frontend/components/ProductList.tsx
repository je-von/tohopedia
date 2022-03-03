import { gql, useQuery } from '@apollo/client'
import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { createContext, useContext, useState } from 'react'
import { LimitContext } from '../util/context'
import { links } from '../util/route-links'
import Card from './Card'

const ProductList = ({ variables }: any) => {
  const router = useRouter()
  const { productsLimit, setProductsLimit } = useContext(LimitContext)

  //   const [limit, setLimit] = useState(5)

  const query = gql`
    query products(
      $limit: Int
      $offset: Int
      $keyword: String
      $minPrice: Int
      $maxPrice: Int
      $orderBy: String
      $categoryID: String
      $createdAtRange: Int
      $highRating: Boolean
    ) {
      products(
        limit: $limit
        offset: $offset
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

  const { loading, error, data } = useQuery(query, { variables: variables })

  if (loading) {
    return <main>Loading...</main>
  }

  if (error) {
    console.log(error)
    return <i>Error!</i>
  }
  //   if (!data || !data.products) {
  //     removeCookies('token')
  //     router.reload()
  //   }

  //   if(data && data.products && variables.offset){
  //     let totalPage = Math.ceil(data.products.length / 25)
  //     let temp: any = []
  //     for (let i = 1; i <= totalPage; i++) {
  //       temp.push(
  //         <a href={links.shopDetail(slug as string) + '?page=' + i} key={i}>
  //           <div>{i}</div>
  //         </a>
  //       )
  //       console.log('masuk')
  //     }
  //     setPageLinks(temp)
  //   }

  if (data && data.products) {
    console.log(data.products)
  }

  window.onscroll = function (ev) {
    // console.log(window.scrollY, document.body.clientHeight, document.body.scrollHeight)
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      // ev.preventDefault()
      // setCurrentScroll({ x: scrollX, y: scrollY })
      //   console.log(data.products.length, limit)
      if (data.products.length >= productsLimit) {
        if (variables.offset >= 0 && productsLimit >= 25) {
          //   setProductsLimit(5)
          return
        } else {
          setProductsLimit(productsLimit + 5)
        }
      }

      //   else setLimit(data.products.length)
      // scrollTo(scrollX, scrollY)
    }
  }

  return (
    // <LimitContext.Provider value={{ productsLimit: limit, setProductsLimit: setLimit }}>
    <>
      <div className="card-container">
        {data.products.map((p: any) => (
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
      {/* {variables.offset ? productsLimit : ''} */}
    </>
    // </LimitContext.Provider>
  )
}

export default ProductList
// export default ProductLimit
