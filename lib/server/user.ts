// server.ts
import "server-only";
import { errAsync, okAsync } from "neverthrow";
import User from "@/models/User";
import mongoose from "mongoose";
import { CreateUser } from "../schemas";

export async function createUserService(user: CreateUser) {
  try {
    return okAsync(await User.create(user));
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const firstKey = Object.keys(error.errors)[0];
      const errorMessage = error.errors[firstKey]?.message || "Validation error";

      return errAsync({
        reason: "VALIDATION",
        message: `Field ${firstKey}: ${errorMessage}`,
      } as const);
    }

    return errAsync({
      reason: "UNEXPECTED",
      message: error instanceof Error ? error.message : "Something went wrong",
    } as const);
  }
}

export async function updateUserService(user: CreateUser, userId: string) {
  try {
    return okAsync(
      await User.findByIdAndUpdate(userId, user, {
        new: true,
        runValidators: true,
        context: "query",
      }),
    );
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const firstKey = Object.keys(error.errors)[0];
      const errorMessage = error.errors[firstKey]?.message || "Validation error";

      return errAsync({
        reason: "VALIDATION",
        message: `Field ${firstKey}: ${errorMessage}`,
      } as const);
    }

    return errAsync({
      reason: "UNEXPECTED",
      message: error instanceof Error ? error.message : "Something went wrong",
    } as const);
  }
}

export async function deleteUserService(userId: string) {
  try {
    return okAsync(await User.findByIdAndDelete(userId));
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.CastError) {
      return errAsync({
        reason: "CAST_ERROR",
        message: error.message,
      } as const);
    }

    return errAsync({
      reason: "UNEXPECTED",
      message: error instanceof Error ? error.message : "Something went wrong",
    } as const);
  }
}
