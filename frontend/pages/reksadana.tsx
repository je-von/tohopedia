import type { NextPage } from 'next'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Layout from '../components/layout/Layout'

const Reksadana: NextPage = () => {
  const data = [
    { name: 'Sep 21', value: 1465 },
    { name: 'Okt 21', value: 1470 },
    { name: 'Nov 21', value: 1475 },
  ]

  return (
    <Layout>
      <div className="main-container">
        <div className="cart-container">
          <div className="list-card-container cart-inner">
            <h2>Reksadana</h2>
            <ResponsiveContainer width={'100%'} height={400}>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#3eab00" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis domain={[1460, 1480]} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            <main>
              <button className="text-button">3 Bulan</button>
              <button className="text-button">6 Bulan</button>
              <button className="text-button">12 Bulan</button>
            </main>
            <div className="main-container">
              <button className="text-button">Beli Reksadana</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Reksadana
