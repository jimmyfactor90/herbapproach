"use client";

import Link from "next/link";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaLeaf } from "react-icons/fa";
import { useCartStore } from "@/features/cart/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="bg-light pb-5 min-vh-100 animate-fade-in">
      <div className="container py-5">
        <h1 className="display-6 fw-bold mb-5 flex align-items-center gap-3">
          <FaShoppingCart className="text-primary" /> Your Plant Basket
        </h1>

        {items.length > 0 ? (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0 small text-uppercase text-muted">Product</th>
                        <th className="py-3 border-0 small text-uppercase text-muted">Price</th>
                        <th className="py-3 border-0 small text-uppercase text-muted text-center">Quantity</th>
                        <th className="py-3 border-0 small text-uppercase text-muted text-end px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded border shadow-sm"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-1 fw-bold">
                                  <Link href={`/product/${item.slug}`} className="text-dark hover-text-primary text-decoration-none">
                                    {item.name}
                                  </Link>
                                  {item.weight && <span className="text-muted small fw-normal"> &middot; {item.weight}g</span>}
                                </h6>
                                <button
                                  className="btn btn-link link-danger p-0 small text-decoration-none d-flex align-items-center gap-1"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <FaTrash size={12} /> Remove
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 border-bottom">
                            <span className="fw-500">{formatPrice(item.price)}</span>
                          </td>
                          <td className="py-4 border-bottom text-center">
                            <div className="d-inline-flex align-items-center border rounded-pill overflow-hidden bg-light mx-auto">
                              <button
                                className="btn btn-link link-dark text-decoration-none px-2 py-0 border-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="px-2 fw-bold small">{item.quantity}</span>
                              <button
                                className="btn btn-link link-dark text-decoration-none px-2 py-0 border-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 border-bottom text-end px-4">
                            <span className="fw-bold">{formatPrice(item.price * item.quantity)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-light border-top">
                   <Link href="/shop" className="btn btn-link link-primary p-0 d-flex align-items-center gap-2 text-decoration-none fw-bold">
                      <FaArrowLeft /> Continue Shopping
                   </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                <h5 className="fw-bold mb-4">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Shipping Cost</span>
                  <span className={shipping === 0 ? "text-success fw-bold" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="alert alert-info py-2 small mb-4">
                    <FaLeaf className="me-2" /> Add <b>{formatPrice(999 - subtotal)}</b> more for <b>FREE Delivery</b>!
                  </div>
                )}

                <hr className="my-4" />

                <div className="d-flex justify-content-between mb-4 h4 fw-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <Link href="/checkout" className="btn btn-plant btn-lg w-100 py-3 shadow-lg">
                  Proceed to Checkout
                </Link>

                <div className="mt-4 text-center">
                   <img src="https://razorpay.com/assets/payment-gateway/payment-modes.png" className="img-fluid opacity-50" style={{ maxHeight: '25px' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-5 text-center">
            <div className="p-5">
              <FaShoppingCart size={80} className="text-light mb-4" />
              <h2 className="fw-bold">Your basket is empty</h2>
              <p className="text-muted mb-5 lead">Looks like you haven&apos;t picked any plants for your home yet.</p>
              <Link href="/shop" className="btn btn-plant btn-lg px-5">
                Browse Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
