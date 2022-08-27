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
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">
            Pinterest
          </a>
          <a href="https://www.instagram.com/jevonlevin" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://play.google.com/" target="_blank" rel="noreferrer">
            Download on Play Store
          </a>
          <a href="https://apps.apple.com/" target="_blank" rel="noreferrer">
            Download on App Store
          </a>
          <Link href={links.openShop}>Open Shop</Link>
          <Link href={links.sellProduct}>Sell Products</Link>
          <Link href={links.terms}>Terms and Conditions</Link>
        </div>
      </div>
      <div className="right-content">
        <p>
          <b>Disclaimer</b>: This project was created for learning purposes. Anything that happens in this web application including the transaction process are not real and will
          not affect anything. Any sensitive information such as email and password credential are saved securely and will not be misused.
        </p>
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
