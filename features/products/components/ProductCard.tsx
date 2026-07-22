"use client";

import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaEye, FaCannabis, FaTint, FaStar, FaWeightHanging } from "react-icons/fa";
import { formatPrice, calculateDiscount, getRatingStars } from "@/lib/utils";
import { STRAIN_TYPES, POTENCY_LEVELS } from "@/lib/constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const discount = calculateDiscount(product.price, product.comparePrice || 0);
  const strainType = STRAIN_TYPES.find((s) => s.value === product.strainType);
  const potency = POTENCY_LEVELS.find((p) => p.value === product.potency);

  const reviews: { rating: number }[] = product.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
  const ratingStars = getRatingStars(avgRating);

  const inStock = (product.inventory?.quantity ?? 0) > 0;
  const pricePerGram = product.weight ? product.price / product.weight : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      id: product.sku,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: 1,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card-premium h-100 bg-white border border-gray-200 rounded-lg overflow-hidden position-relative animate-fade-in group">
      {/* 1. Badge Overlay */}
      <div className="product-badges-top">
        {!inStock && (
          <div className="badge-sale-flat bg-secondary">
            OUT OF STOCK
          </div>
        )}
        {inStock && discount > 0 && (
          <div className="badge-sale-flat">
            {discount}% OFF
          </div>
        )}
        {inStock && product.featured && !discount && (
          <div className="badge-featured-flat">
            TOP PICK
          </div>
        )}
      </div>

      <div className={cn("wishlist-btn-absolute", !isWishlisted && "opacity-0 group-hover-opacity-100")}>
         <button
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             toggleWishlist({
               id: product.id,
               name: product.name,
               price: product.price,
               image: product.mainImage,
               slug: product.slug,
               category: product.category?.name,
             });
           }}
           className="btn btn-white btn-sm shadow-sm rounded-circle p-2"
         >
            <FaHeart className={isWishlisted ? "text-danger" : "text-muted hover-text-danger"} size={14} />
         </button>
      </div>

      {/* 2. Product Image */}
      <Link href={`/product/${product.slug}`} className="d-block product-card-image-wrap p-3">
        <div className="position-relative w-100" style={{ aspectRatio: '1/1' }}>
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 280px"
            className="rounded transition-transform group-hover-scale"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </Link>

      <div className="product-card-body p-3 pt-0">
        <div className="text-uppercase text-muted extra-small fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>
          {product.category.name}
        </div>
        
        <h6 className="product-card-title fw-bold text-dark mb-2">
          <Link href={`/product/${product.slug}`} className="text-decoration-none text-dark hover-text-primary">
            {product.name}
          </Link>
        </h6>

        {/* 3. Rating Row */}
        <div className="d-flex align-items-center gap-1 mb-2">
          {reviewCount > 0 ? (
            <>
              <div className="stars-gold small d-flex text-accent">
                {ratingStars.map((star, i) => (
                  <FaStar key={i} style={{ opacity: star === "empty" ? 0.25 : 1 }} />
                ))}
              </div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>({reviewCount})</span>
            </>
          ) : (
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>No reviews yet</span>
          )}
        </div>

        {/* 4. Strain Metadata Tags */}
        <div className="d-flex gap-2 mb-3">
           <div className="tag-pill">
              <FaCannabis size={10} className="me-1" /> {strainType?.label || "Hybrid"}
           </div>
           <div className="tag-pill">
              <FaTint size={10} className="me-1" /> {potency?.label || "Balanced 1:1"}
           </div>
        </div>

        {/* 5. Pricing info */}
        <div className="price-container d-flex align-items-baseline gap-2 mb-1">
          <span className="current-price h5 fw-bold text-dark m-0">{formatPrice(product.price)}</span>
          {product.comparePrice > 0 && (
            <span className="text-muted small text-decoration-line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        <div className="text-muted extra-small mb-3">
          {pricePerGram ? <>{formatPrice(pricePerGram)}/g &middot; {product.weight}g</> : " "}
        </div>

        {/* 6. Main CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="btn btn-outline-primary-plant w-100 rounded-pill text-uppercase fw-bold small py-2 d-flex align-items-center justify-content-center gap-2"
        >
          <FaShoppingCart size={14} /> {inStock ? "Add to Basket" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
