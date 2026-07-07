"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TaskDto } from "@/models/Task";
import { Trash, Edit } from "lucide-react";
import { deleteTaskAction } from "@/actions/tasks";
import { toast } from "sonner";
import TaskForm from "./TaskForm";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TaskCard({ task }: { task: TaskDto }) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const isAuthor = session?.user && task.author?._id === session.user.id;

  const handleDeleteTask = async () => {
    const res = await deleteTaskAction(task._id);

    if ("error" in res) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  const authorName = task.author?.name || "Unknown Author";
  const authorImage = task.author?.image;

  return (
    <Card className="flex flex-col h-full justify-between">
      <div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{task.title}</CardTitle>
          {isAuthor && (
            <CardAction className="flex gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Edit className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm action="update" task={task} onSuccessAction={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
              <Button size="icon" variant="destructive" onClick={handleDeleteTask}>
                <Trash className="size-4" />
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="text-muted-foreground wrap-break-words">
          {task.description}
        </CardContent>
      </div>

      <CardFooter className="justify-between border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground/60">Created by:</span>
          <div className="flex items-center gap-1.5">
            <Avatar>
              {authorImage && <AvatarImage src={authorImage} alt={authorName} />}
              <AvatarFallback className="text-xs">
                {authorName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{authorName}</span>
          </div>
        </div>
        <time dateTime={task.createdAt}>{format(new Date(task.createdAt), "MMM d, yyyy")}</time>
      </CardFooter>
    </Card>
  );
}
