import { useNavigate, useSearch } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MissionCard } from "@/components/MissionCard";
import { MissionCardSkeleton } from "@/components/MissionCardSkeleton";
import { useMissions } from "@/api/missions";

export function MissionsList() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const { data: missions, isLoading, error } = useMissions();

  const activeFilters = new Set(search.filters || []);
  const selectedMissionId = search.selectedMission || null;
  const searchQuery = search.q || "";

  const selectMission = (id: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        selectedMission: id,
      }),
    });
  };

  // Filter missions based on search query and status filters
  const filteredMissions = (missions || []).filter((mission) => {
    // Filter by search query
    const matchesSearch = mission.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by status (if any filters are active)
    const matchesFilter =
      activeFilters.size === 0 || activeFilters.has(mission.status);

    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="space-y-3 min-h-0 flex-1 overflow-hidden flex flex-col ps-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          All Missions
        </h3>
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Error loading missions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 min-h-0 flex-1 overflow-hidden flex flex-col ps-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ">
        All Missions
        <span className="text-xs text-muted-foreground">
          {" "}
          {isLoading ? "" : `(${filteredMissions.length})`}
        </span>
      </h3>
      <ScrollArea className="h-full">
        <div className="space-y-2.5 pe-5 pb-10">
          {isLoading ? (
            <>
              <MissionCardSkeleton />
              <MissionCardSkeleton />
              <MissionCardSkeleton />
              <MissionCardSkeleton />
              <MissionCardSkeleton />
            </>
          ) : (
            filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isSelected={selectedMissionId === mission.id}
                onClick={() => selectMission(mission.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
