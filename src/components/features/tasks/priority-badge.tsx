import { Badge } from "@/components/ui/badge";
import { PRIORITIES } from "@/lib/utils/constants";
import type { TaskPriority } from "@/types/tasks";

const variantMap: Record<TaskPriority, "default" | "cyan" | "amber" | "pink"> = {
  low: "default",
  medium: "cyan",
  high: "amber",
  urgent: "pink",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant={variantMap[priority]}>
      {PRIORITIES[priority].label}
    </Badge>
  );
}
