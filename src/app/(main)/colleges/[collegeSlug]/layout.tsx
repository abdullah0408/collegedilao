import { prisma } from "@/lib/prisma";
import CollegeHead from "@/components/CollegeHead";
import EntityNavbar from "@/components/EntityNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cache } from "react";
import { Metadata } from "next";

export const revalidate = 86400; // Revalidate this layout every 24 hours

const getEntity = cache(async (collegeSlug: string) => {
  console.log(`[${new Date().toISOString()}] Prisma fetching: ${collegeSlug}`); // [CHECK] revalidation logs
  //
  // Fetch the basic “entity” data from Prisma.
  //
  const entity = await prisma.entity.findUnique({
    where: { slug: collegeSlug },
    select: {
      name: true,
      logo: true,
      banner: true,
      website: true,
      instagram: true,
      facebook: true,
      twitter: true,
      linkedin: true,
      city: {
        select: { name: true },
      },
      state: {
        select: { name: true },
      },
      nirfRank: true,
      naacGrade: true,
      establishedYear: true,
      typeCode: true,
      genderAccepted: true,
      area: true,
      approvals: {
        select: {
          approvalBodyCode: true,
          grade: true,
        },
      },
      avgFee: true,
      avgPackage: true,
      description: true,
      phone: true,
      email: true,
      info: true, // Fallback info field
    },
  });

  // If no entity is found, return null.
  if (!entity) {
    return null;
  }

  return entity;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collegeSlug: string }>;
}): Promise<Metadata> {
  const { collegeSlug } = await params;
  const slug = collegeSlug.trim().toLowerCase();
  const entity = await getEntity(slug);

  return {
    title: `${entity?.name}`,
    description:
      entity?.description || entity?.info || `Explore ${entity?.name}`,
    openGraph: {
      images: [
        `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${
          !!entity?.logo ? entity?.logo : "default-logo.png"
        }`,
      ],
      title: entity?.name + " | College Dilao",
      description: entity?.description,
    },
  };
}

export default async function EntityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ collegeSlug: string }>;
}) {
  const { collegeSlug } = await params;
  // Normalize the incoming slug (trim whitespace, lowercase).
  const slug = collegeSlug.trim().toLowerCase();

  const entity = await getEntity(slug);

  try {
    // If the slug didn’t match any record, throw to trigger fallback UI.
    if (!entity) {
      throw new Error("Entity not found");
    }

    return (
      <>
        <CollegeHead
          entity={{
            name: entity.name,
            logo: entity.logo,
            banner: entity.banner,
            website: entity.website,
            instagram: entity.instagram,
            facebook: entity.facebook,
            twitter: entity.twitter,
            linkedin: entity.linkedin,
            city: entity.city,
            state: entity.state,
            nirfRank: entity.nirfRank,
            naacGrade: entity.naacGrade,
            establishedYear: entity.establishedYear,
            typeCode: entity.typeCode,
            genderAccepted: entity.genderAccepted,
            area: entity.area,
            approvals: entity.approvals,
            avgFee: entity.avgFee,
            avgPackage: entity.avgPackage,
            phone: entity.phone,
            email: entity.email,
            courses: [], // Hardcoded for now [TODO]
          }}
        />

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <EntityNavbar />
              {children}
            </div>

            {/* Right column: Sidebar (future widgets, stats, ads, etc.) */}
            <aside className="lg:w-1/3">{/* TODO: Sidebar widgets*/}</aside>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in EntityLayout:", error);

    // Fallback UI when entity is not found or another error happens.
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Entity Not Found</h1>
        <p className="text-gray-600">
          We couldn&apos;t find the college/university you&apos;re looking for.
        </p>
        <Link href="/">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            Go back to home
          </Button>
        </Link>
      </div>
    );
  }
}
