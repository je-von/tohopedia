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

let profilePic = ''

const OpenShop: NextPage = () => {
  //   console.log(UserSession.getCurrentUser())
  let user = null

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
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const mutation = gql`
    mutation createShop(
      $name: String!
      $nameSlug: String!
      $address: String!
      $slogan: String!
      $description: String!
      $profilePic: String!
      $openTime: Time!
      $closeTime: Time!
      $operationalStatus: String!
    ) {
      createShop(
        input: {
          name: $name
          nameSlug: $nameSlug
          address: $address
          slogan: $slogan
          description: $description
          profilePic: $profilePic
          openTime: $openTime
          closeTime: $closeTime
          operationalStatus: $operationalStatus
        }
      ) {
        id
        name
      }
    }
  `
  const [createShop, { data: d, loading: l, error: e }] = useMutation(mutation)

  if (loading) {
    return <>Loading...</>
  }

  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
    UserSession.setCurrentUser(user)
  }

  if (!user || user.shop.id) {
    router.push('/')
    return <></>
  }

  const handleImage = async (e: any) => {
    const image = e.target.files[0]
    profilePic = (await convertToBase64(image)) as string

    console.log(profilePic)
  }
  const handleSubmit = () => {
    let name = (document.getElementById('name') as HTMLInputElement).value
    let name_slug = (document.getElementById('name_slug') as HTMLInputElement).value
    let address = (document.getElementById('address') as HTMLInputElement).value
    let slogan = (document.getElementById('slogan') as HTMLInputElement).value
    let description = (document.getElementById('description') as HTMLInputElement).value
    let open_time = (document.getElementById('open_time') as HTMLInputElement).value
    let close_time = (document.getElementById('close_time') as HTMLInputElement).value

    if (!name || !name_slug || !address || !slogan || !description || !open_time || !close_time) {
      setErrorMsg('All field must be filled!')
    } else {
      open_time = `0001-01-01T${open_time}:00.000+07:00`
      close_time = `0001-01-01T${close_time}:00.000+07:00`

      // console.log(name, name_slug, address, slogan, description, open_time, close_time, profilePic)
      createShop({
        variables: {
          name: name,
          nameSlug: name_slug,
          address: address,
          slogan: slogan,
          description: description,
          profilePic: profilePic,
          openTime: open_time,
          closeTime: close_time,
          operationalStatus: 'Open',
        },
      })
    }
  }

  if (e) {
    setErrorMsg(e.message)
  }

  if (d) {
    router.reload()
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Open Shop</h3>
            </div>
            <p>
              Hello, <b>{user.name}</b>! Please fill your shop details
            </p>
            <div className="form-input">
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" name="phone" placeholder="08123456789" value={user.phone} disabled />
            </div>
            <div className="form-input">
              <label htmlFor="name">Shop Name</label>
              <div className="multi-input">
                <input type="text" className="multi-input-item" id="name" name="name" placeholder="Shop Name" required />
                <input type="text" className="multi-input-item" id="name_slug" name="name_slug" placeholder="Shop Name Slug" required />
              </div>
            </div>

            <div className="form-input">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Address" required />
            </div>
            <div className="form-input">
              <label htmlFor="slogan">Slogan</label>
              <input type="text" id="slogan" name="slogan" placeholder="Slogan" required />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" placeholder="Description" required />
            </div>

            <div className="multi-input">
              <div className="form-input multi-input-item">
                <label>Open Time</label>
                <input type="time" id="open_time" name="open_time" placeholder="Open Time" required />
              </div>
              <div className="form-input multi-input-item">
                <label>Close Time</label>
                <input type="time" id="close_time" name="close_time" placeholder="Close Time" required />
              </div>
            </div>
            <div className="form-input">
              <label htmlFor="picture">Shop Profile Picture</label>
              <input type="file" id="picture" name="picture" onChange={handleImage} />
            </div>
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
