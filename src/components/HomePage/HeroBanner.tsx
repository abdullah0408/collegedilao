"use client";

import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Image } from "@imagekit/next";
import { useState } from "react";
import ProtectedButton from "../ProtectedButton";
import Link from "next/link";

interface HeroImage {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  url: string;
}

interface HeroBannerProps {
  data: HeroImage[];
}

const HeroBanner = ({ data }: HeroBannerProps) => {
  const isMobile = useIsMobile();
  const [currentBanner, setCurrentBanner] = useState(0);

  return (
    <section className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-all duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {data.map((banner, index) => (
            <div key={index} className="min-w-full relative flex-shrink-0">
              {/* Image with overlay */}
              <div className="relative h-[50vh] md:h-[500px] w-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50 z-10"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col items-center justify-center text-white text-center">
                <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 animate-fade-in">
                  {banner.title}
                </h1>
                <p className="text-base md:text-xl mb-4 md:mb-8 max-w-2xl animate-fade-in">
                  {banner.subtitle}
                </p>
                <ProtectedButton
                  size={isMobile ? "default" : "lg"}
                  className="animate-fade-in bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href={banner.url} className="flex items-center">
                    {banner.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </ProtectedButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
              currentBanner === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
