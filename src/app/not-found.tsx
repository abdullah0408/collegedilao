import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the page you&apos;re looking for. The page
            might have been removed or the URL might be incorrect.
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
