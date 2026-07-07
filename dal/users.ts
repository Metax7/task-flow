"use cache";

import { dbConnect } from "@/lib/db";
import User, { UserDto } from "@/models/User";
import { cacheLife, cacheTag } from "next/cache";

export async function getUsers(): Promise<UserDto[]> {
  await dbConnect();
  cacheTag("users");
  cacheLife("hours");

  const users = await User.find({}).lean().sort({ createdAt: -1 });

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));
}
