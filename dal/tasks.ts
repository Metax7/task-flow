"use cache";

import { dbConnect } from "@/lib/db";
import Task, { TaskDto } from "@/models/Task";
import { PaginateResult } from "mongoose";
import { cacheLife, cacheTag } from "next/cache";

function mapTaskToDto(task: any): TaskDto {
  return {
    _id: task._id.toString(),
    title: task.title,
    description: task.description,
    author: task.author
      ? {
          _id: task.author._id.toString(),
          name: task.author.name,
          email: task.author.email,
          image: task.author.image,
        }
      : {
          _id: "unknown",
          name: "Unknown Author",
          email: "",
        },
    createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
    updatedAt: task.updatedAt instanceof Date ? task.updatedAt.toISOString() : task.updatedAt,
  };
}

export async function getTasks(): Promise<PaginateResult<TaskDto>> {
  await dbConnect();
  cacheTag("tasks");
  cacheLife("hours");

  const tasks = await Task.paginate({}, { lean: true, populate: "author", sort: { createdAt: -1 } });

  return {
    ...tasks,
    docs: tasks.docs.map(mapTaskToDto),
  } as unknown as PaginateResult<TaskDto>;
}

export async function getUserTasks(userId: string): Promise<PaginateResult<TaskDto>> {
  await dbConnect();
  cacheTag("tasks");
  cacheLife("hours");

  const tasks = await Task.paginate({ author: userId }, { lean: true, populate: "author", sort: { createdAt: -1 } });

  return {
    ...tasks,
    docs: tasks.docs.map(mapTaskToDto),
  } as unknown as PaginateResult<TaskDto>;
}


