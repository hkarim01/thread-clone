"use server";

import { currentUser } from "@clerk/nextjs";

export async function getUserFromClerk() {
  const user = await currentUser();
  return JSON.stringify(user);
}
