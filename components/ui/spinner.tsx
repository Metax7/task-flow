"use client";

import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { useGT } from "gt-next"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const gt = useGT()
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={gt("Loading")} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
