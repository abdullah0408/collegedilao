import Link from "next/link";
import { flatNavItems } from "@/data";

interface FlatNavListProps {
  items?: { label: string; href: string }[];
}

const FlatNavList: React.FC<FlatNavListProps> = ({ items = flatNavItems }) => (
  <nav aria-label="Main navigation">
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded focus:outline-none focus:ring-2"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default FlatNavList;
