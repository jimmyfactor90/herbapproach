import Link from "next/link";
import { FaCheckCircle, FaLeaf, FaShoppingBag, FaTruck } from "react-icons/fa";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center animate-fade-in">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="bg-white rounded-lg shadow-lg p-5 text-center">
              <div className="mb-4">
                <FaCheckCircle className="text-success display-1" />
              </div>
              
              <h1 className="fw-bold mb-3">Order Confirmed!</h1>
              <p className="text-muted mb-5 lead">
                Thank you for your purchase. We&apos;re getting your plants ready to ship!
              </p>

              <div className="bg-light p-4 rounded-lg mb-5 text-start">
                 <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Next Steps:</span>
                 </div>
                 <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="text-primary h5 m-0 pt-1"><FaLeaf /></div>
                    <div>
                       <h6 className="mb-0 fw-bold">Plant Processing</h6>
                       <p className="small text-muted m-0">Our nursery team is selecting the healthiest specimens for you.</p>
                    </div>
                 </div>
                 <div className="d-flex align-items-start gap-3">
                    <div className="text-primary h5 m-0 pt-1"><FaTruck /></div>
                    <div>
                       <h6 className="mb-0 fw-bold">Careful Packing</h6>
                       <p className="small text-muted m-0">Secure, sustainable packaging to ensure safety during transit.</p>
                    </div>
                 </div>
              </div>

              <div className="d-grid gap-3">
                <Link href="/dashboard/orders" className="btn btn-plant btn-lg py-3">
                  <FaShoppingBag className="me-2" /> View My Orders
                </Link>
                <Link href="/shop" className="btn btn-plant-outline btn-lg py-3">
                  Continue Shopping
                </Link>
              </div>

              <p className="mt-5 text-muted small">
                A confirmation email has been sent. Need help? <Link href="/contact" className="text-primary">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
