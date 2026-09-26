"use client";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type ButtonDestructiveProps = Omit<ComponentProps<typeof Button>, "onPress" | "variant"> & {
  confirmMessage: string;
  onConfirmed: () => void;
};

export function ButtonDestructive({ confirmMessage, onConfirmed, ...props }: ButtonDestructiveProps) {
  return (
    <Button
      {...props}
      variant="destructive"
      onPress={() => {
        if (window.confirm(confirmMessage)) onConfirmed();
      }}
    />
  );
}