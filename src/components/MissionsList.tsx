import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/FilterBadge";
import { MissionCard } from "@/components/MissionCard";
import { mockMissions, type MissionStatus } from "@/types/mission";

const filterStatuses: MissionStatus[] = [
  "valid",
  "partially_outside_site",
  "intersects_restricted_hole",
  "intersects_no_fly_zone",
  "invalid_geometry",
];

export function MissionsList() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const activeFilters = new Set(search.filters || []);
  const selectedMissionId = search.selectedMission || null;

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

  const selectMission = (id: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        selectedMission: id,
      }),
    });
  };

  const clearFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        filters: [],
      }),
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5 pb-2 flex-1 overflow-hidden">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search missions..."
          className="pl-9 h-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Filter Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between min-h-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </h3>
          {activeFilters.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
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
      <div className="space-y-3 min-h-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ">
          All Missions
          <span className="text-xs text-muted-foreground">
            {" "}
            ({mockMissions.length})
          </span>
        </h3>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2.5 pe-4 pb-10">
            {mockMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isSelected={selectedMissionId === mission.id}
                onClick={() => selectMission(mission.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
