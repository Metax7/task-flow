"use server";

import { CreateUser, createUserSchema } from "@/lib/schemas";
import { createUserService, updateUserService } from "@/lib/server/user";
import { updateTag } from "next/cache";
import { deleteUserService } from "@/lib/server/user";

export async function createUserAction(user: CreateUser) {
  const validatedFields = createUserSchema.safeParse(user);

  const { success, data } = validatedFields;

  if (!success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const res = await createUserService(data);

  return res.match(
    (user) => {
      updateTag("users");
      return {
        success: true,
        message: `User '${user.name}' has been successfully created`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNEXPECTED": {
          return {
            error: "Unexpected",
            message: error.message,
          };
        }

        case "VALIDATION": {
          return {
            error: "Validation",
            message: error.message,
          };
        }

        default: {
          throw new Error(`Unhandled error: ${reason satisfies never}`);
        }
      }
    },
  );
}

export async function updateUserAction(userId: string, user: CreateUser) {
  const validatedFields = createUserSchema.safeParse(user);

  const { success, data } = validatedFields;

  if (!success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const res = await updateUserService(data, userId);

  return res.match(
    (user) => {
      updateTag("users");
      return {
        success: true,
        message: `User '${user?.name}' has been successfully updated`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNEXPECTED": {
          return {
            error: "Unexpected",
            message: error.message,
          };
        }

        case "VALIDATION": {
          return {
            error: "Validation",
            message: error.message,
          };
        }

        default: {
          throw new Error(`Unhandled error: ${reason satisfies never}`);
        }
      }
    },
  );
}

export async function deleteUserAction(userId: string) {
  const res = await deleteUserService(userId);

  return res.match(
    (user) => {
      updateTag("users");
      return {
        success: true,
        message: `User '${user?.name}' has been successfully deleted`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNEXPECTED": {
          return {
            error: "Unexpected",
            message: error.message,
          };
        }

        case "CAST_ERROR": {
          return {
            error: "Cast Error",
            message: error.message,
          };
        }

        default: {
          throw new Error(`Unhandled error: ${reason satisfies never}`);
        }
      }
    },
  );
}
