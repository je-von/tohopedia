import { gql, useQuery } from '@apollo/client'
import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Card from './Card'

const ProductList = () => {
  const router = useRouter()

  const [limit, setLimit] = useState(5)

  const productQuery = gql`
    query products($limit: Int) {
      products(limit: $limit) {
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

  const { loading, error, data } = useQuery(productQuery, { variables: { limit: limit } })

  if (loading) {
    return <main>Loading...</main>
  }

  if (!data || !data.products) {
    removeCookies('token')
    router.reload()
  }

  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // ev.preventDefault()
      // setCurrentScroll({ x: scrollX, y: scrollY })
      if (data.products.length % 5 == 0) setLimit(limit + 5)
      // scrollTo(scrollX, scrollY)
    }
  }

  return (
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
  )
}

export default ProductList
