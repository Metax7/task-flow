"use client";

import { authClient } from "@/lib/auth-client";
import { Button, ButtonProps } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { T } from "gt-next";

export default function SignoutButton({
  className,
  variant = "secondary",
  size = "default",
}: ButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        });
      }}
    >
      <LogOut className="size-4 mr-2" />
      <T>Sign Out</T>
    </Button>
  );
}
