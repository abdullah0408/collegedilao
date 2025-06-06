import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

type SocialLinksType = {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
};

const SocialLinks = ({ entity }: { entity: SocialLinksType }) => {
  const socialLinks = [
    { href: entity.facebook, icon: Facebook },
    { href: entity.twitter, icon: Twitter },
    { href: entity.instagram, icon: Instagram },
    { href: entity.linkedin, icon: Linkedin },
  ];

  return (
    <div className="flex items-center gap-3">
      {socialLinks
        .filter((link) => !!link.href)
        .map(({ href, icon: Icon }, i) => (
          <a
            key={i}
            href={href!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <Icon size={16} className="text-gray-600" />
          </a>
        ))}
    </div>
  );
};

export default SocialLinks;
