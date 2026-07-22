import Header from "@/features/shared/components/Header";
import Footer from "@/features/shared/components/Footer";
import { getCachedCategoryTree } from "@/features/products/services/storefront-queries";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCachedCategoryTree();

  return (
    <>
      <Header categories={categories} />
      <div className="min-vh-100">
        {children}
      </div>
      <Footer />
    </>
  );
}
