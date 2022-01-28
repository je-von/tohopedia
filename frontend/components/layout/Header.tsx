import { ReactNode } from 'react'

import Link from 'next/link'

const Links = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Login',
    path: '/login',
  },
]

const NavLink = ({ children, path }: { children: ReactNode; path: string }) => (
  <div>
    <Link href={path}>{children}</Link>
  </div>
)

export default function Header() {
  return (
    <>
      <nav className="header">
        {Links.map(({ name, path }) => (
          <NavLink key={path} path={path}>
            {name}
          </NavLink>
        ))}
        <NavLink path="/cart">
          <i className="fas fa-shopping-cart"></i>
        </NavLink>
        {/* <div>
          <Link href="/login">Login</Link>
        </div> */}
      </nav>
    </>
  )
}
