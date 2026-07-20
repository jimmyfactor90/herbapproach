"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Slide {
  id: string;
  image: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || slides.length === 0) {
    return (
      <section className="hero-modern position-relative py-5 bg-primary-dark text-white overflow-hidden">
        <div className="container position-relative z-2 py-5">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <h1 className="display-3 fw-800 mb-3" style={{ letterSpacing: '-2px' }}>
                Canada&apos;s Best <br /> <span className="text-secondary text-gradient">Online Dispensary</span>
              </h1>
              <p className="lead mb-4 opacity-75 fw-500">
                Premium AAAA+ Cannabis Flowers, Potent Edibles, and Concentrates delivered to your door.
              </p>
              <div className="d-flex gap-3">
                <Link href="/shop" className="btn btn-secondary btn-lg rounded-pill px-5 py-3 fw-bold">Shop Flowers</Link>
                <Link href="/register" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold">Join Now</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-overlay-dark"></div>
      </section>
    );
  }

  return (
    <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={slide.id} className={`carousel-item ${i === 0 ? "active" : ""}`} data-bs-interval="5000">
            <Link href={slide.buttonLink || "/shop"} className="d-block w-100">
              <div className="hero-slide-content position-relative text-white overflow-hidden" style={{ height: '410px', minHeight: '410px' }}>
                <Image
                  src={slide.image}
                  alt={slide.title || "Promotion"}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover', zIndex: -1 }}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
