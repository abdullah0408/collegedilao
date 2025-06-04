import Link from "next/link";
import Image from "next/image";
import DesktopNavigationItems from "./DesktopNavigationItems";

const HeaderLeft = () => (
  <div className="flex items-center space-x-4 pl-4 md:pl-0">
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="College Dilao Logo"
        width={857}
        height={291}
        className="w-44 h-auto"
      />
    </Link>
    <DesktopNavigationItems />
  </div>
);

export default HeaderLeft;
