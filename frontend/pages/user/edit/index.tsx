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
import { links } from '../../../util/route-links'

// let email = ''
// let profilePic = ''
const EditProfile: NextPage = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  // const [email, setEmail] = useState('')
  // const [name, setName] = useState('')
  // const [phone, setPhone] = useState('')
  // const [dob, setDob] = useState('')

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
        name
        email
        phone
        profilePic
        gender
        dob
      }
    }
  `

  const { loading, data, error } = useQuery(query)

  const mutation = gql`
    mutation updateUser($name: String!, $email: String!, $phone: String!, $gender: String!, $dob: Date!, $profilePic: String!) {
      updateUser(input: { name: $name, email: $email, password: "", phone: $phone, gender: $gender, dob: $dob, profilePic: $profilePic, role: "" }) {
        id
      }
    }
  `
  const [updateUser, { data: d, loading: l, error: e }] = useMutation(mutation)

  if (loading) {
    return <>Loading...</>
  }

  let user: any = null
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser
  } else {
    router.push(links.home)
  }

  if (d && d.updateUser) {
    router.reload()
  }

  // const handleInput = (e: any, stateFunction: any) => {
  //   // let productID = e.target.accessKey

  //   stateFunction(e.target.value)
  // }

  const handleSubmit = async () => {
    let email = (document.getElementById('email') as HTMLInputElement).value
    let name = (document.getElementById('name') as HTMLInputElement).value
    let phone = (document.getElementById('phone') as HTMLInputElement).value
    let gender = (document.getElementById('gender') as HTMLInputElement).value
    let dob = (document.getElementById('dob') as HTMLInputElement).value

    if (!name || !email || !phone || !gender || !dob) {
      setErrorMsg('All field must be filled!')
    } else {
      try {
        await updateUser({
          variables: {
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            dob: dob,
            profilePic: profilePic ? profilePic : user.profilePic,
          },
        })
      } catch (e) {
        setErrorMsg('Error!')
        console.log(e)
      }
    }
  }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">
            <div className="container-header">
              <h3>Edit Profile</h3>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" defaultValue={user.email} />
            </div>
            <div className="form-input">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Full Name" defaultValue={user.name} required />
            </div>
            <div className="form-input">
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" id="dob" name="dob" defaultValue={user.dob} />
            </div>
            <div className="form-input">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                // value={phone ? phone : user.phone}
                placeholder="08123456789"
                defaultValue={user.phone}
                // onChange={(e) => {
                //   handleInput(e, setPhone)
                // }}
              />
            </div>
            <div className="form-input">
              <label htmlFor="gender">Gender</label>
              <select name="gender" id="gender" defaultValue={user.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-input">
              <label htmlFor="picture">Profile Picture</label>
              <div className="multi-input">
                <div className="profile-pic">
                  <Image
                    src={profilePic ? profilePic : user.profilePic ? user.profilePic : '/asset/no-image.png'}
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

export default EditProfile
