import { getCachedCategories, getCachedShopProducts } from "@/features/products/services/storefront-queries";
import ProductCard from "@/features/products/components/ProductCard";
import ShopSidebar from "@/features/products/components/ShopSidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaSortAmountDown } from "react-icons/fa";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    careLevel?: string;
    sunlight?: string;
    minPrice?: string;
    maxPrice?: string;
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
      careLevel: params.careLevel,
      sunlight: params.sunlight,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      sort: params.sort as any,
      page: params.page ? parseInt(params.page) : 1,
    }),
  ]);

  const { products, pagination } = shopData;
  const currentCategory = categories.find(c => c.slug === params.category);

  return (
    <div className="bg-gray-50 min-vh-100 pb-5">
      {/* 1. Slim Navigation Header */}
      <div className="bg-white border-bottom py-3 mb-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small m-0 p-0 bg-transparent">
                <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
                <li className="breadcrumb-item"><Link href="/shop" className="text-decoration-none text-muted">Shop</Link></li>
                {currentCategory && <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">{currentCategory.name}</li>}
              </ol>
            </nav>
            <span className="text-muted small fw-bold uppercase tracking-tight">
               Showing {products.length} of {pagination.total} Results
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          {/* 2. Sidebar Filter (3 Columns) */}
          <div className="col-lg-3">
             <ShopSidebar categories={categories} activeFilters={params} />
          </div>

          {/* 3. Product Grid (9 Columns) */}
          <div className="col-lg-9">
            {/* Grid Header / Sorting Row */}
            <div className="card border-0 shadow-sm rounded-lg p-3 mb-4 d-flex flex-row justify-content-between align-items-center bg-white">
                <h4 className="fw-bold m-0 h5">
                    {currentCategory ? currentCategory.name.toUpperCase() : "ALL PRODUCTS"}
                </h4>
                <div className="d-flex align-items-center gap-3">
                    <span className="small text-muted d-none d-md-inline"><FaSortAmountDown className="me-1" /> Sort by:</span>
                    <select className="form-select form-select-sm border-gray-200 rounded-pill px-3 shadow-none" style={{ width: 'auto' }}>
                        <option>Default Sorting</option>
                        <option>Sort by popularity</option>
                        <option>Sort by average rating</option>
                        <option>Sort by latest</option>
                        <option>Sort by price: low to high</option>
                        <option>Sort by price: high to low</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="row g-3">
              {products.length > 0 ? (
                <>
                  {products.map((product) => (
                    <div key={product.id} className="col-xl-4 col-md-6 col-6 mb-3">
                      <ProductCard product={product} />
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="col-12 mt-5">
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
                            href={`/shop?page=${i + 1}${params.category ? `&category=${params.category}` : ''}`}
                          >
                            {i + 1}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="col-12 py-5 text-center">
                  <div className="p-5 bg-white shadow-sm rounded-lg">
                    <h3 className="fw-bold">No items found</h3>
                    <p className="text-muted">Currently no items in this category. Try our other collections.</p>
                    <Link href="/shop" className="btn btn-primary rounded-pill px-5 mt-3 fw-bold">Reset Filters</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
