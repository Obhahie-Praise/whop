"use server";

import { prisma } from "@/lib/prisma";

export async function joinWaitlist(email: string, source: string | null) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await prisma.waitlist.create({
      data: {
        email,
        source: source || null,
      },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "This email is already on the waitlist!" };
    }
    return { success: false, error: "Failed to join. Please try again." };
  }
}
