import Header from "@/features/shared/components/Header";
import Footer from "@/features/shared/components/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-vh-100">
        {children}
      </div>
      <Footer />
    </>
  );
}
