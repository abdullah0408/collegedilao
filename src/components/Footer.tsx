// src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

import { socialLinks, footerSections, bottomLinks } from "@/data";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center bg-white rounded-md w-[176px] h-[60px]"
            >
              <Image
                src="/logo.png"
                alt="College Dilao Logo"
                width={176}
                height={60}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 mt-4 mb-6">
              Helping students make informed decisions about higher education
              through authentic reviews and comprehensive college information.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit us on ${Icon.displayName ?? "social"}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Sections */}
          {footerSections.map((section, idx) => (
            <nav
              key={idx}
              aria-labelledby={`footer-${section.title.toLowerCase()}-heading`}
            >
              <h3
                id={`footer-${section.title.toLowerCase()}-heading`}
                className="text-lg font-semibold mb-4"
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-400 mt-1" aria-hidden="true" />
              <a
                href="mailto:support@collegedilao.com"
                className="text-gray-400 hover:underline transition-colors"
              >
                support@collegedilao.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between text-gray-400 text-sm pt-8 border-t border-gray-700">
          <p>© 2025 College Dilao. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {bottomLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
