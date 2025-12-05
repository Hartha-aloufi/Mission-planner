import { Badge } from "@/components/ui/badge";
import { missionStatusConfig } from "@/types/mission";
import { type Mission } from "@/types/mission";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MissionCard({
  mission,
  isSelected = false,
  onClick,
}: MissionCardProps) {
  const statusConfig = missionStatusConfig[mission.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl cursor-pointer transition-all duration-200",
        "bg-card border-2",
        "hover:bg-accent/20",
        "group",
        isSelected
          ? "border-primary bg-accent/10"
          : "border-border/50 hover:border-border"
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Mission Name */}
        <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
          {mission.name}
        </h3>

        {/* Status and Area */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant={statusConfig.variant}
            className={cn(
              "text-xs font-medium px-2.5 py-0.5",
              statusConfig.color,
              "text-white"
            )}
          >
            {statusConfig.label}
          </Badge>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {mission.area.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground/70">m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
