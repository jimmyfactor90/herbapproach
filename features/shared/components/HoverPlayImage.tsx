"use client";

import { useEffect, useRef, useState } from "react";

interface HoverPlayImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HoverPlayImage({ src, alt, className, style }: HoverPlayImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!src) return;
    setPosterReady(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      setPosterReady(true);
    };
  }, [src]);

  if (!src) {
    return <div className={className} style={{ position: "relative", overflow: "hidden", background: "#f1f3f5", ...style }} />;
  }

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: posterReady && !hovered ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {(hovered || !posterReady) && (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}
