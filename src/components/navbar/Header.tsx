import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import SearchBar from "./SearchBar";
import CategoryNavigation from "./CategoryNavigation";

const Header = () => {
  return (
    <header className="w-full bg-white z-40 relative transition-all duration-300 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <HeaderLeft />
        <HeaderRight />
      </div>

      <SearchBar />
      <CategoryNavigation />
    </header>
  );
};

export default Header;
