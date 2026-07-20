"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaSortAmountDown, FaFilter, FaChevronDown, FaTimes } from "react-icons/fa";
import { CARE_LEVELS, SUNLIGHT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HorizontalFilterBarProps {
  categories: any[];
  activeFilters: any;
  totalProducts: number;
}

export default function HorizontalFilterBar({ categories, activeFilters, totalProducts }: HorizontalFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const clearAll = () => router.push("/shop");

  const activeCount = Object.keys(activeFilters).filter(k => k !== 'sort' && k !== 'page' && activeFilters[k]).length;

  return (
    <div className="filter-bar-horizontal bg-white border-bottom py-3 mb-4 sticky-top-offset">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          
          <div className="d-flex align-items-center gap-3">
            {/* Category Dropdown */}
            <div className="dropdown">
              <button className="filter-btn dropdown-toggle" data-bs-toggle="dropdown">
                Category {activeFilters.category && <span className="active-dot"></span>}
                <FaChevronDown size={10} className="ms-2" />
              </button>
              <ul className="dropdown-menu shadow border-0">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      className={cn("dropdown-item d-flex justify-content-between align-items-center", activeFilters.category === cat.slug && "active")}
                      onClick={() => handleFilterChange("category", cat.slug)}
                    >
                      {cat.name}
                      <span className="small opacity-50 ms-3">{cat._count.products}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Level Dropdown */}
            <div className="dropdown">
              <button className="filter-btn dropdown-toggle" data-bs-toggle="dropdown">
                Care Level {activeFilters.careLevel && <span className="active-dot"></span>}
                <FaChevronDown size={10} className="ms-2" />
              </button>
              <ul className="dropdown-menu shadow border-0">
                {CARE_LEVELS.map((level) => (
                  <li key={level.value}>
                    <button 
                      className={cn("dropdown-item", activeFilters.careLevel === level.value && "active")}
                      onClick={() => handleFilterChange("careLevel", level.value)}
                    >
                      {level.icon} {level.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sunlight Dropdown */}
            <div className="dropdown">
              <button className="filter-btn dropdown-toggle" data-bs-toggle="dropdown">
                Light {activeFilters.sunlight && <span className="active-dot"></span>}
                <FaChevronDown size={10} className="ms-2" />
              </button>
              <ul className="dropdown-menu shadow border-0">
                {SUNLIGHT_OPTIONS.map((sun) => (
                  <li key={sun.value}>
                    <button 
                      className={cn("dropdown-item", activeFilters.sunlight === sun.value && "active")}
                      onClick={() => handleFilterChange("sunlight", sun.value)}
                    >
                      {sun.icon} {sun.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {activeCount > 0 && (
              <button className="btn btn-link link-danger p-0 small fw-bold text-decoration-none" onClick={clearAll}>
                Clear All ({activeCount})
              </button>
            )}
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-muted small d-none d-md-inline">{totalProducts} results</span>
            
            <div className="dropdown">
              <button className="filter-btn dropdown-toggle" data-bs-toggle="dropdown">
                <FaSortAmountDown className="me-2" /> 
                {activeFilters.sort === 'price_asc' ? 'Lowest Price' : activeFilters.sort === 'price_desc' ? 'Highest Price' : 'Latest'}
                <FaChevronDown size={10} className="ms-2" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "newest")}>Latest Arrivals</button></li>
                <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "price_asc")}>Price: Low to High</button></li>
                <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "price_desc")}>Price: High to Low</button></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Active Filter Tags */}
        {activeCount > 0 && (
          <div className="active-tags d-flex gap-2 mt-3 flex-wrap">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value || key === 'sort' || key === 'page') return null;
              return (
                <div key={key} className="filter-tag">
                  {String(value)}
                  <button onClick={() => handleFilterChange(key, String(value))}><FaTimes /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
