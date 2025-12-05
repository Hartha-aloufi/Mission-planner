import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { missionStatusConfig } from "@/types/mission";
import { type MissionStatus } from "@/types/mission";

interface FilterBadgeProps {
  status: MissionStatus;
  isActive: boolean;
  onClick: () => void;
}

export function FilterBadge({ status, isActive, onClick }: FilterBadgeProps) {
  const config = missionStatusConfig[status];

  return (
    <Badge
      variant={isActive ? config.variant : "outline"}
      className={cn(
        "cursor-pointer transition-all hover:scale-105",
        isActive && config.color,
        isActive && "text-white",
        !isActive && "opacity-60 hover:opacity-100"
      )}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
}
