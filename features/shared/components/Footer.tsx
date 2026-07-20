import Link from "next/link";
import { FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-plant">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link href="/" className="footer-brand text-decoration-none">
              <FaLeaf /> Herb Approach
            </Link>
            <p className="footer-desc">
              Canada&apos;s most trusted online dispensary for premium cannabis products. 
              Delivered safely and discreetly to your door.
            </p>
            <div className="footer-social mt-4">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Shop</h5>
            <ul className="footer-links">
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop?category=flowers">Cannabis Flowers</Link></li>
              <li><Link href="/shop?category=edibles">Edibles</Link></li>
              <li><Link href="/shop?category=concentrates">Concentrates</Link></li>
              <li><Link href="/shop?filter=new">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/shipping">Shipping Policy</Link></li>
              <li><Link href="/tracking">Track My Order</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="footer-heading">Newsletter</h5>
            <p className="footer-desc mb-3">
              Subscribe to get special offers, exclusive deals, and new product alerts.
            </p>
            <div className="footer-newsletter">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                />
                <button className="btn btn-plant" type="button">
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} Herb Approach Dispensary. All rights reserved.</p>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links justify-content-center justify-content-md-end">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
