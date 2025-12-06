import { useNavigate, useSearch } from "@tanstack/react-router";
import { missionStatusConfig, type MissionStatus } from "@/types/mission";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const filterStatuses: MissionStatus[] = [
  "valid",
  "partially_outside_site",
  "intersects_restricted_hole",
  "intersects_no_fly_zone",
  "invalid_geometry",
];

// Abbreviated labels for compact view
const abbreviations: Record<MissionStatus, string> = {
  valid: "V",
  partially_outside_site: "PS",
  intersects_restricted_hole: "RH",
  intersects_no_fly_zone: "NFZ",
  invalid_geometry: "IG",
};

export function CollapsedFilters() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const activeFilters = new Set(search.filters || []);

  const toggleFilter = (status: MissionStatus) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(status)) {
      newFilters.delete(status);
    } else {
      newFilters.add(status);
    }

    navigate({
      search: (prev) => ({
        ...prev,
        filters: Array.from(newFilters),
      }),
    });
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 p-2">
        {filterStatuses.map((status) => {
          const config = missionStatusConfig[status];
          const isActive = activeFilters.has(status);

          return (
            <Tooltip key={status}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleFilter(status)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "text-xs font-bold cursor-pointer transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    isActive && [config.color, "text-white shadow-md"],
                    !isActive && [
                      "bg-background border border-border/50",
                      "text-muted-foreground hover:border-border",
                    ]
                  )}
                >
                  {abbreviations[status]}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{config.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
