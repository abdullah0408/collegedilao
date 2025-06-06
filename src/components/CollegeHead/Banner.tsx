import { Image } from "@imagekit/next";

const CollegeBanner = ({
  bannerUrl,
  logoUrl,
}: {
  bannerUrl?: string | null;
  logoUrl?: string | null;
}) => {
  // If there’s no explicit “banner” in the database, we fall back to logo (or a placeholder)
  const src = bannerUrl || logoUrl || "/default-banner.png";

  return (
    <div className="h-64 md:h-80 relative overflow-hidden">
      <Image
        src={src}
        alt="college banner"
        fill
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
    </div>
  );
};

export default CollegeBanner;
