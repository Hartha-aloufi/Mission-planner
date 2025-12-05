import { useNavigate, useSearch } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/FilterBadge";
import { MissionCard } from "@/components/MissionCard";
import { SearchInputURLSynced } from "@/components/SearchInput";
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
  const searchQuery = search.q || "";

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

  // Filter missions based on search query and status filters
  const filteredMissions = mockMissions.filter((mission) => {
    // Filter by search query
    const matchesSearch = mission.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by status (if any filters are active)
    const matchesFilter =
      activeFilters.size === 0 || activeFilters.has(mission.status);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-5 p-5 pb-2 flex-1 overflow-hidden">
      {/* Search Input */}
      <SearchInputURLSynced placeholder="Search missions..." />

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
            ({filteredMissions.length})
          </span>
        </h3>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2.5 pe-4 pb-10">
            {filteredMissions.map((mission) => (
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
