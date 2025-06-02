export const SectionName = {
  CITIES: "CITIES" as const,
  HERO_BANNER: "HERO_BANNER" as const,
  STATS: "STATS" as const,
  UNIVERSITY_MARQUEE: "UNIVERSITY_MARQUEE" as const,
  YOUTUBE_SHORTS: "YOUTUBE_SHORTS" as const,
};

export type SectionName = typeof SectionName[keyof typeof SectionName];
