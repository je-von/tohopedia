import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className="footer-container">
      <div>
        <h4>Tohopedia</h4>
        <Link href="#">About Tohopedia</Link>
      </div>
      <div className="right-content">
        <div className="footer-img">
          <Image src="/asset/footer.jpg" alt="" layout="fill" objectFit="contain"></Image>
        </div>
        <p>&copy; 2022 tohopedia by JV</p>
        <div className="translate-button">
          <button className="text-button">Indonesia</button>
          <button className="text-button">English</button>
        </div>
      </div>
    </div>
  )
}
