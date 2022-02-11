import { ReactNode, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { gql, useMutation, useQuery } from '@apollo/client'
import { getCookie, removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import UserSession from '../../util/user-session'
import { links } from '../../util/route-links'
import Geocode from 'react-geocode'
import Modal from '../Modal'
const NavLink = ({ children, path, className }: { children: ReactNode; path: string; className: string }) => (
  <div className={className}>
    <Link href={path}>{children}</Link>
  </div>
)

export default function Header() {
  const [modal, setModal] = useState(<></>)
  const [errorMsg, setErrorMsg] = useState('')

  const router = useRouter()
  const query = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        name
        email
        profilePic
        shop {
          id
          name
          nameSlug
          profilePic
        }
        carts {
          product {
            id
            name
            price
            images {
              image
            }
          }
          quantity
        }
        addresses {
          id
          name
          detail
          isPrimary
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const [togglePrimary, { data: d, loading: l, error: e }] = useMutation(gql`
    mutation togglePrimary($id: ID!) {
      togglePrimary(id: $id) {
        id
        isPrimary
      }
    }
  `)

  const [createAddress, { data: d2, loading: l2, error: e2 }] = useMutation(gql`
    mutation createAddress($name: String!, $detail: String!, $isPrimary: Boolean!) {
      createAddress(name: $name, detail: $detail, isPrimary: $isPrimary) {
        id
        name
        detail
        isPrimary
      }
    }
  `)

  if (loading) {
    return <>Loading...</>
  }

  let user: any = null
  let primaryAddress: any = null
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    UserSession.setCurrentUser(user)

    primaryAddress = user.addresses.length > 0 ? user.addresses[0].id : null
    // console.log(user.shop)
  }

  Geocode.setLanguage('en')
  Geocode.setRegion('id')

  navigator.geolocation.getCurrentPosition((p) => {
    console.log(p.coords.latitude, p.coords.longitude)

    // Geocode.fromLatLng(p.coords.latitude + '', p.coords.longitude + '').then(
    //   (response) => {
    //     const address = response.results[0].formatted_address
    //     console.log(address)
    //   },
    //   (error) => {
    //     console.error(error)
    //   }
    // )
  })

  const handleChooseAddress = async (e: any) => {
    // console.log(e.target.accessKey)
    // console.log('primary: ' + primaryAddress)

    try {
      await togglePrimary({ variables: { id: e.target.accessKey } })
      await togglePrimary({ variables: { id: primaryAddress } })

      router.reload()
    } catch (e) {}
  }

  const showAddAddressForm = () => {
    setModal(
      <Modal
        modalHeader={
          <>
            <h2>Add Address</h2>
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
              <label htmlFor="address_name">Address Name</label>
              <input type="text" id="address_name" name="address_name" placeholder="Example Address" required />
            </div>

            <div className="form-input">
              <label htmlFor="address_detail">Address Detail</label>
              <textarea id="address_detail" name="address_detail" placeholder="Example Street" required></textarea>
            </div>
          </div>
        }
        modalExtras={
          <>
            <div
              className="text-button"
              onClick={async () => {
                let name = (document.getElementById('address_name') as HTMLInputElement).value
                let detail = (document.getElementById('address_detail') as HTMLInputElement).value

                if (!name || !detail) {
                  setErrorMsg('All field must be filled!')
                } else {
                  try {
                    await createAddress({ variables: { name: name, detail: detail, isPrimary: user.addresses.length <= 0 } })
                    router.reload()
                  } catch (e) {}
                }
              }}
            >
              Add
            </div>
            {errorMsg}
          </>
        }
      ></Modal>
    )
  }

  return (
    <>
      <nav className="header-container">
        <div className="header-content">
          <div className="left-content">
            <Link href={links.home} passHref>
              <div className="logo-container">
                <Image src="/asset/logo.png" alt="tohopedia by JV" width={3867} height={1122}></Image>
              </div>
            </Link>
            <Link href="#">Category</Link>
          </div>
          {/* {Links.map(({ name, path }) => (
          <NavLink key={path} path={path}>
            {name}
          </NavLink>
        ))} */}
          <div>
            <form action="/search">
              <div className="search-container">
                <input type="text" placeholder="Search.." id="keyword" name="keyword" />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
            <NavLink path={links.cart} className="icon-button">
              <div>
                <i className="fas fa-shopping-cart"></i>
                <div className="dropdown">
                  {user && user.carts.length > 0 ? <b>Cart ({user.carts.length})</b> : ''}
                  {user && user.carts.length > 0 ? (
                    user.carts.map((c: any) => (
                      <div className="cart-item" key={c.product.id}>
                        <div className="product-image">
                          <Image
                            src={c.product.images.length > 0 ? c.product.images[0].image : '/asset/no-image.png'}
                            alt="image"
                            layout="fill"
                            objectFit="cover"
                          ></Image>
                        </div>
                        <p className="product-name">{c.product.name}</p>
                        <b>Rp.{c.product.price}</b>
                      </div>
                    ))
                  ) : (
                    <p>Your cart is Empty!</p>
                  )}
                </div>
              </div>
            </NavLink>
            {user ? (
              <>
                <NavLink path="#" className="icon-button">
                  <div>
                    <i className="fas fa-bell"></i>
                    <div className="dropdown">
                      <p>Empty!</p>
                    </div>
                  </div>
                </NavLink>
                <NavLink path="#" className="icon-button">
                  <div>
                    <i className="fas fa-envelope"></i>
                    <div className="dropdown">
                      <p>Empty!</p>
                    </div>
                  </div>
                </NavLink>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="right-content">
            {user ? (
              <>
                {user.shop.id ? (
                  <>
                    <NavLink path="" className="profile-button">
                      <>
                        <div className="profile-pic">
                          <Image
                            src={user.shop.profilePic ? user.shop.profilePic : '/asset/seller_no_logo.png'}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          ></Image>
                        </div>
                        <p>{user.shop.name}</p>
                        <div className="dropdown">
                          <NavLink path={links.shopDetail(user.shop.nameSlug)} className="text-button">
                            View Shop Details
                          </NavLink>
                          <NavLink path={links.sellProduct} className="text-button">
                            Sell Product
                          </NavLink>
                        </div>
                      </>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink path="" className="profile-button">
                      <>
                        <div className="profile-pic">
                          <Image src="/asset/shopnophoto.png" alt="" layout="fill" objectFit="cover"></Image>
                        </div>
                        <p>Toko</p>
                        <div className="dropdown">
                          <p>You don&apos;t have any shop yet</p>
                          <NavLink path={links.openShop} className="text-button">
                            Open Shop
                          </NavLink>
                        </div>
                      </>
                    </NavLink>
                  </>
                )}
                <NavLink path="" className="profile-button">
                  <>
                    <div className="profile-pic">
                      <Image src={user.profilePic ? user.profilePic : '/asset/default_toped.jpg'} alt="" layout="fill" objectFit="cover"></Image>
                    </div>
                    <p>{user.name}</p>
                    <div className="dropdown">
                      <Link href={links.editProfile} passHref>
                        <div className="text-button">Edit Profile</div>
                      </Link>
                      <button
                        className="text-button"
                        onClick={() => {
                          removeCookies('token')
                          router.reload()
                        }}
                      >
                        <i className="fal fa-sign-out"></i>
                        <p>Logout</p>
                      </button>
                    </div>
                  </>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink path={links.login} className="text-button">
                  Login
                </NavLink>
                <NavLink path={links.register} className="text-button">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="shipping-button">
            <>
              <i className="fas fa-map-marker-alt"></i>
              Dikirim ke <b>{user && user.addresses.length > 0 ? <>{user.addresses[0].name}</> : 'Jakarta Barat'}</b>
              {user ? (
                <i
                  className="fas fa-caret-down"
                  onClick={() => {
                    setModal(
                      <Modal
                        modalHeader={
                          <>
                            <h2>Choose Address</h2>
                            <i
                              className="fas fa-times"
                              onClick={() => {
                                setModal(<></>)
                              }}
                            ></i>
                          </>
                        }
                        modalContent={user.addresses.map((a: any) => (
                          <div className={'address-list ' + (a.isPrimary ? 'primary' : '')} key={a.id}>
                            <div className="address-content">
                              <p className="address-header">
                                {a.name} {a.isPrimary ? <b className="primary-tag">Primary</b> : ''}
                              </p>
                              <p className="address-detail">{a.detail}</p>
                            </div>
                            <div className="action">
                              {a.isPrimary ? (
                                <i className="far fa-check"></i>
                              ) : (
                                <div className="text-button" accessKey={a.id} onClick={handleChooseAddress}>
                                  Choose
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        modalExtras={
                          <div className="text-button" onClick={showAddAddressForm}>
                            Add Address
                          </div>
                        }
                      ></Modal>
                      // <div className="modal-overlay">
                      //   <div className="modal">
                      //     <div className="modal-header">

                      //     </div>
                      //     <div className="modal-content">

                      //     </div>
                      //
                      //   </div>
                      // </div>
                    )
                  }}
                ></i>
              ) : (
                ''
              )}
            </>
          </div>
        </div>
      </nav>
      {modal}
    </>
  )
}
