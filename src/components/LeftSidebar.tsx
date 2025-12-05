import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionsList } from "@/components/MissionsList";
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
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        {!isCollapsed && (
          <div>
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

      {!isCollapsed && <MissionsList />}
    </div>
  );
}
