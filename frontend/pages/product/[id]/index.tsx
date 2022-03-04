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
import { convertPointsToBadge } from '../../../util/shop-badge'
import Card from '../../../components/Card'
import Carousel from '../../../components/Carousel'
import { links } from '../../../util/route-links'

const ProductDetail: NextPage = () => {
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

  const { loading: l2, data: d2, error: e2 } = useQuery(userQuery)

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
          transactionDetails {
            quantity
          }
          reviews {
            createdAt
            isAnonymous
            id
            rating
            description
            images {
              id
              image
            }
            user {
              id
              name
              profilePic
            }
          }
          discussions {
            id
            createdAt
            content
            user {
              id
              name
              profilePic
            }
          }
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query, { variables: { id: id } })

  const mutation = gql`
    mutation addToCart($productID: ID!, $quantity: Int!, $notes: String!) {
      createCart(productID: $productID, quantity: $quantity, notes: $notes) {
        product {
          name
        }
        user {
          name
        }
        quantity
        notes
      }
    }
  `
  const [addToCart, { data: d, loading: l, error: e }] = useMutation(mutation)

  const wishlistMutation = gql`
    mutation createWishlist($productID: ID!) {
      createWishlist(productID: $productID) {
        user {
          name
        }
        product {
          name
        }
      }
    }
  `
  const [createWishlist, { data: d3, loading: l3, error: e3 }] = useMutation(wishlistMutation)

  const discussionMutation = gql`
    mutation createDiscussion($productID: ID!, $content: String!) {
      createDiscussion(productID: $productID, content: $content) {
        id
      }
    }
  `
  const [createDiscussion, { data: d4, loading: l4, error: e4 }] = useMutation(discussionMutation)

  if (loading || l || l2) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error.message}</>
  }

  if (d && d.createCart) {
    router.push(links.cart, undefined, { shallow: true }).then(() => {
      router.reload()
    })
  }

  if (e) {
    console.log(e.message)
  }

  if (e3) {
    console.log(e3.message)
  }

  if (d3 && d3.createWishlist) {
    router.push(links.wishlist).then(() => {
      router.reload()
    })
  }

  if (d4 && d4.createDiscussion) {
    router.reload()
  }

  let product: any = null
  if (data && data.product) {
    product = data.product
  }

  let isSeller = false
  if (d2 && d2.getCurrentUser && data && data.product) {
    if (d2.getCurrentUser.id == data.product.shop.user.id) {
      console.log('owner!')
      isSeller = true
    }
  }

  const handleMetadata = (m: any) => {
    for (let key in m) {
      let value = m[key]
      // console.log(key + ' --> ' + value)
      return (
        <div key={key}>
          <label className="metadata-key">{key}</label> : {value}
        </div>
      )
    }
  }

  const handleQuantity = (e: any) => {
    let quantity = e.target.value > 0 ? e.target.value : 1
    setSubtotal(product.price * quantity)
  }

  const handleAddToCart = async () => {
    let quantity = (document.getElementById('quantity') as HTMLInputElement).value
    let notes = (document.getElementById('notes') as HTMLInputElement).value

    // console.log(quantity, notes)
    if (!quantity || !notes) {
      setErrorMsg('Quantity and Notes must be filled!')
    } else {
      try {
        await addToCart({
          variables: {
            productID: product.originalProduct.id,
            quantity: quantity,
            notes: notes,
          },
        })
      } catch (e) {
        // setErrorMsg('Please login first!')
        console.log(e)
      }
    }
  }

  const calculateSoldCount = (transactionDetail: any) => {
    if (transactionDetail.length <= 0) return 0

    let soldCount = transactionDetail.map((d: any) => d.quantity).reduce((a: any, b: any) => a + b, 0)
    return soldCount
  }

  const handleWishlist = async () => {
    try {
      await createWishlist({
        variables: {
          productID: product.originalProduct.id,
        },
      })
    } catch (e) {
      setErrorMsg('Error!')
    }
  }

  const handleDiscussion = async () => {
    let content = (document.getElementById('discussion-content') as HTMLInputElement).value
    if (!content) {
      alert('Field must be filled!')
    } else {
      try {
        await createDiscussion({
          variables: {
            productID: product.originalProduct.id,
            content: content,
          },
        })
      } catch (e) {
        router.push(links.login)
      }
    }
  }

  return (
    <Layout>
      <main>
        <div className="product-container">
          <div className="product-image">
            {product.originalProduct.images.length > 0 ? (
              <Carousel images={product.originalProduct.images}></Carousel>
            ) : (
              <>
                <Image src="/asset/no-image.png" alt="" layout="fill" objectFit="contain"></Image>
              </>
            )}
          </div>
          <div className="product-detail">
            <h3>{product.name}</h3>
            <p>Sold Count: {calculateSoldCount(product.originalProduct.transactionDetails)}</p>
            <h1 className="product-price">Rp{product.price}</h1>
            <div className="product-description">
              <b>Detail</b>
              <div className="product-metadata">
                <label className="metadata-key">Category</label> : {product.category.name}
                {product.originalProduct.metadata ? JSON.parse(product.originalProduct.metadata).map((m: any) => handleMetadata(m)) : ''}
                {/* {metadataList} */}
              </div>
              <p>{product.description}</p>
              <Link href={links.shopDetail(product.shop.nameSlug)} passHref>
                <div className="shop-container">
                  <div className="shop-image">
                    <Image src={product.shop.profilePic} alt="" layout="fill" objectFit="cover"></Image>
                  </div>
                  <div className="shop-detail">
                    <div className="shop-name">
                      <h2>{product.shop.name}</h2>
                      <div className="shop-badge">
                        <Image
                          src={`/asset/badge/${convertPointsToBadge(product.shop.reputationPoints)}.png`}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <h3>REVIEWS ({product.originalProduct.reviews.length})</h3>
            <div>
              {product.originalProduct.reviews.map((r: any) => (
                <div className="review-card" key={r.id}>
                  <div className="user">
                    <div className="profile-button">
                      <div className="profile-pic">
                        <Image
                          src={r.user.profilePic && !r.isAnonymous ? r.user.profilePic : '/asset/anonymous.png'}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        ></Image>
                      </div>
                      <p>{!r.isAnonymous ? r.user.name : r.user.name[0] + '***'}</p>
                      <p className="date">{r.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="card-header">
                      <p>
                        {Array.from(Array(r.rating), (_, i) => i).map((star: any) => (
                          <i key={star} className="fas fa-star"></i>
                        ))}
                      </p>
                      <button className="text-button">Reply</button>
                    </div>
                    <div className="description">{r.description}</div>
                    <div className="images">
                      {r.images.map((img: any) => (
                        <div className="card-image" key={img.id}>
                          <Image src={img.image} alt="image" layout="fill" objectFit="cover"></Image>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <h3>DISCUSSIONS ({product.originalProduct.discussions.length})</h3>
            <div>
              {product.originalProduct.discussions.map((d: any) => (
                <div className="review-card" key={d.id}>
                  <div className="user">
                    <div className="profile-button">
                      <div className="profile-pic">
                        <Image src={d.user.profilePic ? d.user.profilePic : '/asset/anonymous.png'} alt="" layout="fill" objectFit="cover"></Image>
                      </div>
                      <p>{d.user.name}</p>
                      <p className="date">{d.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="card-header">
                      <div className="description">{d.content}</div>
                      <button className="text-button">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="form-input">
                <textarea id="discussion-content" name="discussion-content" placeholder="What do you want to ask about this product"></textarea>
                <button className="text-button" onClick={handleDiscussion}>
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="action-container">
              <div className="multi-input">
                <input
                  className="multi-input-item"
                  min={1}
                  max={product.stock}
                  placeholder="0"
                  type="number"
                  name="quantity"
                  id="quantity"
                  onChange={handleQuantity}
                />
                <p className="multi-input-item">
                  Stok <b>{product.stock}</b>
                </p>
              </div>
              <div className="notes">
                <input type="text" name="notes" id="notes" placeholder="Add Notes..." />
              </div>
              <div className="multi-input subtotal">
                <p className="multi-input-item">Subtotal</p>
                <b className="multi-input-item">Rp{subtotal}</b>
              </div>
              <div className="product-button">
                <button className="text-button" onClick={handleAddToCart}>
                  + Add to Cart
                </button>
                <button className="text-button">Buy</button>
                <p className="error">{errorMsg}</p>
              </div>

              <div className="action-footer">
                <Link href="#" passHref>
                  <div className="footer-links">
                    <i className="fas fa-comment-dots"></i>
                    Chat
                  </div>
                </Link>
                <div className="footer-links" onClick={handleWishlist}>
                  <i className="fas fa-heart"></i>
                  Wishlist
                </div>
                <div
                  className="footer-links"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                >
                  <i className="fas fa-share-alt"></i>
                  Share
                </div>
              </div>
            </div>
            {isSeller ? (
              <div className="multi-input">
                <Link href={links.editProduct(product.originalProduct.id)} passHref>
                  <button className="text-button multi-input-item">Update</button>
                </Link>
                <button className="text-button multi-input-item danger-button">Delete</button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ProductDetail
