import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import CheckoutForm from "@/features/payments/components/CheckoutForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function CheckoutPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <div className="bg-light pb-5 min-vh-100 animate-fade-in">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="display-6 fw-bold m-0">Secure Checkout</h1>
          <Link href="/cart" className="btn btn-link text-decoration-none d-flex align-items-center gap-2">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>

        <CheckoutForm user={session.user} />
      </div>
    </div>
  );
}
