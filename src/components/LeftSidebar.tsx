import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionsList } from "@/components/MissionsList";
import { CollapsedFilters } from "@/components/CollapsedFilters";
import { cn } from "@/lib/utils";

export function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          onClick={() => setIsCollapsed(!isCollapsed)}
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
          <div className="animate-in fade-in slide-in-from-left-2 duration-200">
            <CollapsedFilters />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200 h-full">
            <MissionsList />
          </div>
        )}
      </div>
    </div>
  );
}
