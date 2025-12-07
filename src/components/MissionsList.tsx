import { useEffect, useRef } from "react";
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
  const missionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const selectMission = (id: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        selectedMission: id,
      }),
    });
  };

  // Scroll to selected mission card
  useEffect(() => {
    if (selectedMissionId) {
      const element = missionRefs.current.get(selectedMissionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [selectedMissionId]);

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

  const missionsListItems = filteredMissions.map((mission) => (
    <div
      key={mission.id}
      ref={(el) => {
        if (el) {
          missionRefs.current.set(mission.id, el);
        } else {
          missionRefs.current.delete(mission.id);
        }
      }}
    >
      <MissionCard
        mission={mission}
        isSelected={selectedMissionId === mission.id}
        onClick={() => selectMission(mission.id)}
      />
    </div>
  ));

  if (error) {
    return (
      <div className="space-y-3 min-h-0 flex-1 overflow-hidden flex flex-col ps-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          All Missions
        </h3>
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Error loading missions!
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
          ) : filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-4 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                No missions found
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery || activeFilters.size > 0
                  ? "Try adjusting your search or filters to see more results."
                  : "There are no missions available at the moment."}
              </p>
            </div>
          ) : (
            missionsListItems
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
