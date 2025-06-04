import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ImageKitProvider } from "@imagekit/next";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/navbar/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "College Dilao",
    template: "%s | College Dilao",
  },
  description:
    "College Dilao is a leading education consultancy in India, guiding students through the college admission process with expert counseling and personalized support.",
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ImageKitProvider
              urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
            >
              <Header />
              {children}
              <Footer />
            </ImageKitProvider>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
