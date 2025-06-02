import Link from "next/link";
import { Image } from "@imagekit/next";

interface City {
  name: string;
  count: number;
  imageUrl: string;
}

interface BrowseByLocationProps {
  data: City[];
  bg?: string; // optional background class
}

const BrowseByLocation = ({
  data,
  bg,
}: BrowseByLocationProps) => {
  // Default background if none is provided
  const defaultBg = "bg-white";

  return (
    <section
      className={`py-10 md:py-16 ${bg || defaultBg}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-gray-800">
            Browse by Location
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover top colleges in your preferred city with detailed
            information and reviews
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-6">
          {data.map((city) => (
            <Link
              href={`/colleges?location=${city.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              key={city.name}
              className="bg-white rounded-lg shadow-sm p-4 md:p-6 text-center hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1 duration-300"
            >
              <div className="relative w-full pb-[100%] mb-3 rounded-md overflow-hidden">
                <Image
                  src={city.imageUrl || "/images/cities/default.jpg"}
                  alt={`${city.name} image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                {city.name}
              </h3>
              <p className="text-blue-700 text-sm md:text-base font-medium">
                {city.count} Colleges
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByLocation;