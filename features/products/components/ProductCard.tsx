"use client";

import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaEye, FaLeaf, FaSun, FaStar, FaWeightHanging } from "react-icons/fa";
import { formatPrice, calculateDiscount, getRatingStars } from "@/lib/utils";
import { CARE_LEVELS, SUNLIGHT_OPTIONS } from "@/lib/constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = calculateDiscount(product.price, product.comparePrice || 0);
  const careLevel = CARE_LEVELS.find((c) => c.value === product.careLevel);
  const sunlight = SUNLIGHT_OPTIONS.find((s) => s.value === product.sunlight);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        {discount > 0 && (
          <div className="badge-sale-flat">
            {discount}% OFF
          </div>
        )}
        {product.featured && !discount && (
          <div className="badge-featured-flat">
            TOP PICK
          </div>
        )}
      </div>

      <div className="wishlist-btn-absolute opacity-0 group-hover-opacity-100">
         <button className="btn btn-white btn-sm shadow-sm rounded-circle p-2">
            <FaHeart className="text-muted hover-text-danger" size={14} />
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
           <div className="stars-gold small d-flex text-accent">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
           </div>
           <span className="text-muted" style={{ fontSize: '0.7rem' }}>(24)</span>
        </div>

        {/* 4. Plant Metadata Tags (Clean like weight selection in ref) */}
        <div className="d-flex gap-2 mb-3">
           <div className="tag-pill">
              <FaLeaf size={10} className="me-1" /> {careLevel?.label || "Easy"}
           </div>
           <div className="tag-pill">
              <FaSun size={10} className="me-1" /> {sunlight?.label || "Indirect"}
           </div>
        </div>

        {/* 5. Pricing info */}
        <div className="price-container d-flex align-items-baseline gap-2 mb-3">
          <span className="current-price h5 fw-bold text-dark m-0">{formatPrice(product.price)}</span>
          {product.comparePrice > 0 && (
            <span className="text-muted small text-decoration-line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        {/* 6. Main CTA Button */}
        <button 
          onClick={handleAddToCart}
          className="btn btn-outline-primary-plant w-100 rounded-pill text-uppercase fw-bold small py-2 d-flex align-items-center justify-content-center gap-2"
        >
          <FaShoppingCart size={14} /> Add to Basket
        </button>
      </div>
    </div>
  );
}
