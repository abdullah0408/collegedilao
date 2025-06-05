import { useContext } from "react";
import { AuthModalContext } from "@/contexts/AuthModalContext";

/**
 * Custom hook: call this anywhere below <AuthModalProvider> to open/close the auth modal.
 *
 * Throws an error if used outside of <AuthModalProvider>.
 *
 * Returns:
 *  - `isAuthOpen`: boolean flag indicating if the auth modal is currently open.
 *  - `openAuthModal()`: call to open the modal.
 *  - `closeAuthModal()`: call to close the modal.
 */
export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within <AuthModalProvider>");
  }
  return ctx;
}

/**
 * Usage Example (Next.js App Router):
 * -----------------------------------
 * 1. Wrap your root layout (`app/layout.tsx`) with <AuthModalProvider>:
 *
 *    import { AuthModalProvider } from "@/contexts/AuthModalContext";
 *
 *    export default function RootLayout({ children }: { children: React.ReactNode }) {
 *      return (
 *        <html lang="en">
 *          <body>
 *            <AuthModalProvider>
 *              {children}
 *            </AuthModalProvider>
 *          </body>
 *        </html>
 *      );
 *    }
 *
 * 2. Use the hook in any client component:
 *
 *    "use client";
 *    import { useAuthModal } from "@/hooks/useAuthModal";
 *
 *    const SomeComponent = () => {
 *      const { isAuthOpen, openAuthModal, closeAuthModal } = useAuthModal();
 *
 *      if (isAuthOpen) {
 *        return (
 *          <button
 *            onClick={closeAuthModal}
 *            className="mt-4 px-4 py-2 bg-gray-200 rounded"
 *          >
 *            Close
 *          </button>
 *        );
 *      }
 *
 *      return (
 *        <button
 *          onClick={openAuthModal}
 *          className="px-4 py-2 bg-blue-500 text-white rounded"
 *        >
 *          Sign In / Sign Up
 *        </button>
 *      );
 *    };
 *
 * Notes:
 * ------
 * - `isAuthOpen`: a boolean indicating if the modal is visible.
 * - `openAuthModal()`: call this to set `isAuthOpen` to true.
 * - `closeAuthModal()`: call this to set `isAuthOpen` to false.
 */
