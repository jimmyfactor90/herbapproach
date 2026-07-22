"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown, FaTimes, FaRedo } from "react-icons/fa";
import { STRAIN_TYPES, POTENCY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HorizontalFilterBarProps {
  categories: any[];
  activeFilters: any;
  totalProducts: number;
}

const PRICE_BANDS = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,500", min: 500, max: 1500 },
  { label: "$1,500 - $5,000", min: 1500, max: 5000 },
  { label: "Over $5,000", min: 5000, max: undefined },
];

const WEIGHTS = [1, 3.5, 7, 14, 28];

const FILTER_LABELS: Record<string, string> = {
  category: "Category",
  strainType: "Strain Type",
  potency: "Potency",
  minPrice: "Price",
  maxPrice: "Price",
  weight: "Weight",
  inStock: "In Stock",
  onSale: "On Sale",
};

export default function HorizontalFilterBar({ categories, activeFilters, totalProducts }: HorizontalFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    navigate((params) => {
      if (params.get(key) === value) params.delete(key);
      else params.set(key, value);
    });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    navigate((params) => {
      const isActive = params.get("minPrice") === String(min ?? "") && params.get("maxPrice") === String(max ?? "");
      if (isActive) {
        params.delete("minPrice");
        params.delete("maxPrice");
      } else {
        if (min !== undefined) params.set("minPrice", min.toString()); else params.delete("minPrice");
        if (max !== undefined) params.set("maxPrice", max.toString()); else params.delete("maxPrice");
      }
    });
  };

  const handleToggleBoolean = (key: "inStock" | "onSale") => {
    navigate((params) => {
      if (params.get(key) === "true") params.delete(key);
      else params.set(key, "true");
    });
  };

  const clearFilter = (key: string) => {
    navigate((params) => {
      params.delete(key);
      if (key === "minPrice" || key === "maxPrice") {
        params.delete("minPrice");
        params.delete("maxPrice");
      }
    });
  };

  const clearAll = () => router.push("/shop");

  const activeEntries = Object.entries(activeFilters).filter(
    ([key, value]) => value && key !== "sort" && key !== "page"
  );
  const activeCount = new Set(activeEntries.map(([key]) => (key === "maxPrice" ? "minPrice" : key))).size;

  const isPriceActive = (min?: number, max?: number) =>
    activeFilters.minPrice === (min !== undefined ? String(min) : undefined) &&
    activeFilters.maxPrice === (max !== undefined ? String(max) : undefined);

  return (
    <div className="bg-white border-bottom py-3 mb-4">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Category Dropdown */}
          <div className="dropdown">
            <button
              className={cn("btn btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2", activeFilters.category ? "btn-plant" : "btn-outline-secondary")}
              data-bs-toggle="dropdown"
            >
              Category
            </button>
            <div className="dropdown-menu shadow border p-3" style={{ minWidth: '320px' }}>
              <div className="row row-cols-2 g-2">
                {categories.map((cat) => (
                  <div className="col" key={cat.id}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`filter-cat-${cat.id}`}
                        checked={activeFilters.category === cat.slug}
                        onChange={() => handleFilterChange("category", cat.slug)}
                      />
                      <label className="form-check-label small d-flex justify-content-between w-100" htmlFor={`filter-cat-${cat.id}`}>
                        {cat.name}
                        {cat._count && <span className="text-muted opacity-50 ms-2">{cat._count.products}</span>}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strain Type Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              Strain Type {activeFilters.strainType && <span className="filter-active-dot" />}
            </button>
            <ul className="dropdown-menu shadow border-0">
              {STRAIN_TYPES.map((strain) => (
                <li key={strain.value}>
                  <button
                    className={cn("dropdown-item", activeFilters.strainType === strain.value && "active")}
                    onClick={() => handleFilterChange("strainType", strain.value)}
                  >
                    {strain.icon} {strain.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Potency Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              Potency {activeFilters.potency && <span className="filter-active-dot" />}
            </button>
            <ul className="dropdown-menu shadow border-0">
              {POTENCY_LEVELS.map((potency) => (
                <li key={potency.value}>
                  <button
                    className={cn("dropdown-item", activeFilters.potency === potency.value && "active")}
                    onClick={() => handleFilterChange("potency", potency.value)}
                  >
                    {potency.icon} {potency.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              Price {(activeFilters.minPrice || activeFilters.maxPrice) && <span className="filter-active-dot" />}
            </button>
            <ul className="dropdown-menu shadow border-0">
              {PRICE_BANDS.map((band) => (
                <li key={band.label}>
                  <button
                    className={cn("dropdown-item", isPriceActive(band.min, band.max) && "active")}
                    onClick={() => handlePriceChange(band.min, band.max)}
                  >
                    {band.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Net Weight Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              Net Weight {activeFilters.weight && <span className="filter-active-dot" />}
            </button>
            <ul className="dropdown-menu shadow border-0">
              {WEIGHTS.map((w) => (
                <li key={w}>
                  <button
                    className={cn("dropdown-item", activeFilters.weight === w.toString() && "active")}
                    onClick={() => handleFilterChange("weight", w.toString())}
                  >
                    {w}g
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability Checkboxes */}
          <div className="d-flex align-items-center gap-3 ms-lg-2">
            <div className="form-check m-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="hfb-inStock"
                checked={activeFilters.inStock === "true"}
                onChange={() => handleToggleBoolean("inStock")}
              />
              <label className="form-check-label small" htmlFor="hfb-inStock">In Stock Only</label>
            </div>
            <div className="form-check m-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="hfb-onSale"
                checked={activeFilters.onSale === "true"}
                onChange={() => handleToggleBoolean("onSale")}
              />
              <label className="form-check-label small" htmlFor="hfb-onSale">Sale Items Only</label>
            </div>
          </div>

          {/* Sort - pushed to the end */}
          <div className="dropdown ms-lg-auto">
            <button className="btn btn-outline-dark btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <FaChevronDown size={10} className="d-none" />
              Sort: {activeFilters.sort === "price_asc" ? "Low to High" : activeFilters.sort === "price_desc" ? "High to Low" : "Latest"}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
              <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "")}>Latest Arrivals</button></li>
              <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "price_asc")}>Price: Low to High</button></li>
              <li><button className="dropdown-item" onClick={() => handleFilterChange("sort", "price_desc")}>Price: High to Low</button></li>
            </ul>
          </div>
        </div>

        {/* Results row */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <span className="small text-muted fw-bold">{totalProducts} Results</span>
          {activeCount > 0 && (
            <button className="btn btn-link link-danger p-0 small fw-bold text-decoration-none d-flex align-items-center gap-2" onClick={clearAll}>
              <FaRedo size={11} /> Clear Filters ({activeCount})
            </button>
          )}
        </div>

        {/* Active Filter Tags */}
        {activeEntries.length > 0 && (
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {activeEntries.map(([key, value]) => {
              if (key === "maxPrice") return null;
              const label = key === "minPrice"
                ? `${FILTER_LABELS[key]}: $${activeFilters.minPrice}${activeFilters.maxPrice ? `-$${activeFilters.maxPrice}` : "+"}`
                : `${FILTER_LABELS[key] || key}: ${String(value)}`;
              return (
                <span key={key} className="badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-normal">
                  {label}
                  <button className="btn btn-link p-0 text-muted d-flex" onClick={() => clearFilter(key)}>
                    <FaTimes size={10} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
