"use client";

import { LoaderCircleIcon } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

type ButtonLoadingProps = Omit<ComponentProps<typeof Button>, "children" | "isDisabled"> &
  VariantProps<typeof buttonVariants> & { label: string; isDisabled?: boolean };

export function ButtonLoading({ label, isDisabled = true, ...props }: ButtonLoadingProps) {
  return (
    <Button isDisabled={isDisabled} {...props}>
      <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </Button>
  );
}