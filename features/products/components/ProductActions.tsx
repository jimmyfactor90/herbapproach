"use client";

import { useState } from "react";
import { FaShoppingCart, FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { toast } from "react-hot-toast";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";

export default function ProductActions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));

  const variants: any[] = product.variants || [];
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(hasVariants ? variants[0].id : null);
  const selectedVariant = hasVariants ? variants.find((v) => v.id === selectedVariantId) : null;

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const activeWeight = selectedVariant ? selectedVariant.weight : product.weight;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;

  const discount = calculateDiscount(activePrice, activeComparePrice || 0);
  const wasPrice = activeComparePrice || activePrice;
  const savings = wasPrice - activePrice;

  const stockQty = product.inventory?.quantity || 0;

  const handleAddToCart = () => {
    addItem({
      id: activeSku,
      productId: product.id,
      variantId: selectedVariant?.id,
      weight: activeWeight || undefined,
      name: product.name,
      price: activePrice,
      image: product.mainImage,
      quantity,
      slug: product.slug,
    });
    toast.success(`Added ${quantity} ${product.name}${activeWeight ? ` (${activeWeight}g)` : ""} to your cart!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      slug: product.slug,
      category: product.category?.name,
    });
  };

  return (
    <div className="product-actions w-100">
      {/* Pricing - Herb Approach Style */}
      <div className="mb-4">
        <table className="pricing-table">
          <tbody>
            {activeComparePrice && activeComparePrice > activePrice ? (
              <>
                <tr>
                  <td className="pe-4 py-1 text-muted small fw-bold">Was:</td>
                  <td className="py-1 text-decoration-line-through text-muted">{formatPrice(activeComparePrice)}</td>
                </tr>
                <tr>
                  <td className="pe-4 py-1 text-muted small fw-bold">Promo Price:</td>
                  <td className="py-1 fw-bold h5 m-0">{formatPrice(activePrice)}</td>
                </tr>
                <tr>
                  <td className="pe-4 py-1 text-muted small fw-bold">You save:</td>
                  <td className="py-1 text-success fw-bold">
                    {formatPrice(savings)} ({discount}% OFF)
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="pe-4 py-1 text-muted small fw-bold">Price:</td>
                <td className="py-1 fw-bold h4 m-0">{formatPrice(activePrice)}</td>
              </tr>
            )}
            {activeWeight ? (
              <tr>
                <td className="pe-4 py-1 text-muted small fw-bold">Per Gram:</td>
                <td className="py-1 text-muted small">{formatPrice(activePrice / activeWeight)}/g</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Weight Selector */}
      {hasVariants && (
        <div className="mb-4">
          <label className="form-label small fw-bold text-uppercase mb-2">Select Weight</label>
          <div className="d-flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantId(v.id)}
                className={cn(
                  "btn btn-sm rounded-pill px-3 py-2 fw-bold",
                  selectedVariantId === v.id ? "btn-plant" : "btn-outline-secondary"
                )}
              >
                {v.weight}g
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Earn Points */}
      <div className="mb-3">
        <span className="small text-muted">
          Earn up to <strong className="text-primary">{Math.floor(activePrice * quantity)} Points</strong>.
        </span>
      </div>

      {/* Quantity + Stock Status */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="quantity-input-group d-flex align-items-center border rounded-pill overflow-hidden">
          <button
            className="btn btn-link link-dark text-decoration-none px-3 py-2 border-0 d-flex align-items-center"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <FaMinus size={12} />
          </button>
          <input
            type="number"
            className="form-control border-0 text-center fw-bold p-0"
            style={{ width: '50px', background: 'transparent' }}
            value={quantity}
            readOnly
          />
          <button
            className="btn btn-link link-dark text-decoration-none px-3 py-2 border-0 d-flex align-items-center"
            onClick={() => setQuantity(Math.min(stockQty || 99, quantity + 1))}
          >
            <FaPlus size={12} />
          </button>
        </div>
        <span className={`fw-bold small text-uppercase ${stockQty > 0 ? 'text-success' : 'text-danger'}`}>
          {stockQty > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
        </span>
      </div>

      {/* Add to Cart - Herb Approach Full-Width Style */}
      <button
        className="btn btn-plant w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-3 mb-3"
        style={{ fontSize: '1.1rem' }}
        onClick={handleAddToCart}
        disabled={stockQty === 0}
      >
        <span>ADD TO CART</span>
        <span className="opacity-50">|</span>
        <span>{formatPrice(activePrice * quantity)}</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={handleToggleWishlist}
        className={cn(
          "btn w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 small",
          isWishlisted ? "btn-danger" : "btn-outline-secondary"
        )}
      >
        <FaHeart size={14} /> {isWishlisted ? "IN WISHLIST" : "ADD TO WISHLIST"}
      </button>
    </div>
  );
}
