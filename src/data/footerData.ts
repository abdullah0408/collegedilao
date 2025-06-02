import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "https://www.instagram.com/collegedilao/" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/college-dilao-524433283/",
  },
];

export const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Colleges", href: "/colleges" },
      { label: "Entrance Exams", href: "/exams" },
      { label: "Courses", href: "/courses" },
      { label: "Rankings", href: "/rankings" },
      { label: "Latest News", href: "/news" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Scholarships", href: "/scholarships" },
      { label: "Q&A Forum", href: "/qa" },
      { label: "Articles", href: "/articles" },
      { label: "Write a Review", href: "/submit-review" },
      { label: "Compare Colleges", href: "/compare" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press & Media", href: "/press" },
      { label: "Advertise With Us", href: "/advertise" },
    ],
  },
];

export const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];
