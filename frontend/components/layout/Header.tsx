import { ReactElement, ReactNode, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { gql, useMutation, useQuery } from '@apollo/client'
import { getCookie, removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import UserSession from '../../util/user-session'
import { links } from '../../util/route-links'
import Geocode from 'react-geocode'
import Modal from '../Modal'
import { useStateIfMounted } from 'use-state-if-mounted'
import AddressModal from '../AddressModal'
const NavLink = ({ children, path, className }: { children: ReactNode; path: string; className: string }) => (
  <div className={className}>
    <Link href={path}>{children}</Link>
  </div>
)

export default function Header() {
  const [modal, setModal] = useState<ReactElement>()

  const router = useRouter()

  const { keyword } = router.query

  // const [errorMsg, setErrorMsg] = useState('')
  const [currentLocation, setCurrentLocation] = useStateIfMounted('Address')

  const query = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        name
        email
        profilePic
        role
        isSuspended
        shop {
          id
          name
          nameSlug
          profilePic
        }
        carts {
          product {
            # id
            name
            price
            # images {
            #   image
            # }
            originalProduct {
              id
              images {
                id
                image
              }
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

  const {
    loading: l3,
    data: d3,
    error: e3,
  } = useQuery(gql`
    query categories {
      categories {
        id
        name
      }
    }
  `)

  if (loading || l3) {
    return <>Loading...</>
  }

  if (e3) {
    // if (!modal) {
    // setModal(
    //   <Modal
    //     modalHeader={
    //       <>
    //         <h2 className="error">Error!</h2>
    //         <i
    //           className="fas fa-times"
    //           onClick={() => {
    //             setModal(<></>)
    //           }}
    //         ></i>
    //       </>
    //     }
    //     modalContent={<>{e3.message}</>}
    //     modalExtras={
    //       <div className="text-button" onClick={() => router.reload()}>
    //         Refresh
    //       </div>
    //     }
    //   ></Modal>
    // )
    // }
  }

  let user: any = null
  let primaryAddress: any = null
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    // UserSession.setCurrentUser(user)

    primaryAddress = user.addresses.length > 0 ? user.addresses[0].id : null
    // console.log(user.shop)

    // if (!modal) {
    //   console.log('asd')
    // }

    if (user.isSuspended) {
      if (confirm('Your account is suspended! Do you want to request admin to unblock your account?')) {
        console.log('yes')
      } else {
        console.log('no')
      }
      removeCookies('token')
      router.reload()
    }
  }

  // let categories: any = null
  // if (d3 && d3.categories) {
  //   categories = d3.categories
  // }

  // Geocode.setLanguage('en')
  // Geocode.setRegion('id')

  if (!primaryAddress) {
    navigator.geolocation.getCurrentPosition((p) => {
      console.log(p.coords.latitude, p.coords.longitude)
      let url = `https://api.opencagedata.com/geocode/v1/json?key=f8cab12dcfac4859bcc109baa56595ea&q=${encodeURIComponent(
        p.coords.latitude + ',' + p.coords.longitude
      )}&pretty=1&no_annotations=1`
      let req = new XMLHttpRequest()
      req.open('GET', url, true)

      req.onload = function () {
        if (req.status === 200) {
          var data = JSON.parse(req.responseText)
          // console.log(data)
          // console.log(data.results[0].formatted)

          setCurrentLocation(data.results[0].formatted)
        } else {
        }
      }

      req.onerror = function () {
        console.log('unable to connect to server')
      }

      req.send()
    })
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
            <div className="icon-button">
              <div className="category-dropdown">
                <p>Category</p>
                <div className="dropdown">
                  {d3 && d3.categories
                    ? d3.categories.map((c: any) => (
                        <Link key={c.id} href={links.search('?category=' + c.id)} passHref>
                          <div className="category">{c.name}</div>
                        </Link>
                      ))
                    : ''}
                </div>
              </div>
            </div>
          </div>
          {/* {Links.map(({ name, path }) => (
          <NavLink key={path} path={path}>
            {name}
          </NavLink>
        ))} */}
          <div className="middle-content">
            <form action={links.search()}>
              <div className="search-container">
                <input type="text" defaultValue={keyword ? keyword : ''} placeholder="Search.." id="keyword" name="keyword" />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
          </div>
          <div className="right-content">
            <div className="icon">
              <NavLink path={links.cart} className="icon-button">
                <div>
                  <i className="fas fa-shopping-cart"></i>
                  <div className="dropdown">
                    {user && user.carts.length > 0 ? <b>Cart ({user.carts.length})</b> : ''}
                    {user && user.carts.length > 0 ? (
                      user.carts.map((c: any) => (
                        <div className="cart-item" key={c.product.originalProduct.id}>
                          <div className="product-image">
                            <Image
                              src={c.product.originalProduct.images.length > 0 ? c.product.originalProduct.images[0].image : '/asset/no-image.png'}
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
                  <NavLink path={links.chat} className="icon-button">
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
            <div className="line"></div>
            <div className="profile">
              {user ? (
                <>
                  {user.shop.id ? (
                    <>
                      <NavLink path="" className="profile-button shop">
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
                            <NavLink path={links.editShop} className="text-button">
                              Edit Shop
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
                        {user.role == 'Admin' ? (
                          <>
                            <Link href={links.dashboard} passHref>
                              <div className="text-button danger-button">Dashboard</div>
                            </Link>
                            <Link href={links.manageUsers} passHref>
                              <div className="text-button danger-button">Manage Users</div>
                            </Link>
                          </>
                        ) : (
                          ''
                        )}
                        <Link href={links.wishlist} passHref>
                          <div className="text-button">Wishlist</div>
                        </Link>
                        <Link href={links.transaction} passHref>
                          <div className="text-button">Transactions</div>
                        </Link>
                        <Link href={links.editProfile} passHref>
                          <div className="text-button">Edit Profile</div>
                        </Link>
                        <div
                          className="text-button"
                          onClick={() => {
                            removeCookies('token')
                            router.reload()
                          }}
                        >
                          <i className="fal fa-sign-out"></i>
                          <p>Logout</p>
                        </div>
                      </div>
                    </>
                  </NavLink>
                </>
              ) : (
                <div className="auth-button">
                  <NavLink path={links.login} className="text-button">
                    Login
                  </NavLink>
                  <NavLink path={links.register} className="text-button">
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="shipping-button">
            <>
              <i className="fas fa-map-marker-alt"></i>
              Dikirim ke <b>{user && user.addresses.length > 0 ? <>{user.addresses[0].name}</> : currentLocation}</b>
              {user ? (
                <i
                  className="fas fa-caret-down"
                  onClick={() => {
                    setModal(<AddressModal></AddressModal>)
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
