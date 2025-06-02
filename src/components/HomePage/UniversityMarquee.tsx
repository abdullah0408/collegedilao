"use client";

import { Image } from "@imagekit/next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import "./marquee.css";

interface University {
  name: string;
  logo: string;
}

interface UniversityMarqueeProps {
  data: University[];
  bg?: string; // optional background class
}

const UniversityMarquee = ({
  data,
  bg,
}: UniversityMarqueeProps) => {
  // Default background if none provided
  const defaultBg = "bg-gray-50";

  return (
    <section className={`py-8 md:py-10 ${bg || defaultBg}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Explore 100+ Universities
          </h2>
          <p className="text-gray-600">
            Partnered with leading institutions across India
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="marquee">
            {[...data, ...data].map((university, index) => (
              <div
                key={`logo-${index}`}
                className="mx-4 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 mb-2">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={`/${university.logo}`}
                      alt={`${university.name} logo`}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <span className="text-xs text-gray-700 text-center max-w-[80px] truncate">
                  {university.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityMarquee;