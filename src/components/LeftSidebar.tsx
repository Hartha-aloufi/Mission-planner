import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/FilterBadge";
import { MissionCard } from "@/components/MissionCard";
import { mockMissions, type MissionStatus } from "@/types/mission";
import { cn } from "@/lib/utils";

const filterStatuses: MissionStatus[] = [
  "valid",
  "partially_outside_site",
  "intersects_restricted_hole",
  "intersects_no_fly_zone",
  "invalid_geometry",
];

export function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<MissionStatus>>(
    new Set()
  );

  const toggleFilter = (status: MissionStatus) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(status)) {
      newFilters.delete(status);
    } else {
      newFilters.add(status);
    }
    setActiveFilters(newFilters);
  };

  return (
    <div
      className={cn(
        "h-full border-e bg-background transition-all duration-300 flex flex-col",
        isCollapsed ? "w-12" : "w-96"
      )}
    >
      {/* Toggle Button */}
      <div className="p-2 border-b flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-4 p-4 flex-1 overflow-hidden">
          {/* Search Input */}
          <div>
            <Input placeholder="search mission by name" />
          </div>

          {/* Filter Badges */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filterStatuses.map((status) => (
                <FilterBadge
                  key={status}
                  status={status}
                  isActive={activeFilters.has(status)}
                  onClick={() => toggleFilter(status)}
                />
              ))}
            </div>
          </div>

          {/* Mission List */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <h3 className="text-sm font-semibold mb-2">
              Missions ({mockMissions.length})
            </h3>
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-2 pe-4">
                {mockMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
