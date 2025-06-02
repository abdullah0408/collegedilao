"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronRight, Youtube } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type YouTubeShort = {
  id: string;
  url: string;
  title: string;
};

interface YouTubeShortsProps {
  shorts: YouTubeShort[];
  bg?: string; // optional background class
}

const YouTubeShorts = ({ shorts, bg }: YouTubeShortsProps) => {
  const isMobile = useIsMobile();

  // Default background if none provided
  const defaultBg = "bg-white";

  return (
    <section className={`py-10 md:py-16 ${bg || defaultBg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Youtube className="h-6 w-6 mr-2 text-red-600" /> YouTube Shorts
            </h2>
            <p className="text-gray-600 mt-1">
              Discover college life through our latest short videos
            </p>
          </div>
          <a
            href="https://www.youtube.com/@college_dilao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            Subscribe <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {isMobile ? (
          <div className="px-1">
            <Carousel className="w-full">
              <CarouselContent>
                {shorts.map((reel) => (
                  <CarouselItem
                    key={reel.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200">
                      <div className="aspect-[9/16] bg-gray-100 relative">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractVideoId(
                            reel.url
                          )}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={reel.title}
                        />
                      </div>
                      <div className="p-4 text-sm text-gray-800 font-medium truncate">
                        {reel.title}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {shorts.map((reel) => (
              <div
                key={reel.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
              >
                <div className="aspect-[9/16] bg-gray-100 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(
                      reel.url
                    )}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={reel.title}
                  />
                </div>
                <div className="p-4 text-sm text-gray-800 font-medium truncate">
                  {reel.title}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6 md:mt-8">
          <a
            href="https://www.youtube.com/@college_dilao/shorts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="hover:text-red-600 cursor-pointer"
            >
              View All Shorts <Youtube className="text-red-600 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

// Helper function to extract video ID from a full YouTube URL
function extractVideoId(url: string): string {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? "";
}

export default YouTubeShorts;
