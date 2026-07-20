"use client";

import { useState } from "react";
import { FaShoppingCart, FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

export default function ProductActions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.sku,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: quantity,
      slug: product.slug,
    });
    toast.success(`Added ${quantity} ${product.name} to your cart!`);
  };

  const stockQty = product.inventory?.quantity || 0;

  return (
    <div className="product-actions w-100">
      {/* Earn Points */}
      <div className="mb-3">
        <span className="small text-muted">
          Earn up to <strong className="text-primary">{Math.floor(product.price)} Points</strong>.
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
        <span>{formatPrice(product.price * quantity)}</span>
      </button>

      {/* Wishlist */}
      <button className="btn btn-outline-secondary w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 small">
        <FaHeart size={14} /> ADD TO WISHLIST
      </button>
    </div>
  );
}
