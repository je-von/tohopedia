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
import { links } from '../../util/route-links'

const EditShop: NextPage = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')

  const [profilePic, setProfilePic] = useState('')

  const handleImage = async (e: any) => {
    const image = e.target.files[0]
    let base64 = (await convertToBase64(image)) as string
    setProfilePic(base64)

    console.log(base64)
  }

  const query = gql`
    query tes {
      getCurrentUser {
        id
        shop {
          id
          name
          nameSlug
          slogan
          description
          closeTime
          openTime
          operationalStatus
          profilePic
        }
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const mutation = gql`
    mutation updateShop(
      $name: String!
      $nameSlug: String!
      $slogan: String!
      $description: String!
      $profilePic: String!
      $openTime: Time!
      $closeTime: Time!
      $operationalStatus: String!
    ) {
      updateShop(
        input: {
          name: $name
          nameSlug: $nameSlug
          address: ""
          slogan: $slogan
          description: $description
          profilePic: $profilePic
          openTime: $openTime
          closeTime: $closeTime
          operationalStatus: $operationalStatus
        }
      ) {
        id
      }
    }
  `
  const [updateShop, { data: d, loading: l, error: e }] = useMutation(mutation)

  if (loading) {
    return <>Loading...</>
  }

  let shop: any = null
  if (data && data.getCurrentUser && data.getCurrentUser.shop) {
    shop = data.getCurrentUser.shop

    console.log(shop.openTime.replace('0001-01-01T', '').replace(':00+07:00', ''))

    console.log(new Date(shop.openTime), new Date(shop.closeTime))
  } else {
    router.push(links.home)
  }

  if (d && d.updateShop) {
    router.reload()
  }

  const handleSubmit = async () => {
    let name = (document.getElementById('name') as HTMLInputElement).value
    let name_slug = (document.getElementById('name_slug') as HTMLInputElement).value
    let slogan = (document.getElementById('slogan') as HTMLInputElement).value
    let description = (document.getElementById('description') as HTMLInputElement).value
    let open_time = (document.getElementById('open_time') as HTMLInputElement).value
    let close_time = (document.getElementById('close_time') as HTMLInputElement).value
    let operational_status = (document.getElementById('operational_status') as HTMLInputElement).value

    if (!name || !name_slug || !slogan || !description || !open_time || !close_time || !operational_status) {
      setErrorMsg('All field must be filled!')
    } else {
      open_time = `0001-01-01T${open_time}:00.000+07:00`
      close_time = `0001-01-01T${close_time}:00.000+07:00`

      try {
        await updateShop({
          variables: {
            name: name,
            nameSlug: name_slug,
            slogan: slogan,
            description: description,
            profilePic: profilePic ? profilePic : shop.profilePic,
            openTime: open_time,
            closeTime: close_time,
            operationalStatus: operational_status,
          },
        })
      } catch (e) {
        setErrorMsg('Error')
      }
    }
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Edit Shop</h3>
            </div>
            <div className="form-input">
              <label htmlFor="name">Shop Name</label>
              <div className="multi-input">
                <input type="text" className="multi-input-item" id="name" name="name" placeholder="Shop Name" defaultValue={shop.name} required />
                <input
                  type="text"
                  className="multi-input-item"
                  id="name_slug"
                  name="name_slug"
                  placeholder="Shop Name Slug"
                  defaultValue={shop.nameSlug}
                  required
                />
              </div>
            </div>

            <div className="form-input">
              <label htmlFor="slogan">Slogan</label>
              <input type="text" id="slogan" name="slogan" placeholder="Slogan" defaultValue={shop.slogan} required />
            </div>
            <div className="form-input">
              <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" placeholder="Description" defaultValue={shop.description} required />
            </div>

            <div className="multi-input">
              <div className="form-input multi-input-item">
                <label>Open Time</label>
                <input
                  type="time"
                  id="open_time"
                  name="open_time"
                  placeholder="Open Time"
                  defaultValue={shop.openTime.replace('0001-01-01T', '').replace(':00+07:00', '')}
                  required
                />
              </div>
              <div className="form-input multi-input-item">
                <label>Close Time</label>
                <input
                  type="time"
                  id="close_time"
                  name="close_time"
                  placeholder="Close Time"
                  defaultValue={shop.closeTime.replace('0001-01-01T', '').replace(':00+07:00', '')}
                  required
                />
              </div>
            </div>

            <div className="form-input">
              <label htmlFor="operational_status">Operational Status</label>
              <select name="operational_status" id="operational_status" defaultValue={shop.operationalStatus}>
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
            </div>
            <div className="form-input">
              <label htmlFor="picture">Shop Profile Picture</label>
              <div className="multi-input">
                <div className="profile-pic">
                  <Image
                    src={profilePic ? profilePic : shop.profilePic ? shop.profilePic : '/asset/no-image.png'}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  ></Image>
                </div>
                <input type="file" id="picture" name="picture" onChange={handleImage} />
              </div>
            </div>
            <button type="submit" onClick={handleSubmit}>
              Update
            </button>
            <p className="error">{errorMsg}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EditShop
