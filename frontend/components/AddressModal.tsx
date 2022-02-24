import { gql, useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import Modal from './Modal'

const AddressModal = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const [modal, setModal] = useState<ReactElement>()

  const query = gql`
    query getCurrentUser {
      getCurrentUser {
        id
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

  let user: any = null
  let primaryAddress: any = null
  if (data && data.getCurrentUser) {
    user = data.getCurrentUser

    primaryAddress = user.addresses.length > 0 ? user.addresses[0].id : null
  }

  const handleChooseAddress = async (e: any) => {
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

  if (!modal) {
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
    )
  }

  return <>{modal}</>
}

export default AddressModal
