import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

const footerColumns = [
  { top: { name: "Flowers", href: "/shop?category=flowers" }, bottom: { name: "Flash Deals", href: "/shop?filter=flash" } },
  { top: { name: "CBD", href: "/shop?category=cbd" }, bottom: { name: "FAQ", href: "/faq" } },
  { top: { name: "Concentrates", href: "/shop?category=concentrates" }, bottom: { name: "Account", href: "/profile" } },
  { top: { name: "Edibles", href: "/shop?category=edibles" }, bottom: { name: "Topicals", href: "/shop?category=cbd-topicals" } },
  { top: { name: "Vapes", href: "/shop?category=vapes" }, bottom: { name: "Blog", href: "/blog" } },
];

export default function Footer() {
  return (
    <footer className="footer-light border-top">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-3 col-md-4">
            <Link href="/" className="text-decoration-none d-inline-block mb-3">
              <div className="d-flex flex-column lh-1">
                <span className="fw-900 fs-2 text-dark" style={{ letterSpacing: '-1px' }}>herb</span>
                <span className="fw-500 small text-dark" style={{ letterSpacing: '2px', marginTop: '-4px' }}>approach</span>
              </div>
            </Link>
            <p className="text-muted small mb-0">
              Copyright {new Date().getFullYear()} &copy; <strong className="text-dark">Herb Approach</strong>
            </p>
          </div>

          <div className="col-lg-6 col-md-8">
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
              {footerColumns.map((col, i) => (
                <div className="col" key={i}>
                  <Link href={col.top.href} className="d-block text-dark text-decoration-none small fw-500 mb-3 hover-text-primary">{col.top.name}</Link>
                  <Link href={col.bottom.href} className="d-block text-muted text-decoration-none small hover-text-primary">{col.bottom.name}</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-12">
            <p className="small mb-3">
              Sign up today &amp; get <span className="text-danger fw-bold">$25 OFF</span> your first purchase!
            </p>
            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Email" />
              <button className="btn btn-plant fw-bold" type="button">Subscribe</button>
            </div>
            <div className="d-flex gap-2">
              <a href="#" className="footer-social-icon"><FaFacebook size={14} /></a>
              <a href="#" className="footer-social-icon"><FaInstagram size={14} /></a>
              <a href="#" className="footer-social-icon"><FaTwitter size={14} /></a>
              <a href="mailto:hello@herbapproach.com" className="footer-social-icon"><FaEnvelope size={14} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
