import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navLinks, navResourcesItems } from "@/data";

const DesktopNavigationItems = () => {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {navLinks.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <Link
              href={href}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {label}
            </Link>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {navResourcesItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="block space-y-1 rounded-md p-3 hover:bg-accent hover:text-blue-600"
                    >
                      <div className="text-sm font-medium">{item.title}</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigationItems;
