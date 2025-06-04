import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navSections } from "@/data";

export default function CategoryNavigation() {
  return (
    <div className="bg-white border-b hidden md:block">
      <div className="container mx-auto px-4">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex justify-between">
            {navSections.map((section) => (
              <NavigationMenuItem key={section.id}>
                <NavigationMenuTrigger className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {section.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-4">
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {section.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <Link
                href="/rankings"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                Rankings
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/scholarships"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                Scholarships
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/compare"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                Compare
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
