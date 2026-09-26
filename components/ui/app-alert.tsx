"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, X, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AppAlertProps = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  onClose?: () => void;
  autoDismiss?: number;
};

const alertTypes = {
  success: { Icon: CheckCircle2Icon, iconClass: "text-green-600", role: "status" as const },
  error: { Icon: XIcon, iconClass: "text-destructive", role: "alert" as const },
  warning: { Icon: AlertTriangleIcon, iconClass: "text-amber-600", role: "status" as const },
  info: { Icon: InfoIcon, iconClass: "text-blue-600", role: "status" as const },
};

export function AppAlert({ type, title, description, onClose, autoDismiss }: AppAlertProps) {
  const { Icon, iconClass, role } = alertTypes[type];

  useEffect(() => {
    if (!autoDismiss || !onClose) return;
    const timer = window.setTimeout(onClose, autoDismiss);
    return () => window.clearTimeout(timer);
  }, [autoDismiss, onClose]);

  return (
    <section role={role} className={`flex items-start gap-3 rounded-md border border-border bg-background p-4 shadow-lg ${type === "error" ? "*:text-destructive!" : ""}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {onClose && <Button type="button" variant="ghost" size="icon-xs" onPress={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Cerrar aviso"><X className="size-4" /></Button>}
    </section>
  );
}