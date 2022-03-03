import type { NextPage } from 'next'
import Layout from '../components/layout/Layout'

const About: NextPage = () => {
  return (
    <Layout>
      <div className="main-container">
        <div className="list-card-container">
          <h2>About Tohopedia</h2>
          <p>
            Tokopedia adalah perusahaan teknologi Indonesia dengan misi mencapai pemerataan ekonomi secara digital.Saat pandemi, Tokopedia mendorong
            para pelaku UMKM untuk dapat bertahan, bangkit, dan mengembangkan bisnisnya melalui adopsi digital. 7 dari 10 pelaku usaha mengalami
            lonjakan volume penjualan seiring dengan beralihnya pergeseran penjualan secara daring melalui kanal Tokopedia. Kemudahan dalam mengelola
            bisnis merupakan alasan utama bagi sebagian besar penjual yang bergabung bersama Tokopedia. Tokopedia turut mendorong adopsi metode
            pembayaran digital. E-wallet dan mobile/internet banking adalah dua produk keuangan yang paling banyak dipilih selama pandemi.
          </p>
          <p></p>
        </div>
      </div>
    </Layout>
  )
}

export default About
