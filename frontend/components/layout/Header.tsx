import { ReactNode } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { gql, useQuery } from '@apollo/client'
import { getCookie, removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import UserSession from '../../util/user-session'
import { links } from '../../util/route-links'

const NavLink = ({ children, path, className }: { children: ReactNode; path: string; className: string }) => (
  <div className={className}>
    <Link href={path}>{children}</Link>
  </div>
)

export default function Header() {
  const router = useRouter()
  const query = gql`
    query tes {
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
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  if (loading) {
    return <>Loading...</>
  }

  let user = null
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    UserSession.setCurrentUser(user)
    console.log(user.shop)
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
            <div className="search-container">
              <input type="text" placeholder="Search.." id="search" name="search" />
              <button type="submit">
                <i className="fa fa-search"></i>
              </button>
            </div>
            <NavLink path="#" className="icon-button">
              <div>
                <i className="fas fa-shopping-cart"></i>
                <div className="dropdown">
                  <p>Empty!</p>
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
          <NavLink path="" className="shipping-button">
            <>
              <i className="fas fa-map-marker-alt"></i>
              Dikirim ke <b>Address</b>
              <i className="fas fa-caret-down"></i>
            </>
          </NavLink>
        </div>
      </nav>
    </>
  )
}
