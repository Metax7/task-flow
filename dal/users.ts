"use cache";

import dbConnect from "@/lib/db";
import User, { UserDto } from "@/models/User";
import { PaginateResult } from "mongoose";
import { cacheLife, cacheTag } from "next/cache";

export async function getUsers(): Promise<PaginateResult<UserDto>> {
  await dbConnect();
  cacheTag("users");
  cacheLife("hours");

  const users = await User.paginate({}, { lean: true });

  return JSON.parse(JSON.stringify(users));
}
