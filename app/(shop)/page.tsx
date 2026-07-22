import {
  getCachedCategories,
  getCachedFeaturedCategories,
  getCachedFeaturedProducts,
  getCachedHeroSlides,
} from "@/features/products/services/storefront-queries";
import ProductCard from "@/features/products/components/ProductCard";
import Link from "next/link";
import {
  FaTruck, FaShieldAlt, FaStar, FaLeaf, FaFlask, FaClock,
  FaFacebook, FaInstagram, FaTwitter, FaUserAlt, FaCheckCircle, FaHandshake, FaEnvelope
} from "react-icons/fa";

import HeroSlider from "@/features/shared/components/HeroSlider";
import ProductSlider from "@/features/products/components/ProductSlider";
import HoverPlayImage from "@/features/shared/components/HoverPlayImage";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featuredCategories, featuredProducts, heroSlides] = await Promise.all([
    getCachedCategories(),
    getCachedFeaturedCategories(),
    getCachedFeaturedProducts(8),
    getCachedHeroSlides(),
  ]);

  // Fall back to the first 5 categories if the admin hasn't marked any as featured yet.
  const homepageCategories = featuredCategories.length > 0 ? featuredCategories : categories.slice(0, 5);

  return (
    <div className="homepage-dispensary animate-fade-in">
      {/* 1. Dynamic Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* 3. Category Grid */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold m-0 h1">BUY WEED ONLINE</h2>
          </div>

          <div className="row row-cols-2 row-cols-lg-5 g-3">
            {homepageCategories.slice(0, 5).map((cat) => (
              <div key={cat.id} className="col">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="category-card-herb text-decoration-none text-dark"
                >
                  <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: "20px" }}>
                    <HoverPlayImage
                      src={cat.image || ""}
                      alt={cat.name}
                      style={{ height: "clamp(160px, 40vw, 380px)" }}
                    />
                    <div className="card-body py-3 text-center">
                      <h5 className="fw-bold m-0">{cat.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Featured Products (Herb Approach Listing Style Slider) */}
      <section className="py-5 bg-gray-50">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold h1 mb-2">Best Online Weed Dispensary</h2>
          </div>

          <div className="mb-5">
            <ProductSlider
              products={featuredProducts}
            />
          </div>

          <div className="text-center mt-5 pt-4">
            <Link href="/shop" className="btn btn-outline-primary-plant btn-lg rounded-pill px-5">View all</Link>
          </div>
        </div>
      </section>

      {/* 5. Membership Banner (Full Width) */}
      <section className="py-0 overflow-hidden w-100">
        <Link href="/register" className="d-block w-100 text-decoration-none p-0 m-0">
          <div
            className="membership-banner w-100"
            style={{
              backgroundImage: `url('/assets/banners/become_a_member-banner-2048x410.jpg')`,
              backgroundSize: '100% auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '2048 / 410',
              width: '100%',
              cursor: 'pointer'
            }}
          >
          </div>
        </Link>
      </section>

      {/* 6. Canada's Online Dispensary - SEO Block */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-900 display-5 text-uppercase tracking-tighter mb-4">CANADA&apos;S ONLINE MARIJUANA DISPENSARY</h2>
            <div className="mx-auto" style={{ maxWidth: '900px' }}>
              <p className="text-muted mb-4 text-start">
                Herb Approach is the best Online Dispensary in Canada that specializes in Mail Order Marijuana so that you can buy weed online easily from the comfort of your own home!
              </p>
              <p className="text-muted text-start">
                The Herb Approach is all about the holistic health and natural healing through medicinal cannabis and quality cannabis products. We are dedicated to provide you with carefully crafted and top quality medical marijuana products through a wide selection of our Cannabis Strains, Edibles, Concentrates, Tinctures, CBD Oil products, and more. We hold our suppliers to the highest level of standard when it comes to buying weed online in Canada so you can rest assured that you are receiving the highest quality marijuana. All orders are provided with a tracking number when you order weed online, we also offer an excellent customer support system as well as shipping insurance that guarantees for your package to arrive to your destination. Our professional commerce system makes it fast and safe for you to add products in the cart to order weed.
              </p>
            </div>
          </div>

          {/* 7. The Six Pillars of Trust */}
          <div className="row g-5 py-5 text-center">
            {[
              { title: "SERVICE", desc: "Customer satisfaction is our number one priority and we work around the clock to ensure that you have a pleasant user experience to buy weed online.", icon: FaUserAlt },
              { title: "QUALITY", desc: "We hold our suppliers to the highest level of standard that they must adhere to in order to provide our members the highest level of satisfaction.", icon: FaCheckCircle },
              { title: "TRUST", desc: "Over 15 years of industry experience from our team of professionals, and thousands of non-biased reviews you can rely on.", icon: FaHandshake },
              { title: "SECURITY", desc: "Membership information is securely and privately stored in an industry-standard compliant database.", icon: FaShieldAlt },
              { title: "DELIVERY", desc: "Undetectable and discreet packaging enables you to shop with Herb Approach in complete confidence.", icon: FaTruck },
              { title: "COMPLIANCE", desc: "Canadians with a medical need can gain access to quality controlled marijuana through becoming a member of Herb Approach.", icon: FaFlask },
            ].map((pillar, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="px-3">
                  <div className="text-primary mb-3"><pillar.icon size={48} /> <span className="h4 fw-bold ms-3">{pillar.title}</span> </div>
                  <p className="text-muted small lh-lg">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ONLINE DISPENSARY */}
      <section className="py-4">
        <div className="container">
          <Link href="/shop" className="d-block overflow-hidden rounded-lg shadow-sm hover-scale transition-all">
            <img 
              src="/assets/banners/Super-Boof-1536x307.jpg" 
              className="w-100 h-auto" 
              alt="Online Dispensary Banner" 
            />
          </Link>
        </div>
      </section>



      {/* 9. Online Dispensary Canada - Instruction Block */}
      <section className="py-5 bg-white border-top">
        <div className="container py-5">
          <h2 className="fw-900 display-5 text-center text-uppercase tracking-tighter mb-5">ONLINE DISPENSARY CANADA</h2>
          <div className="mx-auto mb-5 text-muted text-center" style={{ maxWidth: '900px' }}>
            <p>Ordering Marijuana Online, Cannabis Concentrates, Edibles, and Tinctures has never been easier. After registering an account, simply add your products in the cart and complete the check-out process!</p>
            <p>We offer the lowest prices online when it comes to buying weed and our customer service platform is there for you anytime you need additional help! Herb Approach is your one stop shop for all quality cannabis.</p>
          </div>

          <div className="row g-4 text-start">
            {[
              { n: "1. REGISTER", d: "Start by registering on our website. It’s really simple. Register here.", l: "/register" },
              { n: "2. SHOP", d: "Browse our selection from Canada’s Top Producers. Find all the best weekly deals for top quality medicinal cannabis.", l: "/shop" },
              { n: "3. MAKE PAYMENT", d: "Pay for your order using Interac Email Money Transfer or Bitcoins. Payment Instructions are shown at the checkout screen.", l: "/checkout" },
              { n: "4. TRACK ORDER", d: "You can easily track your order online at anytime. Once your payment has been confirmed you will receive an email with your tracking number.", l: "/orders" }
            ].map((step, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <h5 className="fw-bold mb-4">{step.n}</h5>
                <p className="text-muted small">{step.d}</p>
                {step.l && <Link href={step.l} className="text-primary fw-bold text-decoration-none">Go to {step.n.split('. ')[1]}</Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Refer a Friend Banner * */}
      <section className="py-0 overflow-hidden">
        <div
          className="membership-banner position-relative overflow-hidden py-5 pt-10 pb-10 text-center text-white"
          style={{
              backgroundImage: `url('/assets/banners/REFER-A-FRIEND-1-2048x410.webp')`,
              backgroundSize: '100% auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '2048 / 410',
              width: '100%',
              cursor: 'pointer'
          
          }}
        >
          <div className="hero-overlay-dark opacity-40"></div>
          
        </div>
      </section>

      {/* 10. Mail Order Marijuana Section */}
      <section className="py-5 bg-light border-top">
        <div className="container py-5">
          <h2 className="fw-900 display-5 text-center text-uppercase tracking-tighter mb-5">MAIL ORDER MARIJUANA</h2>
          <p className="text-center text-muted mb-5 small">If this is your first experience with Mail Order Marijuana, here are some reasons to Buy Weed Online Canada from Herb Approach:</p>

          <div className="row g-0 border-top border-bottom py-5">
            {[
              { t: "PREMIUM GRADE BC BUD", d: "Finest quality cannabis grown by expert cultivators in British Columbia." },
              { t: "SAFE AND DISCREET CANNABIS MAIL ORDERS", d: "Vacuum-sealed odorless packaging ensures complete privacy for your delivery." },
              { t: "BEST PRICES ONLINE", d: "We work directly with producers to offer wholesale prices to our members." },
              { t: "EXCEPTIONAL CUSTOMER SERVICE SUPPORT", d: "Our team is available 24/7 to help you with your order and questions." }
            ].map((col, i) => (
              <div key={i} className="col-lg-3 col-md-6 mail-order-col px-4">
                <h6 className="fw-bold mb-3">{col.t}</h6>
                <p className="text-muted extra-small">{col.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 text-muted extra-small">
            Sign up today if you would like to buy weed online Canada through Herb Approach and explore the many benefits of medical marijuana.
          </div>
        </div>
      </section>

      {/* 11. Cannabis Plant Types */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-5 text-center">
          <h2 className="fw-900 display-4 text-dark text-uppercase tracking-tighter mb-5">CANNABIS PLANT TYPES</h2>

          <div className="row g-5 mt-4">
            {/* INDICA */}
            <div className="col-lg-4">
              <div className="d-flex flex-column align-items-center">
                <img src="/assets/plant-types/icon-indica.webp" className="mb-4" style={{ height: '120px', objectFit: 'contain' }} alt="Indica" />
                <h3 className="fw-900 mb-4 tracking-widest text-uppercase">INDICA</h3>
                <div className="small text-muted mb-5 px-3 lh-base">
                  <p>The Indica strain is characterized by its short and stubby leaves. It features a short flowering time and prefers colder climates.</p>
                  <p>Indica&apos;s are well known for their relaxing properties. Users often prefer Indica cannabis products for nighttime use, easing muscle tension, relieving stress, depression and chronic pain and insomnia.</p>
                </div>
                <Link href="/shop?type=indica" className="btn btn-lg rounded-pill px-5 fw-bold text-white shadow-sm" style={{ backgroundColor: '#00a63d' }}>SHOP INDICA</Link>
              </div>
            </div>

            {/* HYBRID */}
            <div className="col-lg-4">
              <div className="d-flex flex-column align-items-center hybrid-divider">
                <img src="/assets/plant-types/icon-HYBRID.webp" className="mb-4" style={{ height: '120px', objectFit: 'contain' }} alt="Hybrid" />
                <h3 className="fw-900 mb-4 tracking-widest text-uppercase">HYBRID</h3>
                <div className="small text-muted mb-5 px-3 lh-base">
                  <p>Hybrid strains are designed with balance in mind. They feature the best aspects of Sativa&apos;s and Indica&apos;s.</p>
                  <p>Hybrids are high-quality cannabis strains with a wide range of effects and benefits. By selectively interbreeding strains, patients are able to purchase strains tailored to their specific needs.</p>
                </div>
                <Link href="/shop?type=hybrid" className="btn btn-lg rounded-pill px-5 fw-bold text-white shadow-sm" style={{ backgroundColor: '#006837' }}>SHOP HYBRID</Link>
              </div>
            </div>

            {/* SATIVA */}
            <div className="col-lg-4">
              <div className="d-flex flex-column align-items-center">
                <img src="/assets/plant-types/icon-sativa.webp" className="mb-4" style={{ height: '120px', objectFit: 'contain' }} alt="Sativa" />
                <h3 className="fw-900 mb-4 tracking-widest text-uppercase">SATIVA</h3>
                <div className="small text-muted mb-5 px-3 lh-base">
                  <p>The Sativa strain is taller than it&apos;s Indica counterpart and boasts thinner leaves. Sativa&apos;s grow tall and thrive in warm climates.</p>
                  <p>Sativa&apos;s are mentally stimulating. Marijuana products containing Sativa produce a cerebral high that alleviates depression, anxiety, mood disorders, fatigue as well as elevating moods.</p>
                </div>
                <Link href="/shop?type=sativa" className="btn btn-lg rounded-pill px-5 fw-bold text-white shadow-sm" style={{ backgroundColor: '#8dc63f' }}>SHOP SATIVA</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Quality and Privacy Assurance */}
      <section className="py-5 bg-white border-top">
        <div className="container py-5">
          <h2 className="fw-900 h2 text-center text-dark text-uppercase tracking-tighter mb-5 mt-4">QUALITY AND PRIVACY ASSURANCE</h2>

          <div className="row g-5 mt-2">
            {/* MISSION */}
            <div className="col-lg-4">
              <h6 className="fw-900 mb-4 text-dark text-uppercase small tracking-widest">MISSION</h6>
              <p className="text-muted small lh-lg">
                The Canadian Cannabis market is in constant flux, that&apos;s why at Herb Approach our mission is simple; provide patients with high-quality Medical Marijuana. With over 30 years combined in the cannabis industry, our team is well suited for delivering on this promise. From coast to coast, we pride ourselves on being at the forefront of Online Marijuana sales and cannabis news.
              </p>
            </div>

            {/* PRIVACY GUARANTEE */}
            <div className="col-lg-4">
              <h6 className="fw-900 mb-4 text-dark text-uppercase small tracking-widest">PRIVACY GUARANTEE</h6>
              <p className="text-muted small lh-lg">
                We understand privacy is of the utmost importance, for this reason, we&apos;ve dedicated an entire team to privacy and security. When it comes to privacy, there&apos;s no such thing as a day off. Our team works around the clock to ensure private information is collected and wiped out daily.
              </p>
            </div>

            {/* COAST TO COAST SERVICE */}
            <div className="col-lg-4">
              <h6 className="fw-900 mb-4 text-dark text-uppercase small tracking-widest">COAST TO COAST SERVICE</h6>
              <div className="text-muted small lh-lg">
                <p className="mb-4">Trust is key when dealing with a Marijuana dispensary. Hence why we focus on creating the best experience possible for consumers, from Coast to Coast.</p>
                <p>At Herb Approach, our clients and their satisfaction is the top priority.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. High Impact Flash Deals Banner */}
      <section className="py-0 overflow-hidden w-100">
        <Link href="/shop?category=flash-deals" className="d-block w-100 text-decoration-none p-0 m-0">
          <div
            className="flash-deals-banner w-100"
            style={{
              backgroundImage: `url('/assets/banners/Flash-Deals-Banner-Homepage-desktop-2048x410.jpg')`,
              backgroundSize: '100% auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '2048 / 410',
              width: '100%',
              cursor: 'pointer'
            }}
          >
          </div>
        </Link>
      </section>

      {/* 14. What is Cannabis? SEO Section */}
      <section className="py-5 bg-light border-top">
        <div className="container py-5 text-center">
          <h2 className="fw-900 display-5 text-uppercase tracking-tighter mb-5">WHAT IS CANNABIS?</h2>
          <div className="mx-auto text-muted text-start" style={{ maxWidth: '900px' }}>
            <p className="mb-4">Cannabis, also known as marijuana, is a plant that has been used for centuries for both medicinal and recreational purposes. It contains chemical compounds called cannabinoids, the most well-known being THC (tetrahydrocannabinol) and CBD (cannabidiol).</p>
            <p className="mb-4">At Herb Approach, we believe in the healing power of cannabis and are committed to providing our customers with the best possible products. Whether you are looking for relief from pain, anxiety, or insomnia, or simply want to relax and enjoy the benefits of this amazing plant, we have something for everyone.</p>
            <p>Our goal is to make it easy and safe for Canadians to buy weed online. With our secure checkout process, discreet shipping, and top-quality products, you can shop with confidence at Herb Approach.</p>
          </div>
        </div>
      </section>


    </div>
  );
}
