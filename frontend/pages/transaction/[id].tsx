import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../../components/layout/Layout'

import { gql, useMutation, useQuery } from '@apollo/client'
import { ReactElement, useState } from 'react'

import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ListCard from '../../components/ListCard'
import { links } from '../../util/route-links'
import { convertPointsToBadge } from '../../util/shop-badge'
import Modal from '../../components/Modal'
import { convertToBase64 } from '../../util/convert-base64'

let images: any[] = []
let flag = false
const TransactionDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [modal, setModal] = useState<ReactElement>()
  const [errorMsg, setErrorMsg] = useState('')

  const query = gql`
    query getCurrentUser($transactionID: ID) {
      getCurrentUser {
        id
        name
        transactionHeaders(id: $transactionID) {
          id
          transactionDate
          status
          shipping {
            name
          }
          paymentType {
            name
          }
          address {
            name
            detail
          }
          transactionDetails {
            quantity
            product {
              name
              price
              discount
              originalProduct {
                id
                images {
                  id
                  image
                }
              }
              shop {
                id
                nameSlug
                name
                reputationPoints
              }
            }
          }
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { transactionID: id ? id : null } })

  const mutation = gql`
    mutation createReview($productID: ID!, $description: String!, $rating: Int!, $isAnonymous: Boolean!) {
      createReview(productID: $productID, description: $description, rating: $rating, isAnonymous: $isAnonymous) {
        id
      }
    }
  `
  const [createReview, { data: d2, loading: l2, error: e2 }] = useMutation(mutation)

  const imageMutation = gql`
    mutation insertReviewImages($reviewID: ID!, $images: [String!]!) {
      createReviewImages(reviewID: $reviewID, images: $images)
    }
  `
  const [insertImages, { data: d3, loading: l3, error: e3 }] = useMutation(imageMutation)

  if (loading) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }
  if (error) {
    // router.reload()
    // console.log(error.message)
    return (
      <Layout>
        <main>{error.message}</main>
      </Layout>
    )
  }

  let transactionHeader: any = null
  if (data && data.getCurrentUser && data.getCurrentUser.transactionHeaders && data.getCurrentUser.transactionHeaders.length > 0) {
    transactionHeader = data.getCurrentUser.transactionHeaders[0]
    // console.log(data.getCurrentUser)
    // console.log(transactionHeader.transactionDetails)
    // console.log(user.transactionHeaders)
  } else {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  const calculateDiscount = (details: any) => {
    // console.log(details)
    // let totalPrice = details.map((d: any) => d.product.price * d.quantity).reduce((a: any, b: any) => a + b, 0)
    let totalDiscount = details
      .map((d: any) => Math.round(d.product.discount.toFixed(2) * d.product.price) * d.quantity)
      .reduce((a: any, b: any) => a + b, 0)

    // console.log(totalPrice, totalDiscount)
    return totalDiscount
  }

  const calculatePrice = (details: any) => {
    let totalPrice = details.map((d: any) => d.product.price * d.quantity).reduce((a: any, b: any) => a + b, 0)
    let totalDiscount = details
      .map((d: any) => Math.round(d.product.discount.toFixed(2) * d.product.price) * d.quantity)
      .reduce((a: any, b: any) => a + b, 0)
    return totalPrice - totalDiscount
  }

  const handleSubmit = async (productID: any) => {
    // console.log('masuk:' + productID)
    let description = (document.getElementById('description') as HTMLInputElement).value
    let rating = (document.getElementById('rating') as HTMLInputElement).value
    let anonymous = (document.getElementById('anonymous') as HTMLInputElement).checked

    let imagesInput = (document.getElementById('review-images') as HTMLInputElement).files
    if (imagesInput) {
      for (let idx = 0; idx < imagesInput?.length; idx++) {
        let image = (await convertToBase64(imagesInput[idx])) as string
        images.push(image)
      }
    }

    if (!description || !rating) {
      setErrorMsg('All field must be filled!')
      alert('All field must be filled!')
    } else {
      setErrorMsg('')
      createReview({ variables: { productID: productID, description: description, rating: rating, isAnonymous: anonymous } })
    }
  }
  if (!flag && d2 && images) {
    console.log('masukkkk')
    insertImages({ variables: { reviewID: d2.createReview.id, images: images } })
    flag = true
  }

  if (d3) {
    router.reload()
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container cart-inner">
            <h2>Transaction</h2>
            <p className="text-button">{transactionHeader.status}</p>
            <div className="multi-input">
              <b className="multi-input-item">No. Invoice</b>
              <p className="multi-input-item">{transactionHeader.id}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Transaction Date</b>
              <p className="multi-input-item">{transactionHeader.transactionDate.replace('T', ' ').replace('+07:00', '')}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Shipping Vendor</b>
              <p className="multi-input-item">{transactionHeader.shipping.name}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Shipping Address</b>
              <div className="multi-input-item">
                <b>{transactionHeader.address.name}</b>
                <div>{transactionHeader.address.detail}</div>
              </div>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Payment Type</b>
              <p className="multi-input-item">{transactionHeader.paymentType.name}</p>
            </div>
            {transactionHeader.transactionDetails.map((d: any) => (
              <div className="card" key={d.product.originalProduct.id}>
                <div className="card-header">
                  <Link href={links.shopDetail(d.product.shop.nameSlug)} passHref>
                    <b className="store-link multi-input">
                      <div className="shop-badge">
                        <Image
                          src={`/asset/badge/${convertPointsToBadge(d.product.shop.reputationPoints)}.png`}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                      {d.product.shop.name}
                    </b>
                  </Link>
                  <button
                    className="text-button"
                    onClick={() => {
                      setModal(
                        <Modal
                          modalHeader={
                            <>
                              <h2>Review &quot;{d.product.name}&quot;</h2>
                              <i
                                className="fas fa-times"
                                onClick={() => {
                                  setModal(<></>)
                                }}
                              ></i>
                            </>
                          }
                          modalContent={
                            <div className="form-content">
                              <div className="form-input">
                                <label htmlFor="rating">Rating</label>
                                <input type="number" id="rating" name="rating" placeholder="1" defaultValue={1} min={1} max={5} required />
                              </div>

                              <div className="form-input">
                                <label htmlFor="description">Review Description</label>
                                <textarea
                                  id="description"
                                  name="description"
                                  placeholder="Give your honest review about this product"
                                  required
                                ></textarea>
                              </div>
                              <div className="form-input">
                                <label>Review Images</label>
                                <input type="file" id="review-images" name="review-images" multiple />
                              </div>
                              <div className="container-header">
                                <div>
                                  <input type="checkbox" name="anonymous" id="anonymous" /> Review Anonymously
                                </div>
                                <p>(Your name and profile will be hidden if you check this)</p>
                              </div>
                            </div>
                          }
                          modalExtras={
                            <>
                              <div
                                className="text-button"
                                onClick={() => {
                                  handleSubmit(d.product.originalProduct.id)
                                }}
                              >
                                Submit
                              </div>
                              <p className="error">{errorMsg}</p>
                            </>
                          }
                        ></Modal>
                      )
                    }}
                  >
                    Review
                  </button>
                </div>
                <Link href={links.productDetail(d.product.originalProduct.id)} passHref>
                  <div className="card-content">
                    <div className="card-image">
                      <Image
                        src={d.product.originalProduct.images.length > 0 ? d.product.originalProduct.images[0].image : '/asset/no-image.png'}
                        alt="image"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                    </div>
                    <div className="product-info">
                      <p className="product-name">{d.product.name}</p>
                    </div>
                  </div>
                </Link>
                <div className="card-footer">
                  <div>
                    <p>
                      {d.quantity} x Rp{d.product.price}
                    </p>
                  </div>
                  <div className="left-footer">Subtotal: Rp{d.quantity * d.product.price}</div>
                </div>
              </div>
            ))}
            <div className="multi-input">
              <b className="multi-input-item">Total Discount</b>
              <p className="multi-input-item">Rp{calculateDiscount(transactionHeader.transactionDetails)}</p>
            </div>
            <div className="multi-input">
              <b className="multi-input-item">Grand Total</b>
              <p className="multi-input-item">Rp{calculatePrice(transactionHeader.transactionDetails)}</p>
            </div>
          </div>
        </div>
      </main>
      {modal}
    </Layout>
  )
}

export default TransactionDetail
