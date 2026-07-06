"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { startCase } from "es-toolkit";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useTransition } from "react";
import { createUserAction, updateUserAction } from "@/actions/users";
import { createUserSchema, CreateUser } from "@/lib/schemas";
import { toast } from "sonner";

export default function UserForm({
  action,
  userId,
  onSuccess,
}: {
  action: "create" | "update";
  userId?: string;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (data: CreateUser) => {
    startTransition(async () => {
      const res =
        action === "create"
          ? await createUserAction(data)
          : await updateUserAction(userId as string, data);

      if ("error" in res) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      reset();
      if (onSuccess) onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{startCase(field.name)}</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} placeholder="Enter name..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{startCase(field.name)}</FieldLabel>
              <Input
                {...field}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter name..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{startCase(field.name)}</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} placeholder="Enter name..." />
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
