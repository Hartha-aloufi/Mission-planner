import { Badge } from "@/components/ui/badge";
import { missionStatusConfig } from "@/types/mission";
import { type Mission } from "@/types/mission";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const statusConfig = missionStatusConfig[mission.status];

  return (
    <div
      className={cn(
        "p-3 border rounded-lg cursor-pointer transition-colors",
        "hover:bg-accent/50",
        "flex flex-col gap-2"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-tight flex-1">
          {mission.name}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Badge
          variant={statusConfig.variant}
          className={cn("text-xs", statusConfig.color, "text-white")}
        >
          {statusConfig.label}
        </Badge>

        <span className="text-xs text-muted-foreground">
          {mission.area.toLocaleString()} m²
        </span>
      </div>
    </div>
  );
}
