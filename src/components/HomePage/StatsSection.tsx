"use client";

import { useEffect, useState } from "react";

interface StatsSectionProps {
  data: Record<string, number>;
  duration?: number; // optional: animation duration in ms
  steps?: number; // optional: number of animation steps
  bg?: string; // optional background class
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  return `${num}+`;
};

const StatsSection = ({
  data,
  duration = 2000,
  steps = 50,
  bg,
}: StatsSectionProps) => {
  const [stats, setStats] = useState<Record<string, number>>(
    Object.fromEntries(Object.keys(data).map((key) => [key, 0]))
  );

  useEffect(() => {
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);

      const animatedStats: Record<string, number> = {};
      for (const key in data) {
        animatedStats[key] = Math.floor(data[key] * progress);
      }

      setStats(animatedStats);

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [data, duration, steps]);

  // Default background is bg-gray-50 if none provided
  const defaultBg = "bg-gray-50";

  return (
    <section className={`py-8 md:py-12 ${bg || defaultBg}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
          Our Growing Community
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="text-2xl md:text-4xl font-bold text-blue-700 mb-1 md:mb-2">
                {formatNumber(value)}
              </div>
              <div className="text-gray-600 text-sm md:text-base capitalize">
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;