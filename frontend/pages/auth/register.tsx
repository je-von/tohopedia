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
let email = ''
let profilePic = ''
const Register: NextPage = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')

  const handleImage = async (e: any) => {
    const image = e.target.files[0]
    profilePic = (await convertToBase64(image)) as string

    console.log(profilePic)
  }
  const handleSignUp = () => {
    let name = (document.getElementById('name') as HTMLInputElement).value
    let password = (document.getElementById('password') as HTMLInputElement).value
    let phone = (document.getElementById('phone') as HTMLInputElement).value
    let gender = (document.getElementById('gender') as HTMLInputElement).value
    let dob = (document.getElementById('dob') as HTMLInputElement).value

    createUser({
      variables: { name: name, email: email, password: password, phone: phone, gender: gender, dob: dob, profilePic: profilePic, role: 'User' },
    })
  }
  const handleFirstSubmit = async () => {
    // if (!hasVerified) {
    email = (document.getElementById('email') as HTMLInputElement).value
    if (!email) {
      setErrorMsg('All field must be filled!')
    } else {
      const { Auth } = require('two-step-auth')
      const res = await Auth(email, 'tohopedia by JV [REGISTER]')
      // console.log(res)
      // console.log(res.mail)
      console.log(res.OTP)
      // console.log(res.success)
      const handleOTP = (e: any) => {
        let input = e.target.value
        if (input.length >= 6) {
          if (input == res.OTP) {
            console.log('bener')
            setForm(
              <>
                <div className="container-header">
                  <h3>Sign Up Now</h3>
                  <Link href="/user/login">Log in</Link>
                </div>
                <div className="form-input">
                  <label htmlFor="email">Email</label>
                  <input type="text" id="email" name="email" value={email} disabled />
                </div>
                <div className="form-input">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" placeholder="Bambang Pamungkas" required />
                </div>
                <div className="form-input">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" placeholder="Password" required />
                </div>
                <div className="form-input">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" name="dob" />
                </div>
                <div className="form-input">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" id="phone" name="phone" placeholder="08123456789" />
                </div>
                <div className="form-input">
                  <label htmlFor="gender">Gender</label>
                  <select name="gender" id="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-input">
                  <label htmlFor="picture">Profile Picture</label>
                  <input type="file" id="picture" name="picture" onChange={handleImage} />
                </div>
                <button type="submit" onClick={handleSignUp}>
                  Sign Up
                </button>
                <p className="error">{errorMsg}</p>
              </>
            )
          } else {
            alert('OTP is invalid!')
          }
        }
      }

      if (res.success) {
        setForm(
          <>
            <div className="container-header">
              <h3>Enter OTP </h3>
            </div>
            <p>
              A 6-digit verification code has been sent to <i>{email}</i>
            </p>
            <div className="form-input">
              <input type="number" id="otp" name="otp" onChange={handleOTP} />
            </div>
          </>
        )
      }
      // let otp = prompt('Input OTP code (6 digits) that was sent to your email:')
      // console.log(otp)
      // } else {
      //   alert('Wrong OTP!')
      // }
      // }
    }
    // } else {

    // }
  }

  const [form, setForm] = useState(
    <>
      <div className="container-header">
        <h3>Sign Up Now</h3>
        <Link href="/user/login">Log in</Link>
      </div>
      <div className="form-input">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" placeholder="example@mail.com" />
      </div>
      <button type="submit" onClick={handleFirstSubmit}>
        Sign Up
      </button>
      <p className="error">{errorMsg}</p>
    </>
  )

  const mutation = gql`
    mutation CreateUser(
      $name: String!
      $email: String!
      $password: String!
      $phone: String!
      $gender: String!
      $dob: Date!
      $profilePic: String!
      $role: String!
    ) {
      createUser(
        input: { name: $name, email: $email, password: $password, phone: $phone, gender: $gender, dob: $dob, profilePic: $profilePic, role: $role }
      ) {
        id
        name
        email
        password
        dob
        phone
        gender
        role
        profilePic
      }
    }
  `
  const [createUser, { data, loading, error }] = useMutation(mutation)

  // if (loading || credential.length <= 1) {
  //   //loading
  //   // console.log('loading')
  // } else {
  if (error) {
    console.log(error)
  }

  if (data) {
    const user = data.user
    console.log(user)

    // alert('Welcome, ' + user.name + ' !')
    router.push('/auth/login')
  }
  // }

  return (
    <Layout>
      <div className="main-container">
        <div className="form-container">
          <div className="form-content">{form}</div>
        </div>
      </div>
    </Layout>
  )
}

export default Register
