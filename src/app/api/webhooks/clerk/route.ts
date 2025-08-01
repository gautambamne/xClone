import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from clerk Dashboard to .env or .env.local');
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = headers();
  const svix_id = (await headerPayload).get('svix-id');
  const svix_timestamp = (await headerPayload).get('svix-timestamp');
  const svix_signature = (await headerPayload).get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
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
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }
  const {id} = evt.data
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type od ${eventType}`)
  console.log('Webhook payload:', body)

  if (eventType === "user.created") {
    try {
      await prisma.user.create({
        data: {
          id: evt.data.id,
          username: evt.data.username!,
          email: evt.data.email_addresses[0]?.email_address,
        },
      });
      return new Response ("User Created", {status:200})
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response('Error: Failed to create a user!', {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({where:{id: evt.data.id}});
      return new Response ("User deleted", {status:200})
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response('Error: Failed to create a user!', {
        status: 500,
      });
    }
  }

  return new Response('Webhook received', { status: 200 });
}