"use server";

import { revalidatePath } from "next/cache";
import { followeUser, unfollowUser } from "@/lib/follow-service";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followeUser(id);

    revalidatePath("/");
    if (followedUser) {
      revalidatePath(`/${followedUser.following.username}`);
    }

    return followedUser;
  } catch (error) {
    throw new Error("Internal error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unfollowedUser = await unfollowUser(id);

    revalidatePath("/");

    if (unfollowedUser) {
      revalidatePath(`/${unfollowedUser.following.username}`);
    }

    return unfollowedUser;
  } catch (error) {
    throw new Error("Internal error");
  }
};
