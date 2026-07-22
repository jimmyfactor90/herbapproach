"use client";

import Link from "next/link";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items: wishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: (typeof wishlist)[number]) => {
    addToCart({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      slug: item.slug,
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (!mounted) return null;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="display-5 fw-bold m-0">My Wishlist</h1>
          <Link href="/shop" className="btn btn-link text-decoration-none d-flex align-items-center gap-2">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 border-0 small text-uppercase text-muted">Product</th>
                    <th className="py-3 border-0 small text-uppercase text-muted">Price</th>
                    <th className="py-3 border-0 small text-uppercase text-muted">Stock Status</th>
                    <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 border-0">
                        <div className="d-flex align-items-center gap-3">
                          <img src={item.image} className="rounded border" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                          <div>
                            <h6 className="fw-bold mb-1">{item.name}</h6>
                            <span className="text-muted extra-small text-uppercase">{item.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 border-0">
                        <span className="fw-bold text-primary">{formatPrice(item.price)}</span>
                      </td>
                      <td className="py-4 border-0">
                        <span className="badge bg-success-light text-success px-3 py-2 rounded-pill small">In Stock</span>
                      </td>
                      <td className="px-4 py-4 border-0 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                          >
                            <FaShoppingCart size={12} /> Add to Cart
                          </button>
                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-2"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-lg shadow-sm">
            <div className="mb-4 text-muted opacity-25">
              <FaHeart size={80} />
            </div>
            <h3 className="fw-bold">Your wishlist is empty</h3>
            <p className="text-muted mb-4">Save items you love to find them easily later.</p>
            <Link href="/shop" className="btn btn-plant btn-lg px-5">Go to Shop</Link>
          </div>
        )}
      </div>
    </div>
  );
}
