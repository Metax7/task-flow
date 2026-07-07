"use server";

import { CreateTask, createTaskSchema } from "@/lib/schemas";
import { createTaskService, updateTaskService } from "@/lib/server/task";
import { updateTag } from "next/cache";
import { deleteTaskService } from "@/lib/server/task";

export async function createTaskAction(task: CreateTask) {
  const validatedFields = createTaskSchema.safeParse(task);

  const { success, data } = validatedFields;

  if (!success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const res = await createTaskService(data);

  return res.match(
    (task) => {
      updateTag("tasks");
      return {
        success: true,
        message: `Task '${task.title}' has been successfully created`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNAUTHORIZED": {
          return {
            error: "Unauthorized",
            message: error.message,
          };
        }

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

export async function updateTaskAction(taskId: string, task: CreateTask) {
  const validatedFields = createTaskSchema.safeParse(task);

  const { success, data } = validatedFields;

  if (!success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const res = await updateTaskService(data, taskId);

  return res.match(
    (user) => {
      updateTag("tasks");
      return {
        success: true,
        message: `Task '${user?.title}' has been successfully updated`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNAUTHORIZED": {
          return {
            error: "Unauthorized",
            message: error.message,
          };
        }

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

export async function deleteTaskAction(taskId: string) {
  const res = await deleteTaskService(taskId);

  return res.match(
    (task) => {
      updateTag("tasks");
      return {
        success: true,
        message: `Task '${task?.title}' has been successfully deleted`,
      };
    },
    (error) => {
      const reason = error.reason;

      switch (reason) {
        case "UNAUTHORIZED": {
          return {
            error: "Unauthorized",
            message: error.message,
          };
        }

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
