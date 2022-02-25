import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/Home.module.css'
import Layout from '../../../components/layout/Layout'
import Link from 'next/link'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { redirect } from 'next/dist/server/api-utils'
import { url } from 'inspector'
import { useRouter } from 'next/router'
import { convertToBase64 } from '../../../util/convert-base64'
import UserSession from '../../../util/user-session'
import { links } from '../../../util/route-links'

let images: any[] = []
let flag = false
const EditProduct: NextPage = () => {
  //   console.log(UserSession.getCurrentUser())
  let user: any = null
  const router = useRouter()

  const { id } = router.query
  const [subtotal, setSubtotal] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  // const [metadata, ]

  const userQuery = gql`
    query getCurrentUser {
      getCurrentUser {
        id
      }
    }
  `

  const { loading, data, error } = useQuery(userQuery)

  const query = gql`
    query getProductByID($id: ID!) {
      product(id: $id) {
        id
        name
        description
        price
        discount
        stock

        shop {
          name
          nameSlug
          reputationPoints
          profilePic
          user {
            id
          }
        }
        category {
          name
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
    }
  `

  const { loading: l, data: d, error: e } = useQuery(query, { variables: { id: id } })

  const mutation = gql`
    mutation updateProduct($name: String!, $description: String!, $price: Int!, $stock: Int!, $discount: Float!, $lastUpdateID: ID) {
      updateProduct(
        input: { name: $name, description: $description, price: $price, stock: $stock, discount: $discount, metadata: "", categoryID: "" }
        lastUpdateID: $lastUpdateID
      ) {
        id
        originalProduct {
          id
          name
        }
        name
      }
    }
  `
  const [updateProduct, { data: d2, loading: l2, error: e2 }] = useMutation(mutation)

  if (d && d2) {
    router.push(links.productDetail(d.product.originalProduct.id)).then(() => {
      router.reload()
    })
  }

  if (loading || l) {
    return <>Loading...</>
  }

  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
  }

  if (!user) {
    router.push('/')
    return <></>
  }

  if (user && d && d.product) {
    if (user.id != d.product.shop.user.id) {
      router.push('/')
      return <></>
    }
  }

  const handleSubmit = async () => {
    // let str = '{"tes":"123", "asd":"jkl"}'

    // let x = 'key'
    // let y = 'value'
    // let obj = { x: y }
    // console.log(JSON.stringify(obj))

    let name = (document.getElementById('name') as HTMLInputElement).value
    let description = (document.getElementById('description') as HTMLInputElement).value
    let stock = (document.getElementById('stock') as HTMLInputElement).value
    let price = (document.getElementById('price') as HTMLInputElement).value
    let discount = (document.getElementById('discount') as HTMLInputElement).value

    if (!name || !description || !price || !discount || !stock) {
      setErrorMsg('All field must be filled!')
    } else {
      //   console.log(name, description, category, price, discount, metadataStr)
      let variables = {}
      // if (d.product.updatedProducts.length > 0 && d.product.updatedProducts[0].id) {
      variables = {
        lastUpdateID: d.product.id,
        name: name,
        description: description,
        price: price,
        stock: stock,
        discount: discount,
      }
      // } else {
      //   variables = {
      //     originalID: d.product.id,
      //     name: name,
      //     description: description,
      //     price: price,
      //     stock: stock,
      //     discount: discount,
      //   }
      // }

      updateProduct({
        variables: variables,
      })
    }
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Update Product</h3>
            </div>
            <div className="form-input">
              <label htmlFor="name">Product Name</label>
              <input
                defaultValue={d.product.name}
                type="text"
                className="multi-input-item"
                id="name"
                name="name"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              {/* <input type="text" id="description" name="description" placeholder="Description" required /> */}
              <textarea defaultValue={d.product.description} id="description" name="description" placeholder="Description" required></textarea>
            </div>
            <div className="form-input">
              <label htmlFor="stock">Stock</label>
              <input defaultValue={d.product.stock} type="number" id="stock" name="stock" placeholder="0" min={1} required />
            </div>
            <div className="form-input">
              <label htmlFor="price">Price</label>
              <input defaultValue={d.product.price} type="number" id="price" name="price" placeholder="0" min={0} required />
            </div>
            <div className="form-input">
              <label htmlFor="discount">Discount</label>
              <input
                defaultValue={d.product.discount}
                type="number"
                id="discount"
                name="discount"
                placeholder="0"
                step={0.01}
                min={0}
                max={0.99}
                required
              />
            </div>

            <button type="submit" onClick={handleSubmit}>
              Update
            </button>
            <p className="error">{errorMsg}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EditProduct
