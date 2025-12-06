import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil } from "lucide-react";
import { missionStatusConfig } from "@/types/mission";
import { type Mission } from "@/types/mission";
import { cn } from "@/lib/utils";
import { useRenameMission } from "@/api/missions";
import { toast } from "sonner";
import {
  useEditingMissionId,
  useStartEditingMission,
  useStopEditingMission,
} from "@/stores/useUIStore";

const MAX_MISSION_NAME_LENGTH = 100;
const missionNameSchema = z.string().trim().min(1, "Name cannot be empty").max(MAX_MISSION_NAME_LENGTH, "Name is too long");

interface MissionCardProps {
  mission: Mission;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MissionCard({
  mission,
  isSelected = false,
  onClick,
}: MissionCardProps) {
  const statusConfig = missionStatusConfig[mission.status];
  const editingMissionId = useEditingMissionId();
  const startEditingMission = useStartEditingMission();
  const stopEditingMission = useStopEditingMission();
  const isEditing = editingMissionId === mission.id;
  const [editedName, setEditedName] = useState(mission.name);
  const renameMission = useRenameMission();
  const editContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close editing
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        editContainerRef.current &&
        !editContainerRef.current.contains(event.target as Node)
      ) {
        setEditedName(mission.name);
        stopEditingMission();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, mission.name, stopEditingMission]);

  const handleRename = () => {
    const result = missionNameSchema.safeParse(editedName);

    if (!result.success) {
      toast.error("Invalid mission name", {
        description: result.error.message
      });
      return;
    }

    if (result.data !== mission.name) {
      renameMission.mutate(
        { id: mission.id, newName: result.data },
        {
          onSuccess: () => {
            stopEditingMission();
          },
        }
      );
    } else {
      stopEditingMission();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setEditedName(mission.name);
      stopEditingMission();
    }
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={cn(
        "p-4 rounded-xl transition-all duration-200",
        "bg-card border-2",
        !isEditing && "cursor-pointer hover:bg-accent/20",
        "group",
        isSelected
          ? "border-primary bg-accent/10"
          : "border-border/50 hover:border-border"
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Mission Name / Edit Mode */}
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <div
              ref={editContainerRef}
              className="flex items-center gap-2 flex-1"
            >
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_MISSION_NAME_LENGTH}
                className="flex-1 h-8"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename();
                }}
                className="h-8"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <h3
                className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors flex-1 truncate max-w-[200px]"
                title={mission.name}
              >
                {mission.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingMission(mission.id);
                      setEditedName(mission.name);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Status and Area */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant={statusConfig.variant}
            className={cn(
              "text-xs font-medium px-2.5 py-0.5",
              statusConfig.color,
              "text-white"
            )}
          >
            {statusConfig.label}
          </Badge>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {mission.area.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground/70">m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
