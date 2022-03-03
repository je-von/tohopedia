import type { NextPage } from 'next'
import Layout from '../components/layout/Layout'

const Terms: NextPage = () => {
  return (
    <Layout>
      <div className="main-container">
        <div className="list-card-container">
          <h2>Terms and Conditions</h2>
          <p>
            Selamat datang di <b>tohopedia</b>. Syarat & ketentuan yang ditetapkan di bawah ini mengatur pemakaian jasa yang ditawarkan oleh PT.
            Tokopedia terkait penggunaan situs www.tokopedia.com. Pengguna disarankan membaca dengan seksama karena dapat berdampak kepada hak dan
            kewajiban Pengguna di bawah hukum. Dengan mendaftar dan/atau menggunakan situs www.tokopedia.com, maka pengguna dianggap telah membaca,
            mengerti, memahami dan menyetujui semua isi dalam Syarat & ketentuan. Syarat & ketentuan ini merupakan bentuk kesepakatan yang dituangkan
            dalam sebuah perjanjian yang sah antara Pengguna dengan PT.Tokopedia. Jika pengguna tidak menyetujui salah satu, pesebagian, atau seluruh
            isi Syarat & ketentuan, maka pengguna tidak diperkenankan menggunakan layanan di www.tokopedia.com.{' '}
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Terms
