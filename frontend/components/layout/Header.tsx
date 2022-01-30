import { ReactNode } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { gql, useQuery } from '@apollo/client'

const Links = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Login',
    path: '/user/login',
  },
]

const NavLink = ({ children, path, className }: { children: ReactNode; path: string; className: string }) => (
  <div className={className}>
    <Link href={path}>{children}</Link>
  </div>
)

export default function Header() {
  const query = gql`
    query tes {
      getCurrentUser {
        id
        name
        email
        profilePic
        shop {
          name
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
  }

  return (
    <>
      <nav className="header-container">
        <div className="header-content">
          <div className="left-content">
            <Link href="/" passHref>
              <div className="logo-container">
                <Image src="/asset/logo.png" alt="tohopedia by JV" width={3867} height={1122}></Image>
              </div>
            </Link>
            <Link href="/">Category</Link>
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
            <NavLink path="/cart" className="icon-button">
              <div>
                <i className="fas fa-shopping-cart"></i>
                <div className="dropdown">
                  <p>Empty!</p>
                </div>
              </div>
            </NavLink>
            {user ? (
              <>
                <NavLink path="/" className="icon-button">
                  <div>
                    <i className="fas fa-bell"></i>
                    <div className="dropdown">
                      <p>Empty!</p>
                    </div>
                  </div>
                </NavLink>
                <NavLink path="/" className="icon-button">
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
                <NavLink path="" className="profile-button">
                  <>
                    <div className="profile-pic">
                      <Image src={user.shop.profilePic} alt="" layout="fill" objectFit="cover"></Image>
                    </div>
                    <p>{user.shop.name}</p>
                  </>
                </NavLink>
                <NavLink path="" className="profile-button">
                  <>
                    <div className="profile-pic">
                      <Image src={user.profilePic} alt="" layout="fill" objectFit="cover"></Image>
                    </div>
                    <p>{user.name}</p>
                  </>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink path="/user/login" className="text-button">
                  Login
                </NavLink>
                <NavLink path="/user/register" className="text-button">
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
