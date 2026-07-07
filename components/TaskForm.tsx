"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { startCase } from "es-toolkit";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useTransition } from "react";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";
import { createTaskSchema, CreateTask } from "@/lib/schemas";
import { toast } from "sonner";
import { TaskDto } from "@/models/Task";
import { Textarea } from "./ui/textarea";

export default function TaskForm({
  action,
  task,
  onSuccessAction,
}: {
  action: "create" | "update";
  task?: TaskDto;
  onSuccessAction?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: action === "update" ? (task?.title as string) : "",
      description: action === "update" ? (task?.description as string) : "",
    },
  });

  const onSubmit = async (data: CreateTask) => {
    startTransition(async () => {
      const res =
        action === "create"
          ? await createTaskAction(data)
          : await updateTaskAction(task?._id as string, data);

      if ("error" in res) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      reset();
      if (onSuccessAction) onSuccessAction();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{startCase(field.name)}</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} placeholder="Enter title..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{startCase(field.name)}</FieldLabel>
              <Textarea
                {...field}
                rows={5}
                aria-invalid={fieldState.invalid}
                placeholder="Enter description..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit">
            {isPending ? (
              <>
                <Spinner /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
