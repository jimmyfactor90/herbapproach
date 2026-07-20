"use client";

import Link from "next/link";
import { FaChevronRight, FaFilter } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopSidebarProps {
  categories: any[];
  activeFilters: any;
}

export default function ShopSidebar({ categories, activeFilters }: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePriceChange = (min?: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) params.set("minPrice", min.toString());
    else params.delete("minPrice");
    
    if (max !== undefined) params.set("maxPrice", max.toString());
    else params.delete("maxPrice");
    
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="shop-sidebar animate-fade-in">
        {/* 1. Category Navigation */}
        <div className="card border-0 shadow-sm rounded-lg mb-4 overflow-hidden">
            <div className="card-header bg-primary-dark text-white py-3 px-4 fw-bold d-flex align-items-center gap-2">
                <FaFilter size={14} /> CATEGORIES
            </div>
            <div className="list-group list-group-flush">
                <Link 
                    href="/shop" 
                    className={cn(
                        "list-group-item list-group-item-action py-3 px-4 border-start-4 transition-all d-flex justify-content-between align-items-center",
                        !activeFilters.category ? "border-primary bg-primary-light fw-bold" : "border-transparent"
                    )}
                >
                    All Products <FaChevronRight size={10} className="text-muted" />
                </Link>
                {categories.map((cat) => (
                    <Link 
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className={cn(
                            "list-group-item list-group-item-action py-3 px-4 border-start-4 transition-all d-flex justify-content-between align-items-center",
                            activeFilters.category === cat.slug ? "border-primary bg-primary-light fw-bold" : "border-transparent"
                        )}
                    >
                        {cat.name} <FaChevronRight size={10} className="text-muted" />
                    </Link>
                ))}
            </div>
        </div>

        {/* 2. Price Filtering */}
        <div className="card border-0 shadow-sm rounded-lg p-4">
            <h6 className="fw-bold mb-4 uppercase tracking-wider text-muted small">Filter by Price</h6>
            <div className="d-flex flex-column gap-2">
                <button 
                  onClick={() => handlePriceChange(0, 500)}
                  className="btn btn-outline-light text-dark text-start py-2 px-3 small border-gray-200 hover-bg-gray-100"
                >
                  Under ₹500
                </button>
                <button 
                  onClick={() => handlePriceChange(500, 1500)}
                  className="btn btn-outline-light text-dark text-start py-2 px-3 small border-gray-200 hover-bg-gray-100"
                >
                  ₹500 - ₹1,500
                </button>
                <button 
                  onClick={() => handlePriceChange(1500, 5000)}
                  className="btn btn-outline-light text-dark text-start py-2 px-3 small border-gray-200 hover-bg-gray-100"
                >
                  ₹1,500 - ₹5,000
                </button>
                <button 
                  onClick={() => handlePriceChange(5000)}
                  className="btn btn-outline-light text-dark text-start py-2 px-3 small border-gray-200 hover-bg-gray-100"
                >
                  Over ₹5,000
                </button>
            </div>
        </div>
    </aside>
  );
}
