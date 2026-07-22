"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/features/cart/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { FaLock, FaCreditCard, FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createOrder, updatePaymentStatus } from "@/features/orders/actions/order.actions";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(6, "Valid PIN code is required"),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE", "COD"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      paymentMethod: "RAZORPAY",
    },
  });

  const selectedPayment = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    setIsLoading(true);
    
    try {
      // 1. Create order in DB
      const order = await createOrder({
        items,
        shippingAddress: {
          fullName: data.fullName,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          phone: data.phone,
          email: data.email,
        },
        pricing: { subtotal, shipping, total },
        paymentMethod: data.paymentMethod,
      });

      // 2. Handle Payment
      if (data.paymentMethod === "RAZORPAY") {
        const res = await fetch("/api/payments/razorpay", {
          method: "POST",
          body: JSON.stringify({ amount: total, orderId: order.id }),
        });
        const rzpData = await res.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpData.amount,
          currency: "INR",
          name: "Herb Approach",
          description: `Order #${order.orderNumber}`,
          order_id: rzpData.id,
          handler: async function (response: any) {
            await updatePaymentStatus(order.id, response.razorpay_payment_id, "captured");
            clearCart();
            toast.success("Payment Successful!");
            router.push(`/orders/success?orderId=${order.id}`);
          },
          prefill: {
            name: data.fullName,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#2D6A4F" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.paymentMethod === "STRIPE") {
        const res = await fetch("/api/payments/stripe", {
          method: "POST",
          body: JSON.stringify({ items, orderId: order.id, total }),
        });
        const { url } = await res.json();
        window.location.href = url; // Redirect to Stripe
      } else {
        // COD
        clearCart();
        toast.success("Order placed successfully with COD!");
        router.push(`/orders/success?orderId=${order.id}`);
      }
      
    } catch (error: any) {
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-plant">
      <div className="row g-4">
        {/* Left Side: Shipping & Info */}
        <div className="col-lg-7">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Shipping Information
            </h5>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  placeholder="Roshan Kumar"
                  {...register("fullName")}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="+91 XXXXX XXXXX"
                  {...register("phone")}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
              </div>
              <div className="col-12">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className={`form-control ${errors.street ? "is-invalid" : ""}`}
                  placeholder="House No, Building, Area"
                  {...register("street")}
                />
                {errors.street && <div className="invalid-feedback">{errors.street.message}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  placeholder="New Delhi"
                  {...register("city")}
                />
                {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className={`form-control ${errors.state ? "is-invalid" : ""}`}
                  placeholder="Delhi"
                  {...register("state")}
                />
                {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">PIN Code</label>
                <input
                  type="text"
                  className={`form-control ${errors.postalCode ? "is-invalid" : ""}`}
                  placeholder="110001"
                  {...register("postalCode")}
                />
                {errors.postalCode && <div className="invalid-feedback">{errors.postalCode.message}</div>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaCreditCard className="text-primary" /> Payment Method
            </h5>
            
            <div className="payment-options">
              <div className={`p-3 border rounded-lg mb-3 cursor-pointer transition-base ${selectedPayment === 'RAZORPAY' ? 'border-primary bg-light' : ''}`}
                   onClick={() => register("paymentMethod").onChange({ target: { value: "RAZORPAY", name: "paymentMethod" } })}>
                <div className="form-check m-0">
                  <input className="form-check-input" type="radio" value="RAZORPAY" {...register("paymentMethod")} id="pay-razorpay" />
                  <label className="form-check-label fw-bold w-100 cursor-pointer" htmlFor="pay-razorpay">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Razorpay (UPI, Card, NetBanking)</span>
                      <img src="https://img.icons8.com/color/48/razorpay.png" height="24" />
                    </div>
                  </label>
                </div>
              </div>

              <div className={`p-3 border rounded-lg mb-3 cursor-pointer transition-base ${selectedPayment === 'STRIPE' ? 'border-primary bg-light' : ''}`}
                   onClick={() => register("paymentMethod").onChange({ target: { value: "STRIPE", name: "paymentMethod" } })}>
                <div className="form-check m-0">
                  <input className="form-check-input" type="radio" value="STRIPE" {...register("paymentMethod")} id="pay-stripe" />
                  <label className="form-check-label fw-bold w-100 cursor-pointer" htmlFor="pay-stripe">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Stripe (International Credit/Debit Card)</span>
                      <img src="https://img.icons8.com/color/48/stripe.png" height="24" />
                    </div>
                  </label>
                </div>
              </div>

              <div className={`p-3 border rounded-lg cursor-pointer transition-base ${selectedPayment === 'COD' ? 'border-primary bg-light' : ''}`}
                   onClick={() => register("paymentMethod").onChange({ target: { value: "COD", name: "paymentMethod" } })}>
                <div className="form-check m-0">
                  <input className="form-check-input" type="radio" value="COD" {...register("paymentMethod")} id="pay-cod" />
                  <label className="form-check-label fw-bold w-100 cursor-pointer" htmlFor="pay-cod">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Cash on Delivery (COD)</span>
                      <FaTruck />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Review */}
        <div className="col-lg-5">
           <div className="bg-white rounded-lg shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>
              
              <div className="checkout-items mb-4 overflow-auto" style={{ maxHeight: '300px' }}>
                {items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light">
                    <div className="position-relative">
                      <img src={item.image} className="rounded border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '0.6rem' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="small fw-bold mb-0">
                        {item.name}
                        {item.weight && <span className="text-muted fw-normal"> &middot; {item.weight}g</span>}
                      </h6>
                      <span className="text-muted small">{formatPrice(item.price)}</span>
                    </div>
                    <div className="fw-bold small">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-row d-flex justify-content-between mb-2 text-muted small">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row d-flex justify-content-between mb-4 text-muted small">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-success fw-bold" : ""}>
                   {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-4 h4 fw-bold border-top pt-3">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-plant btn-lg w-100 py-3 shadow-lg d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading || items.length === 0}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <FaLock size={16} /> Pay {formatPrice(total)}
                  </>
                )}
              </button>

              <p className="text-center text-muted small mt-3 mb-0">
                Guaranteed safe & secure checkout
              </p>
           </div>
        </div>
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </form>
  );
}
