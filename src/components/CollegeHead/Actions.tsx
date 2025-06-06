"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Globe, ExternalLink, Phone, Mail } from "lucide-react";
import ProtectedButton from "../ProtectedButton";

const CollegeActions = ({
  websiteUrl,
  phone,
  email,
}: {
  websiteUrl?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
}) => {
  const hasContact = (phone?.length || 0) > 0 || (email?.length || 0) > 0;

  return (
    <div className="flex flex-wrap gap-3 mt-5">
      <Button size="sm" variant="outline" className="flex items-center">
        <Star size={14} className="mr-1" /> Write a Review
      </Button>

      {websiteUrl && (
        <ProtectedButton
          size="sm"
          variant="outline"
          className="flex items-center gap-1 px-2 py-1"
          onClick={() =>
            window.open(websiteUrl, "_blank", "noopener,noreferrer")
          }
        >
          <Globe size={14} />
          <span>Visit Website</span>
          <ExternalLink size={12} />
        </ProtectedButton>
      )}

      {hasContact && (
        <Dialog>
          <DialogTrigger asChild>
            <ProtectedButton
              size="sm"
              variant="ghost"
              className="flex items-center"
            >
              <Phone size={14} className="mr-1" /> Contact
            </ProtectedButton>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg mx-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold mb-4">
                Contact Details
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 text-sm w-full">
              {phone && phone?.length > 0 && (
                <div className="w-full bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center font-medium text-foreground mb-2">
                    <Phone size={18} className="mr-2 text-blue-500" />
                    <span>Phone</span>
                  </div>
                  <ul className="ml-6 space-y-2">
                    {phone.map((p, i) => (
                      <li key={i} className="flex items-center">
                        <a
                          href={`tel:${p}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {email && email?.length > 0 && (
                <div className="w-full bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center font-medium text-foreground mb-2">
                    <Mail size={18} className="mr-2 text-green-500" />
                    <span>Email</span>
                  </div>
                  <ul className="ml-6 space-y-2">
                    {email.map((e, i) => (
                      <li key={i} className="flex items-center">
                        <a
                          href={`mailto:${e}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {e}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CollegeActions;
