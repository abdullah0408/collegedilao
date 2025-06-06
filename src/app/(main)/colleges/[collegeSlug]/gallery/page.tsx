"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CircleX, ZoomIn, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@imagekit/next";

interface FetchedImage {
  src: string;
  caption: string;
  aspectRatio: number;
}

const GalleryTab = () => {
  const params = useParams<{ collegeSlug: string }>();

  const [galleryImages, setGalleryImages] = useState<FetchedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox / zoom state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Dragging/panning refs
  const draggingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Fetch gallery data on mount
  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch(`/api/colleges/gallery/${params.collegeSlug}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("Fetched gallery data:", data);
        // data.images is an array of { src, caption }
        // We add a placeholder aspectRatio = 1 for now
        const prepared: FetchedImage[] = data.images.map((img: any) => ({
          src: img.src,
          caption: img.caption,
          aspectRatio: 1, // will recalc on load
        }));
        setGalleryImages(prepared);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, [params.collegeSlug]);

  // Lightbox handlers:
  const openImage = (src: string) => {
    setSelectedImage(src);
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const onZoomIn = () => setZoomLevel((p) => Math.min(p + 0.2, 3));
  const onZoomOut = () =>
    setZoomLevel((p) => {
      const next = Math.max(p - 0.2, 1);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (zoomLevel <= 1) return;
    draggingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startOffsetRef.current = { x: offset.x, y: offset.y };
    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.cursor = "grabbing";
    }
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - startPointerRef.current.x;
    const dy = e.clientY - startPointerRef.current.y;
    setOffset({
      x: startOffsetRef.current.x + dx,
      y: startOffsetRef.current.y + dy,
    });
  };
  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = false;
    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.cursor = "grab";
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.cursor = "grab";
    }
  };

  // Ensure the zoom container never uses default browser pan/zoom gestures
  useEffect(() => {
    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.touchAction = "none";
      zoomContainerRef.current.style.cursor = "grab";
    }
  }, [selectedImage]);

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Called when each <Image> finishes loading, so we can recalc aspectRatio:
  const handleImageLoad = (
    src: string,
    event: {
      naturalWidth: number;
      naturalHeight: number;
    }
  ) => {
    // Compute ratio:
    const ratio = event.naturalWidth / event.naturalHeight;
    setGalleryImages((prev) =>
      prev.map((img) => (img.src === src ? { ...img, aspectRatio: ratio } : img))
    );
  };

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {/* You can customize this heading however you like */}
            {params?.collegeSlug.replace(/-/g, " ").toUpperCase()} Photo Gallery
          </h2>
          <div className="text-sm text-gray-500">
            {isLoading ? "Loading…" : `${galleryImages.length} photos`}
          </div>
        </div>

        {isLoading ? (
          // Show skeletons while fetching
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="w-full">
                <AspectRatio ratio={4 / 3}>
                  <Skeleton className="w-full h-full rounded-lg" />
                </AspectRatio>
              </div>
            ))}
          </div>
        ) : (
          // Show actual Masonry gallery
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className="mb-4 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] group relative"
                onClick={() => openImage(image.src)}
              >
                <div className="relative">
                  <AspectRatio ratio={image.aspectRatio}>
                    {/* 
                      We pass onLoadingComplete so that when this <Image> finishes loading,
                      we get naturalWidth/naturalHeight and recalc aspectRatio in state. 
                      @imagekit/next’s Image supports onLoadingComplete similar to next/image.
                    */}
                    <Image
                      src={`/${image.src}`}
                      alt={image.caption || "Gallery image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onLoadingComplete={(info) => {
                        handleImageLoad(image.src, {
                          naturalWidth: info.naturalWidth,
                          naturalHeight: info.naturalHeight,
                        });
                      }}
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        )}

        {/* LIGHTBOX, only if an image is selected */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center overflow-hidden">
              <div
                ref={zoomContainerRef}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={`/${
                    galleryImages.find((img) => img.src === selectedImage)?.src ||
                    ""
                  }`}
                  alt={
                    galleryImages.find((img) => img.src === selectedImage)
                      ?.caption || ""
                  }
                  width={1000}
                  height={800}
                  unoptimized
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomLevel})`,
                    transition: draggingRef.current ? "none" : "transform 0.1s",
                  }}
                  className="object-contain max-h-full max-w-full rounded-lg"
                />
              </div>

              {/* Close button (top-right) */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/70 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <CircleX className="h-6 w-6" />
              </Button>

              {/* Zoom controls (bottom-center) */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/60 hover:bg-black/70 text-white hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoomOut();
                  }}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/60 hover:bg-black/70 text-white hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoomIn();
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryTab;
