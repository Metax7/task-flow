"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Signup, signupSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { T, useGT, Branch } from "gt-next";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const gt = useGT();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Signup>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: Signup) => {
    const hashedEmail = CryptoJS.SHA256(values.email);

    const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?d=robohash&f=y`;

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      image: gravatarUrl,
      password: values.password,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });

    if (error) {
      toast.error(error.message || gt("Something went wrong"));
      return;
    }

    reset();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only"><T>Acme Inc.</T></span>
            </Link>
            <T>
              <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            </T>
            <FieldDescription>
              <T>Already have an account?</T>{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                <T>Sign in</T>
              </Link>
            </FieldDescription>
          </div>

          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}><T>Name</T></FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={gt("John Doe")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}><T>Email</T></FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={gt("m@example.com")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}><T>Password</T></FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={gt("Enter password...")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field>
            <Button disabled={isSubmitting} type="submit">
              <T>
                <Branch branch={isSubmitting}
                  false={"Create Account"}
                  true={"Creating account..."}
                />
              </T>
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        <T>By clicking continue, you agree to our</T> <a href="#"><T>Terms of Service</T></a><T> and</T>{" "}
        <a href="#"><T>Privacy Policy</T></a>.
      </FieldDescription>
    </div>
  );
}
