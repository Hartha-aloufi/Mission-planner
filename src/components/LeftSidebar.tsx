import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionsList } from "@/components/MissionsList";
import { CollapsedFilters } from "@/components/CollapsedFilters";
import { SearchInputURLSynced } from "@/components/SearchInput";
import { MissionsStatusFilters } from "@/components/MissionsStatusFilters";
import { DrawMissionButton } from "@/components/DrawMissionButton";
import { cn } from "@/lib/utils";
import {
  useIsLeftSidebarCollapsed,
  useToggleLeftSidebar,
} from "@/stores/useUIStore";

export function LeftSidebar() {
  const isCollapsed = useIsLeftSidebarCollapsed();
  const toggleLeftSidebar = useToggleLeftSidebar();

  return (
    <div
      className={cn(
        "h-full max-h-screen sidebar-surface transition-all duration-300 flex flex-col relative",
        isCollapsed ? "w-14" : "w-[360px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-b border-border/50 flex items-center transition-all duration-300",
          isCollapsed ? "px-2 py-4 justify-center" : "px-5 py-4 justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-lg font-semibold tracking-tight">Missions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage drone flight paths
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleLeftSidebar}
          className="hover:bg-accent/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isCollapsed ? (
          <div className="animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-3 p-2">
            <DrawMissionButton collapsed />
            <div className="border-t border-border/50 pt-2">
              <CollapsedFilters />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200 h-full flex flex-col space-y-5">
            <div className="space-y-5 p-5 pb-0">
              {/* Draw Mission Button */}
              <DrawMissionButton />

              {/* Search Input */}
              <SearchInputURLSynced placeholder="Search missions..." />

              {/* Filter Badges */}
              <MissionsStatusFilters />
            </div>

            {/* Mission List */}
            <MissionsList />
          </div>
        )}
      </div>
    </div>
  );
}
