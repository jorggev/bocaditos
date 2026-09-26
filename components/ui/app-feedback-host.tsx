"use client";

import { AppAlert } from "@/components/ui/app-alert";
import { useStore } from "@/lib/store";

export function AppFeedbackHost() {
  const feedback = useStore((state) => state.feedback);
  const clearFeedback = useStore((state) => state.clearFeedback);

  if (!feedback) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] w-[min(92vw,26rem)]">
      <AppAlert
        key={feedback.id}
        type={feedback.type}
        title={feedback.title}
        description={feedback.description}
        autoDismiss={feedback.autoDismiss ?? 5000}
        onClose={clearFeedback}
      />
    </div>
  );
}