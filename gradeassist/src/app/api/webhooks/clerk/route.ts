import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/server/db";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id);

      // Check if organization exists, if not create a default one
      let organization = await db.organization.findFirst({
        where: { slug: "default" },
      });

      if (!organization) {
        organization = await db.organization.create({
          data: {
            name: "Default Organization",
            slug: "default",
          },
        });
      }

      await db.user.create({
        data: {
          clerkId: id,
          email: primaryEmail?.email_address || "",
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          organizationId: organization.id,
          role: "MARKER",
        },
      });

      console.log("User created in database:", id);
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    try {
      const { email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id);

      await db.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });

      console.log("User updated in database:", id);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  if (eventType === "user.deleted") {
    try {
      await db.user.delete({
        where: { clerkId: id },
      });

      console.log("User deleted from database:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return NextResponse.json({ success: true });
}
