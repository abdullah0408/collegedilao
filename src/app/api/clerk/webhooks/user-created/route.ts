import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserJSON as DefaultUserJSON } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface UserJSON extends DefaultUserJSON {
  unsafe_metadata: {
    fullName?: string;
    phoneNumber?: string;
    interestedInCourses?: string;
    targetedEducationLevel?: string;
  };
}

export async function POST(req: Request) {
  const CLERK_USER_CREATED_WEBHOOK_SECRET_KEY =
    process.env.CLERK_USER_CREATED_WEBHOOK_SECRET_KEY;

  if (!CLERK_USER_CREATED_WEBHOOK_SECRET_KEY) {
    throw new Error(
      "Error: Please add CLERK_USER_CREATED_WEBHOOK_SECRET_KEY from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(CLERK_USER_CREATED_WEBHOOK_SECRET_KEY);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;
  const user = evt.data as UserJSON;

  if (eventType === "user.created") {
    const clerkUserId = user.id;
    const email = user.email_addresses?.[0]?.email_address ?? "";
    const metadata = user.unsafe_metadata ?? {};
    const profilePictureUrl = user.image_url ?? null;

    const fullName =
      typeof metadata.fullName === "string"
        ? metadata.fullName
        : "No name provided";
    const phoneNumber =
      typeof metadata.phoneNumber === "string" ? metadata.phoneNumber : null;
    const interestedInCourses =
      typeof metadata.interestedInCourses === "string"
        ? metadata.interestedInCourses
        : null;
    const targetedEducationLevel =
      typeof metadata.targetedEducationLevel === "string"
        ? metadata.targetedEducationLevel
        : null;

    try {
      if (!email || !clerkUserId || !phoneNumber) {
        return new Response("Missing required data for user creation", {
          status: 400,
        });
      }

      await prisma.user.create({
        data: {
          clerkUserId,
          email,
          fullName,
          phoneNumber,
          profilePictureUrl,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response(`Error creating user: ${error}`, { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
