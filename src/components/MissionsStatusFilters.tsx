import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/FilterBadge";
import { type MissionStatus } from "@/types/mission";

const filterStatuses: MissionStatus[] = [
  "valid",
  "partially_outside_site",
  "intersects_restricted_hole",
  "intersects_no_fly_zone",
  "invalid_geometry",
];

export function MissionsStatusFilters() {
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

  const clearFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        filters: [],
      }),
    });
  };

  return (
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
  );
}
