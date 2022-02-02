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
import { links } from '../../util/route-links'

let images: any[] = []
let flag = false
const OpenShop: NextPage = () => {
  //   console.log(UserSession.getCurrentUser())
  let user: any = null

  const [metadataList, setMetadataList] = useState([<div key={0}></div>])
  const [errorMsg, setErrorMsg] = useState('')

  const router = useRouter()
  const query = gql`
    query tes {
      getCurrentUser {
        id
        name
        email
        phone
        shop {
          id
          nameSlug
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const queryCategories = gql`
    query categories {
      categories {
        id
        name
      }
    }
  `

  const { loading: l, data: d, error: e } = useQuery(queryCategories)

  const mutation = gql`
    mutation CreateProduct(
      $name: String!
      $description: String!
      $price: Int!
      $stock: Int!
      $discount: Float!
      $metadata: String!
      $categoryID: ID!
      $shopID: ID!
    ) {
      createProduct(
        input: {
          name: $name
          description: $description
          price: $price
          stock: $stock
          discount: $discount
          metadata: $metadata
          categoryID: $categoryID
        }
        shopID: $shopID
      ) {
        id
        name
        price
      }
    }
  `
  const [createProduct, { data: d2, loading: l2, error: e2 }] = useMutation(mutation)

  const imageMutation = gql`
    mutation insertProductImages($productID: ID!, $images: [String!]!) {
      createProductImages(productID: $productID, images: $images)
    }
  `
  const [insertImages, { data: d3, loading: l3, error: e3 }] = useMutation(imageMutation)

  if (loading || l) {
    return <>Loading...</>
  }

  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    UserSession.setCurrentUser(user)
  }

  if (!user || !user.shop.id) {
    router.push('/')
    return <></>
  }

  const handleSubmit = async () => {
    // let str = '{"tes":"123", "asd":"jkl"}'

    // let x = 'key'
    // let y = 'value'
    // let obj = { x: y }
    // console.log(JSON.stringify(obj))

    let name = (document.getElementById('name') as HTMLInputElement).value
    let category = (document.getElementById('category') as HTMLInputElement).value
    let description = (document.getElementById('description') as HTMLInputElement).value
    let stock = (document.getElementById('stock') as HTMLInputElement).value
    let price = (document.getElementById('price') as HTMLInputElement).value
    let discount = (document.getElementById('discount') as HTMLInputElement).value

    let label = document.getElementsByClassName('metadata-label')
    let value = document.getElementsByClassName('metadata-value')

    let metadata = []
    for (let idx = 0; idx < label.length; idx++) {
      //   console.log((label[idx] as HTMLInputElement).value + ' --> ' + (value[idx] as HTMLInputElement).value)
      let l = (label[idx] as HTMLInputElement).value
      let v = (value[idx] as HTMLInputElement).value
      if (l && v) {
        metadata.push({ [l]: v })
      }
    }
    let metadataStr = JSON.stringify(metadata)
    // let tes = JSON.stringify(metadata)
    // let parsed = JSON.parse(tes)
    // console.log(parsed)

    // for (let x of parsed) {
    //   for (let key in x) {
    //     let value = x[key]
    //     console.log(key + ' ----> ' + value)
    //   }
    // }

    let imagesInput = (document.getElementById('product-images') as HTMLInputElement).files
    if (imagesInput) {
      for (let idx = 0; idx < imagesInput?.length; idx++) {
        let image = (await convertToBase64(imagesInput[idx])) as string
        images.push(image)
      }
    }
    // console.log(images)

    if (!name || !description || !category || !price || !discount || !stock) {
      setErrorMsg('All field must be filled!')
    } else {
      //   console.log(name, description, category, price, discount, metadataStr)
      createProduct({
        variables: {
          name: name,
          description: description,
          price: price,
          stock: stock,
          discount: discount,
          metadata: metadataStr,
          categoryID: category,
          shopID: user.shop.id,
        },
      })
    }
  }

  if (!flag && d2 && images) {
    insertImages({ variables: { productID: d2.createProduct.id, images: images } })
    flag = true
  }
  if (d3) {
    router.push(links.shopDetail(user.shop.nameSlug))
  }

  const handleAddMetadata = () => {
    setMetadataList(
      metadataList.concat(
        <div className="multi-input" key={metadataList.length}>
          <input type="text" placeholder="Label" className="multi-input-item metadata-label" />
          <input type="text" placeholder="Value" className="multi-input-item metadata-value" />
        </div>
      )
    )
  }

  const handleImage = async (e: any) => {
    const image = e.target.files[0]
    // profilePic =

    // console.log(profilePic)
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Sell new Product</h3>
            </div>
            <div className="form-input">
              <label htmlFor="name">Product Name</label>
              <input type="text" className="multi-input-item" id="name" name="name" placeholder="Product Name" required />
            </div>
            <div className="form-input">
              <label htmlFor="category">Category</label>
              <select name="category" id="category">
                <option value="">--Choose Category--</option>
                {d.categories.map((c: any) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              {/* <input type="text" id="description" name="description" placeholder="Description" required /> */}
              <textarea id="description" name="description" placeholder="Description" required></textarea>
            </div>
            <div className="form-input">
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" placeholder="0" min={1} required />
            </div>
            <div className="form-input">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" placeholder="0" min={0} required />
            </div>
            <div className="form-input">
              <label htmlFor="discount">Discount</label>
              <input type="number" id="discount" name="discount" placeholder="0" step={0.01} min={0} max={0.99} required />
            </div>
            <div className="form-input">
              <div className="multi-title">
                <label>Product Metadata</label>
                <div className="text-button" onClick={handleAddMetadata}>
                  +
                </div>
              </div>
              {metadataList}
            </div>
            <div className="form-input">
              <label>Product Images</label>
              <input type="file" id="product-images" name="product-images" multiple />
            </div>
            {/* <div className="form-input">
              <label htmlFor="picture">Shop Profile Picture</label>
              <input type="file" id="picture" name="picture" onChange={handleImage} />
            </div> */}
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
            <p className="error">{errorMsg}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OpenShop
