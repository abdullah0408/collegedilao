import React from "react";
import { prisma } from "@/lib/prisma";

import HeroBanner from "@/components/HomePage/HeroBanner";
import StatsSection from "@/components/HomePage/StatsSection";
import BrowseByLocation from "@/components/HomePage/BrowseByLocation";
import UniversityMarquee from "@/components/HomePage/UniversityMarquee";
import YouTubeShorts from "@/components/HomePage/YouTubeShorts";

import { SectionName } from "@/generated/prisma/client.js";

//
// In App Router, export "revalidate" at the top to enable ISR (1 hour).
//
export const revalidate = 3600;

//
// 1. Build a mapped type so every SectionName is present.
//
type ToggleMap = {
  [key in SectionName]: boolean;
};

//
// 2. Define the shape of each data item we’ll fetch.
//
interface CityData {
  name: string;
  count: number;
  imageUrl: string;
}

interface HeroImage {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

interface StatsData {
  [key: string]: number;
}

interface UniversityLogo {
  name: string;
  logo: string;
}

interface YouTubeShort {
  id: string;
  url: string;
  title: string;
}

//
// 3. The page itself is an async server component.
//
export default async function HomePage() {
  //
  // 3a. Fetch section toggles
  //
  const toggles = await prisma.homePageSectionToggle.findMany();
  const tempToggle: Partial<Record<SectionName, boolean>> = {};
  toggles.forEach((t) => {
    tempToggle[t.section] = t.isActive;
  });

  // Fill out every SectionName, defaulting to false if missing
  const toggleMap: ToggleMap = {
    [SectionName.HERO_BANNER]: tempToggle[SectionName.HERO_BANNER] ?? false,
    [SectionName.STATS]: tempToggle[SectionName.STATS] ?? false,
    [SectionName.CITIES]: tempToggle[SectionName.CITIES] ?? false,
    [SectionName.UNIVERSITY_MARQUEE]:
      tempToggle[SectionName.UNIVERSITY_MARQUEE] ?? false,
    [SectionName.YOUTUBE_SHORTS]:
      tempToggle[SectionName.YOUTUBE_SHORTS] ?? false,
  };

  //
  // 3b. Fetch HomePageCity
  //
  const cityRows = await prisma.homePageCity.findMany();
  const cityData: CityData[] = cityRows.map((c) => ({
    name: c.name,
    count: c.count,
    imageUrl: c.imageUrl,
  }));

  //
  // 3c. Fetch HomePageHeroImage
  //
  const heroRows = await prisma.homePageHeroImage.findMany({
    orderBy: { createdAt: "asc" },
  });
  const heroImages: HeroImage[] = heroRows.map((h) => ({
    image: h.image,
    title: h.title,
    subtitle: h.subtitle,
    ctaText: h.ctaText,
  }));

  //
  // 3d. Fetch HomePageStat
  //
  const statRows = await prisma.homePageStat.findMany();
  const statsData: StatsData = statRows.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, number>);

  //
  // 3e. Fetch HomePageUniversityLogo
  //
  const uniRows = await prisma.homePageUniversityLogo.findMany({
    orderBy: { createdAt: "asc" },
  });
  const universityLogos: UniversityLogo[] = uniRows.map((u) => ({
    name: u.name,
    logo: u.logo,
  }));

  //
  // 3f. Fetch HomePageYouTubeShort
  //
  const shortRows = await prisma.homePageYouTubeShort.findMany({
    orderBy: { createdAt: "asc" },
  });
  // Map to exactly { id, url, title } (cast id to string)
  const youtubeShorts: YouTubeShort[] = shortRows.map((s) => ({
    id: s.id.toString(),
    url: s.videoUrl,
    title: s.title,
  }));

  //
  // 4. Build an ordered list of all possible sections.
  //
  type SectionEntry = {
    name: SectionName;
    element: React.ReactElement;
  };

  const allSections: SectionEntry[] = [
    {
      name: SectionName.HERO_BANNER,
      element: <HeroBanner key="hero" data={heroImages} />,
    },
    {
      name: SectionName.STATS,
      element: <StatsSection key="stats" data={statsData} />,
    },
    {
      name: SectionName.CITIES,
      element: <BrowseByLocation key="cities" data={cityData} />,
    },
    {
      name: SectionName.UNIVERSITY_MARQUEE,
      element: (
        <UniversityMarquee
          key="university"
          data={universityLogos}
        />
      ),
    },
    {
      name: SectionName.YOUTUBE_SHORTS,
      element: <YouTubeShorts key="shorts" shorts={youtubeShorts} />,
    },
  ];

  // Only include those sections whose toggle is true:
  const activeSections = allSections.filter((sec) => toggleMap[sec.name]);

  //
  // 5. Render each active section, alternating bg-white / bg-gray-50.
  //
  let sectionCount = 0;
  return (
    <>
      {activeSections.map((sec) => {
        // Even-indexed → bg-white; odd-indexed → bg-gray-50
        const bgColor = sectionCount % 2 === 0 ? "bg-white" : "bg-gray-50";
        sectionCount++;

        // HeroBanner does NOT accept a “bg” prop, so wrap it manually:
        if (sec.name === SectionName.HERO_BANNER) {
          return (
            <section key={sec.name} className={`${bgColor}`}>
              {sec.element}
            </section>
          );
        }

        // The other four components DO accept a `bg?: string` prop.
        // Cast to React.ReactElement<{ bg?: string }> so TypeScript knows it’s valid.
        return React.cloneElement(
          sec.element as React.ReactElement<{ bg?: string }>,
          {
            bg: bgColor,
            key: sec.name,
          }
        );
      })}
    </>
  );
}
