import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { resetIngresses } from "@/actions/ingress";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  //GET HEADERS
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  //NO HEADERS ERROR
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  //GET THE BODY
  const payload = await req.json();
  const body = JSON.stringify(payload);

  //CREATE NEW SVIX INSTANCE
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  //VERIFY PAYLOAD WITH HEADERS
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  //GET ID AND TYPE
  const eventType = evt.type;

  if (eventType === "user.created") {
    await db.user.create({
      data: {
        externalUserId: payload.data.id,
        username: payload.data.username,
        imageUrl: payload.data.image_url,
        stream: {
          create: {
            name: `${payload.data.username}'s stream`,
          },
        },
      },
    });
  }

  if (eventType === "user.updated") {
    const currentUser = await db.user.findUnique({
      where: {
        externalUserId: payload.data.id,
      },
    });

    if (!currentUser) {
      return new Response("User not found", { status: 404 });
    }

    await db.user.update({
      where: {
        externalUserId: payload.data.id,
      },
      data: {
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    await resetIngresses(payload.data.id);

    await db.user.delete({
      where: {
        externalUserId: payload.data.id,
      },
    });
  }

  return new Response("", { status: 200 });
}
