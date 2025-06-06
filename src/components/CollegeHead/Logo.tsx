import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "@imagekit/next";

const CollegeLogo = ({ logoUrl }: { logoUrl?: string | null }) => {
  // If there’s no explicit “logo” in the database, we fall back to a placeholder
  const src = logoUrl || "/default-logo.png";

  return (
    <div className="flex-shrink-0">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-md overflow-hidden border-2 border-white -mt-16 md:-mt-20">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={src}
            alt="college logo"
            fill
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default CollegeLogo;
