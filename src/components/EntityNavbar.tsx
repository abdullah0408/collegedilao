"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function NavTab({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return isActive ? (
    <span className="py-3 px-4 text-sm border-b-2 border-blue-600 text-blue-600 font-medium cursor-default whitespace-nowrap">
      {label}
    </span>
  ) : (
    <Link
      href={href}
      className="py-3 px-4 text-sm border-b-2 border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300 whitespace-nowrap"
    >
      {label}
    </Link>
  );
}

export default function EntityNavbar() {
  const params = useParams();
  const pathname = usePathname();
  const entityName = params?.["collegeSlug"];
  const base = `/colleges/${entityName}`;

  const tabs = [
    { path: "", label: "Overview" },
    { path: "courses", label: "Courses & Fees" },
    { path: "gallery", label: "Gallery" },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 flex justify-center space-x-4 overflow-x-auto">
        {tabs.map(({ path, label }) => {
          const href = path ? `${base}/${path}` : base;
          const isActive = pathname === href;
          return (
            <NavTab
              key={path || "overview"}
              href={href}
              label={label}
              isActive={isActive}
            />
          );
        })}
      </div>
    </nav>
  );
}
