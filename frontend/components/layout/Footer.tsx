import Image from 'next/image'
import Link from 'next/link'
import { links } from '../../util/route-links'

export default function Footer() {
  return (
    <div className="footer-container">
      <div>
        <h4>Tohopedia</h4>
        <div className="footer-links">
          <Link href={links.about}>About Tohopedia</Link>
          <a href="https://www.facebook.com/tokopedia" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.twitter.com/tokopedia" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a href="https://www.pinterest.com/tokopedia" target="_blank" rel="noreferrer">
            Pinterest
          </a>
          <a href="https://www.instagram.com/tokopedia" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.tokopedia.tkpd&hl=en" target="_blank" rel="noreferrer">
            Download on Play Store
          </a>
          <a href="https://apps.apple.com/id/app/tokopedia/id1001394201" target="_blank" rel="noreferrer">
            Download on App Store
          </a>
          <Link href={links.openShop}>Open Shop</Link>
          <Link href={links.sellProduct}>Sell Products</Link>
          <Link href={links.terms}>Terms and Conditions</Link>
        </div>
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
