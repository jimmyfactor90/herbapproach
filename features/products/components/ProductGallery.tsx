"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  images: { url: string; altText?: string | null }[];
  productName: string;
}

export default function ProductGallery({ mainImage, images, productName }: ProductGalleryProps) {
  const photos = [{ url: mainImage, altText: productName }, ...images];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = photos[activeIndex] ?? photos[0];

  return (
    <div>
      {/* Main Image */}
      <div className="main-image-wrapper position-relative rounded overflow-hidden border mb-3 bg-light text-center" style={{ height: '400px' }}>
        <Image
          src={active.url}
          alt={active.altText || productName}
          fill
          sizes="(max-width: 992px) 100vw, 500px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="d-flex gap-2 flex-wrap">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`position-relative border rounded overflow-hidden p-0 transition-all ${i === activeIndex ? 'border-2 border-primary' : 'hover-border-primary'}`}
              style={{ width: '70px', height: '70px' }}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={photo.url}
                alt={photo.altText || `${productName} view ${i + 1}`}
                fill
                sizes="70px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
