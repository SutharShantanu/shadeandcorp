"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
}

/** Sample average RGB of a small patch at (px, py) in a canvas */
function sampleCanvasColor(
  canvas: HTMLCanvasElement,
  px: number,
  py: number,
  patchSize = 20,
): [number, number, number] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [128, 128, 128];
  const half = Math.floor(patchSize / 2);
  const x = Math.max(0, Math.round(px) - half);
  const y = Math.max(0, Math.round(py) - half);
  const w = Math.min(patchSize, canvas.width - x);
  const h = Math.min(patchSize, canvas.height - y);
  if (w <= 0 || h <= 0) return [128, 128, 128];
  const data = ctx.getImageData(x, y, w, h).data;
  let r = 0,
    g = 0,
    b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return [r / pixels, g / pixels, b / pixels];
}

/** Perceived luminance (0–1) */
function luminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function ZoomableImage({
  src,
  alt,
  className,
  zoomScale = 2.5,
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  // Fixed position (viewport coords) for the zoom panel so it escapes overflow:hidden
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [lensStyle, setLensStyle] = useState({
    border: "2px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.12)",
  });

  const LENS_SIZE = 200;
  const ZOOM_WIDTH = 440;
  const ZOOM_HEIGHT = 480;

  // Build an offscreen canvas from the current img element
  const ensureCanvas = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return null;
    if (!canvasRef.current || canvasRef.current.dataset.src !== src) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        try {
          ctx.drawImage(img, 0, 0);
          canvas.dataset.src = src;
          canvasRef.current = canvas;
        } catch {
          canvasRef.current = null;
        }
      }
    }
    return canvasRef.current;
  }, [src]);

  useEffect(() => {
    canvasRef.current = null;
  }, [src]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Constrain lens inside image bounds
      const lx = Math.max(
        LENS_SIZE / 2,
        Math.min(x, rect.width - LENS_SIZE / 2),
      );
      const ly = Math.max(
        LENS_SIZE / 2,
        Math.min(y, rect.height - LENS_SIZE / 2),
      );
      setLensPos({ x: lx, y: ly });

      // Background position percentage for zoom panel
      setBgPos({
        x: parseFloat(((x / rect.width) * 100).toFixed(2)),
        y: parseFloat(((y / rect.height) * 100).toFixed(2)),
      });

      // Panel position: fixed to viewport, appears to the right of the image container
      setPanelPos({
        top: rect.top,
        left: rect.right + 12,
      });

      // Adaptive lens colour via canvas sampling
      try {
        const canvas = ensureCanvas();
        if (canvas) {
          const img = imgRef.current!;
          const scaleX = img.naturalWidth / rect.width;
          const scaleY = img.naturalHeight / rect.height;
          const [r, g, b] = sampleCanvasColor(
            canvas,
            x * scaleX,
            y * scaleY,
            30,
          );
          const lum = luminance(r, g, b);

          if (lum > 0.55) {
            setLensStyle({
              border: "2px solid rgba(0,0,0,0.55)",
              background: "rgba(0,0,0,0.08)",
            });
          } else if (lum < 0.3) {
            setLensStyle({
              border: "2px solid rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.1)",
            });
          } else {
            setLensStyle({
              border: "2px solid rgba(255,255,255,0.6)",
              background: "rgba(128,128,128,0.1)",
            });
          }
        }
      } catch {
        // ignore cross-origin errors
      }
    },
    [ensureCanvas],
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-crosshair overflow-hidden ${className || ""}`}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        draggable={false}
        onLoad={() => {
          canvasRef.current = null;
        }}
      />

      {/* Adaptive lens overlay — stays inside the image (normal absolute) */}
      {isZooming && (
        <div
          style={{
            position: "absolute",
            left: lensPos.x - LENS_SIZE / 2,
            top: lensPos.y - LENS_SIZE / 2,
            width: LENS_SIZE,
            height: LENS_SIZE,
            border: lensStyle.border,
            backgroundColor: lensStyle.background,
            backdropFilter: "blur(0.5px)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
            pointerEvents: "none",
            zIndex: 10,
            transition: "border 0.15s ease, background-color 0.15s ease",
          }}
        />
      )}

      {/* Zoom panel — FIXED to escape any overflow:hidden parent */}
      {isZooming && (
        <div
          style={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
            width: ZOOM_WIDTH,
            height: ZOOM_HEIGHT,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
            backgroundRepeat: "no-repeat",
            borderRadius: "12px",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
}
