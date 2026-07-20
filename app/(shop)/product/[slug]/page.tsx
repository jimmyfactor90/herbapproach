import { getCachedProductBySlug, getCachedShopProducts } from "@/features/products/services/storefront-queries";
import { notFound } from "next/navigation";
import {
  FaStar, FaCheckCircle, FaFacebook, FaTwitter,
  FaInstagram, FaPinterest, FaEnvelope, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "@/features/products/components/ProductCard";
import ProductActions from "@/features/products/components/ProductActions";
import ProductGallery from "@/features/products/components/ProductGallery";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getCachedShopProducts({
    category: product.category.slug,
    pageSize: 4
  });

  const discount = calculateDiscount(product.price, product.comparePrice || 0);
  const wasPrice = product.comparePrice || product.price;
  const savings = wasPrice - product.price;

  return (
    <div className="bg-white pb-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small m-0 fw-bold text-uppercase">
              <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/shop" className="text-decoration-none text-muted">Shop</Link></li>
              <li className="breadcrumb-item"><Link href={`/shop?category=${product.category.slug}`} className="text-decoration-none text-muted">{product.category.name}</Link></li>
              <li className="breadcrumb-item active text-dark" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left: Image Gallery */}
          <div className="col-lg-5">
            <div className="product-gallery position-relative">
              {/* Discount Badge */}
              {discount > 0 && (
                <span
                  className="badge rounded-pill position-absolute top-0 start-0 m-3 z-2 px-3 py-2 fw-bold"
                  style={{ backgroundColor: '#2d6a2e', color: 'white', fontSize: '0.85rem' }}
                >
                  {discount}% OFF
                </span>
              )}

              <ProductGallery
                mainImage={product.mainImage}
                images={product.images}
                productName={product.name}
              />

              {/* Social Sharing */}
              <div className="d-flex gap-3 mt-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaEnvelope].map((Icon, i) => (
                  <button key={i} className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>

              {/* Categories Tags */}
              <div className="mt-3">
                <span className="small text-muted">Categories: </span>
                <Link href={`/shop?category=${product.category.slug}`} className="small text-primary text-decoration-none fw-bold">
                  {product.category.name}
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="col-lg-7">
            <h1 className="h3 fw-900 text-uppercase mb-3" style={{ letterSpacing: '-0.5px' }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Reviews */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill fw-bold small">Review:</span>
              <div className="text-warning d-flex gap-1">
                {[1, 2, 3, 4, 5].map(s => <FaStar key={s} size={16} />)}
              </div>
            </div>

            <hr />

            {/* Pricing - Herb Approach Style */}
            <div className="mb-4">
              <table className="pricing-table">
                <tbody>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <tr>
                        <td className="pe-4 py-1 text-muted small fw-bold">Was:</td>
                        <td className="py-1 text-decoration-line-through text-muted">{formatPrice(product.comparePrice)}</td>
                      </tr>
                      <tr>
                        <td className="pe-4 py-1 text-muted small fw-bold">Promo Price:</td>
                        <td className="py-1 fw-bold h5 m-0">{formatPrice(product.price)}</td>
                      </tr>
                      <tr>
                        <td className="pe-4 py-1 text-muted small fw-bold">You save:</td>
                        <td className="py-1 text-success fw-bold">
                          {formatPrice(savings)} ({discount}% OFF)
                        </td>
                      </tr>
                    </>
                  )}
                  {(!product.comparePrice || product.comparePrice <= product.price) && (
                    <tr>
                      <td className="pe-4 py-1 text-muted small fw-bold">Price:</td>
                      <td className="py-1 fw-bold h4 m-0">{formatPrice(product.price)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <hr />

            {/* Product Actions (Quantity, Add to Cart) */}
            <ProductActions product={product} />

            <hr className="mt-4" />

            {/* Short Description */}
            <div className="mt-3">
              <p className="text-muted small mb-2" style={{ lineHeight: '1.8' }}>
                <strong className="text-dark">{product.name}</strong> {product.description?.substring(0, 200)}
                {product.description && product.description.length > 200 && '...'}
              </p>
              <a href="#product-description" className="text-primary fw-bold small text-decoration-none">Learn more</a>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCheckCircle className="text-success" size={14} />
                <span className="small">Free Xpresspost shipping on orders over $150</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" size={14} />
                <span className="small">Discreet vacuum-sealed packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div id="product-description" className="bg-light border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex border rounded-pill overflow-hidden">
              <button className="btn btn-plant px-4 py-2 fw-bold rounded-0 text-uppercase small" data-bs-toggle="tab" data-bs-target="#tab-description">
                Description
              </button>
              <button className="btn btn-outline-dark border-0 px-4 py-2 fw-bold rounded-0 text-uppercase small" data-bs-toggle="tab" data-bs-target="#tab-specification">
                Specification
              </button>
              <button className="btn btn-outline-dark border-0 px-4 py-2 fw-bold rounded-0 text-uppercase small" data-bs-toggle="tab" data-bs-target="#tab-reviews">
                Reviews (12)
              </button>
              <button className="btn btn-outline-dark border-0 px-4 py-2 fw-bold rounded-0 text-uppercase small" data-bs-toggle="tab" data-bs-target="#tab-refer">
                Refer a Friend
              </button>
            </div>
          </div>

          <div className="tab-content">
            {/* Description Tab */}
            <div className="tab-pane fade show active" id="tab-description">
              <div className="mx-auto" style={{ maxWidth: '850px' }}>
                <h3 className="fw-900 mb-4">{product.name}</h3>
                <div className="text-muted" style={{ lineHeight: '1.9' }}>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>

            {/* Specification Tab */}
            <div className="tab-pane fade" id="tab-specification">
              <div className="mx-auto" style={{ maxWidth: '850px' }}>
                <h3 className="fw-900 mb-4">Product Specifications</h3>
                <table className="table">
                  <tbody>
                    <tr><td className="fw-bold">SKU</td><td>{product.sku}</td></tr>
                    <tr><td className="fw-bold">Category</td><td>{product.category.name}</td></tr>
                    <tr><td className="fw-bold">Weight</td><td>{product.weight ? `${product.weight}g` : 'N/A'}</td></tr>
                    <tr><td className="fw-bold">Stock</td><td>{product.inventory?.quantity || 0} units</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviews Tab */}
            <div className="tab-pane fade" id="tab-reviews">
              <div className="mx-auto text-center py-5" style={{ maxWidth: '850px' }}>
                <h3 className="fw-900 mb-3">Customer Reviews</h3>
                <p className="text-muted">No reviews yet. Be the first to review this product!</p>
              </div>
            </div>

            {/* Refer Tab */}
            <div className="tab-pane fade" id="tab-refer">
              <div className="mx-auto text-center py-5" style={{ maxWidth: '850px' }}>
                <h3 className="fw-900 mb-3">Refer a Friend</h3>
                <p className="text-muted mb-4">Share this product with a friend and both of you will earn $25 in store credit!</p>
                <Link href="/register" className="btn btn-secondary btn-lg rounded-pill px-5 fw-bold">Refer Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MORE ITEMS TO CONSIDER */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-900 display-6 text-uppercase tracking-tighter">MORE ITEMS TO CONSIDER</h2>
          {/* Category Pills */}
          <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="btn btn-plant btn-sm rounded-pill px-4 py-2 fw-bold text-uppercase"
            >
              {product.category.name}
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {relatedProducts.products.filter((p: any) => p.id !== product.id).slice(0, 4).map((rp: any) => (
            <div key={rp.id} className="col-xl-3 col-lg-4 col-md-6 col-6">
              <ProductCard product={rp} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
