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
        "cursor-pointer transition-all duration-200 text-xs font-medium px-3 py-1.5",
        isActive && [
          config.color,
          "text-white shadow-sm border-transparent",
        ],
        !isActive && [
          "opacity-70 hover:opacity-100 hover:border-current",
          "hover:bg-accent/30",
        ]
      )}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
}
