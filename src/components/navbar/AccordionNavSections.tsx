import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface NavSection {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

interface AccordionNavSectionsProps {
  sections: NavSection[];
}

const AccordionNavSections: React.FC<AccordionNavSectionsProps> = ({
  sections,
}) => (
  <Accordion
    type="multiple"
    defaultValue={sections.map((s) => s.id)}
    className="p-0 m-0 divide-y divide-gray-200"
  >
    {sections.map((section) => (
      <AccordionItem key={section.id} value={section.id}>
        <AccordionTrigger className="text-sm text-gray-700 hover:text-blue-600">
          {section.title}
        </AccordionTrigger>
        <AccordionContent className="ml-2 space-y-1">
          {section.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded"
            >
              {link.label}
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default AccordionNavSections;
