import type { NextPage } from 'next'
import Layout from '../../../components/layout/Layout'

import { gql, useQuery } from '@apollo/client'

import { useRouter } from 'next/router'
import { links } from '../../../util/route-links'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Legend, Bar, PieChart, Pie } from 'recharts'
const Dashboard: NextPage = () => {
  const router = useRouter()

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

  const transactionPerDayQuery = gql`
    query transactionsPerDay {
      transactionsPerDay {
        count
        name
      }
    }
  `

  const { loading: l, data: d, error: e } = useQuery(transactionPerDayQuery)

  const soldPerCategoryQuery = gql`
    query soldPerCategory {
      soldPerCategory {
        name
        count
        additional
      }
    }
  `

  const { loading: l2, data: d2, error: e2 } = useQuery(soldPerCategoryQuery)

  const transPerShippingQuery = gql`
    query transPerShipping {
      transactionPerShipping {
        name
        count
      }
    }
  `

  const { loading: l3, data: d3, error: e3 } = useQuery(transPerShippingQuery)

  if (loading || l || l2 || l3) {
    return (
      <Layout>
        <main>Loading...</main>
      </Layout>
    )
  }

  //   let user: any = null
  // let pages: any = []
  if (data && data.getCurrentUser && data.getCurrentUser.role == 'Admin') {
  } else {
    router.push(links.home)
  }

  let transactionsPerDayData = []
  if (d && d.transactionsPerDay) {
    transactionsPerDayData = d.transactionsPerDay.map((t: any) => ({ name: t.name.split('T')[0], Transactions: t.count }))
    // console.log(transactionsPerDayData)
  }

  let categories = []
  if (d2 && d2.soldPerCategory) {
    categories = d2.soldPerCategory.map((c: any) => ({ name: c.name, SoldProducts: c.count, UnsoldProducts: c.additional }))
  }

  let shippings = []
  if (d3 && d3.transactionPerShipping) {
    shippings = d3.transactionPerShipping.map((s: any) => ({ name: s.name, Transactions: s.count }))
  }

  return (
    <Layout>
      <main>
        <div className="cart-container">
          <div className="list-card-container cart-inner">
            <h2>Dashboard</h2>
            <hr />
            <h2 className="section-title">Transactions Per Day</h2>

            <ResponsiveContainer width={'100%'} height={400}>
              <LineChart data={transactionsPerDayData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="Transactions" stroke="#3eab00" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            <hr />
            <h2 className="section-title">Sold VS Unsold Products Per Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categories}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="SoldProducts" fill="#3eab00" />
                <Bar dataKey="UnsoldProducts" fill="#c50000" />
              </BarChart>
            </ResponsiveContainer>
            <hr />
            <h2 className="section-title">Shipping Vendors&apos; Transaction Count</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie dataKey="Transactions" data={shippings} cx="50%" cy="50%" outerRadius={100} fill="#3eab00" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Dashboard
