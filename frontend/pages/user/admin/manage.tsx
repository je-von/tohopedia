import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../../../components/layout/Layout'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import { removeCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ListCard from '../../../components/ListCard'
import { links } from '../../../util/route-links'
import { convertPointsToBadge } from '../../../util/shop-badge'

const ManageUsers: NextPage = () => {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(0)
  const [pages, setPages] = useState([0])
  // const limit = 10

  const query = gql`
    query getCurrentUser {
      getCurrentUser {
        id
        name
        role
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const usersQuery = gql`
    query users($limit: Int, $offset: Int) {
      users(limit: $limit, offset: $offset) {
        id
        name
        profilePic
        email
        role
        isSuspended
      }
    }
  `

  const { loading: l, data: d, error: e } = useQuery(usersQuery, { variables: { limit: limit == 0 ? null : limit, offset: offset } })

  const suspendMutation = gql`
    mutation toggleSuspend($id: ID!) {
      toggleSuspend(id: $id) {
        id
        isSuspended
      }
    }
  `

  const [toggleSuspend, { data: d2, loading: l2, error: e2 }] = useMutation(suspendMutation)

  if (loading || l) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  //   let user: any = null
  // let pages: any = []
  if (d && data && data.getCurrentUser && data.getCurrentUser.role == 'Admin') {
    // user = data.getCurrentUser
    if (limit == 0) {
      let totalPage = Math.ceil(d.users.length / 10)
      setPages(Array.from(Array(totalPage), (_, i) => i + 1))
      console.log('length: ' + d.users.length + ', page: ' + totalPage)

      setLimit(10)
    }
  } else {
    router.push(links.home)
  }

  if (d2 && d2.toggleSuspend) {
    // router.reload()
  }

  const handleToggle = async (userID: string) => {
    try {
      await toggleSuspend({
        variables: {
          id: userID,
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container cart-inner">
            <h2>Manage Users</h2>
            {d.users.map((u: any) => (
              <div className="card" key={u.id}>
                <div className="card-content">
                  <div className="card-image">
                    <Image src={u.profilePic ? u.profilePic : '/asset/no-image.png'} alt="image" layout="fill" objectFit="cover"></Image>
                  </div>
                  <div className="product-info">
                    <p className="product-name">
                      {u.name} {u.role == 'Admin' ? <b className="primary-tag">Admin</b> : ''}
                    </p>
                    <p>{u.email}</p>
                  </div>
                  {u.role != 'Admin' ? (
                    u.isSuspended ? (
                      <button className="text-button" onClick={() => handleToggle(u.id)}>
                        Unsuspend User
                      </button>
                    ) : (
                      <button className="text-button danger-button" onClick={() => handleToggle(u.id)}>
                        Suspend User
                      </button>
                    )
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div className="page-links">
        Page
        {pages.map((i: any) => (
          <div
            className={offset / limit + 1 == i ? 'current' : ''}
            onClick={() => {
              setOffset((i - 1) * limit)
            }}
            key={i}
          >
            <div>{i}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default ManageUsers
