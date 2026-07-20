"use client";

import { useRef } from "react";
import ProductCard from "@/features/products/components/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductSliderProps {
  products: any[];
  title?: string;
}

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="product-slider-wrapper position-relative py-4">
      {title && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-900 display-6 text-uppercase tracking-tighter m-0">{title}</h2>
          <div className="d-flex gap-2">
            <button 
              onClick={() => scroll("left")} 
              className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: '40px', height: '40px' }}
            >
              <FaChevronLeft size={14} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: '40px', height: '40px' }}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="d-flex gap-3 overflow-auto no-scrollbar pb-3"
        style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-shrink-0" 
            style={{ width: 'calc(25% - 12px)', minWidth: '280px', scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
