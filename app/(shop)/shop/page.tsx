import { getCachedCategories, getCachedShopProducts } from "@/features/products/services/storefront-queries";
import ProductCard from "@/features/products/components/ProductCard";
import HorizontalFilterBar from "@/features/products/components/HorizontalFilterBar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    strainType?: string;
    potency?: string;
    minPrice?: string;
    maxPrice?: string;
    weight?: string;
    inStock?: string;
    onSale?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const [categories, shopData] = await Promise.all([
    getCachedCategories(),
    getCachedShopProducts({
      category: params.category,
      strainType: params.strainType,
      potency: params.potency,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      weight: params.weight ? parseFloat(params.weight) : undefined,
      inStock: params.inStock === "true",
      onSale: params.onSale === "true",
      sort: params.sort as any,
      page: params.page ? parseInt(params.page) : 1,
    }),
  ]);

  const { products, pagination } = shopData;
  const currentCategory = categories.find(c => c.slug === params.category);

  const pageHref = (page: number) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") qs.set(key, value);
    });
    qs.set("page", page.toString());
    return `/shop?${qs.toString()}`;
  };

  return (
    <div className="bg-gray-50 min-vh-100 pb-5">
      {/* Page Title */}
      <div className="bg-white pt-4 pb-2">
        <div className="container text-center">
          <h1 className="fw-900 h2 m-0">{currentCategory ? currentCategory.name : "All Products"}</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-bottom py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small m-0 p-0 bg-transparent text-uppercase">
              <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/shop" className="text-decoration-none text-muted">Shop</Link></li>
              {currentCategory && <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">{currentCategory.name}</li>}
            </ol>
          </nav>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <HorizontalFilterBar categories={categories} activeFilters={params} totalProducts={pagination.total} />

      {/* Category Description */}
      {currentCategory?.description && (
        <div className="bg-white border-bottom py-5">
          <div className="container text-center">
            <h2 className="fw-bold h4 mb-3">{currentCategory.name}</h2>
            <p className="text-muted mx-auto mb-0" style={{ maxWidth: '850px' }}>{currentCategory.description}</p>
          </div>
        </div>
      )}

      <div className="container mt-4">
        {products.length > 0 ? (
          <>
            <div className="row g-3">
              {products.map((product) => (
                <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-6 mb-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-5">
              <hr className="mb-4" />
              <ul className="pagination justify-content-center gap-2 border-0">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <li key={i} className="page-item">
                    <Link
                      className={cn(
                        "page-link rounded-circle d-flex align-items-center justify-content-center border-0 fw-bold",
                        pagination.page === i + 1 ? "bg-primary text-white" : "bg-white text-dark shadow-sm hover-bg-gray-100"
                      )}
                      style={{ width: '40px', height: '40px' }}
                      href={pageHref(i + 1)}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="py-5 text-center">
            <div className="p-5 bg-white shadow-sm rounded-lg">
              <h3 className="fw-bold">No items found</h3>
              <p className="text-muted">Currently no items in this category. Try our other collections.</p>
              <Link href="/shop" className="btn btn-primary rounded-pill px-5 mt-3 fw-bold">Reset Filters</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
