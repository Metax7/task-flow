import "server-only";
import { errAsync, okAsync } from "neverthrow";
import Task from "@/models/Task";
import mongoose from "mongoose";
import { CreateTask } from "../schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createTaskService(task: CreateTask) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return errAsync({
        reason: "UNAUTHORIZED",
        message: "You must be signed in to create a task",
      } as const);
    }

    return okAsync(
      await Task.create({
        ...task,
        author: session.user.id,
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

export async function updateTaskService(task: CreateTask, taskId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return errAsync({
        reason: "UNAUTHORIZED",
        message: "You must be signed in to update a task",
      } as const);
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return errAsync({
        reason: "VALIDATION",
        message: "Task not found",
      } as const);
    }

    if (existingTask.author.toString() !== session.user.id) {
      return errAsync({
        reason: "UNAUTHORIZED",
        message: "You are not authorized to update this task",
      } as const);
    }

    return okAsync(
      await Task.findByIdAndUpdate(taskId, task, {
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

export async function deleteTaskService(taskId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return errAsync({
        reason: "UNAUTHORIZED",
        message: "You must be signed in to delete a task",
      } as const);
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return errAsync({
        reason: "CAST_ERROR",
        message: "Task not found",
      } as const);
    }

    if (existingTask.author.toString() !== session.user.id) {
      return errAsync({
        reason: "UNAUTHORIZED",
        message: "You are not authorized to delete this task",
      } as const);
    }

    return okAsync(await Task.findByIdAndDelete(taskId));
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
