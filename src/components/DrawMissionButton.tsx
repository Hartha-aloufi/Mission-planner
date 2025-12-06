import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useIsDrawingMode,
  useStartDrawing,
  useStopDrawing,
} from "@/stores/useMapStore";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DrawMissionButtonProps {
  collapsed?: boolean;
}

export function DrawMissionButton({ collapsed = false }: DrawMissionButtonProps) {
  const isDrawing = useIsDrawingMode();
  const startDrawing = useStartDrawing();
  const stopDrawing = useStopDrawing();

  const handleClick = () => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              "text-xs font-bold cursor-pointer transition-all duration-200",
              "hover:scale-105 active:scale-95",
              isDrawing && "bg-primary text-primary-foreground shadow-md",
              !isDrawing && [
                "bg-background border border-border/50",
                "text-muted-foreground hover:border-border",
              ]
            )}
          >
            <Pencil className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isDrawing ? "Stop Drawing" : "Draw Mission"}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={isDrawing ? "default" : "outline"}
      className="w-full"
    >
      <Pencil className="size-4 mr-2" />
      {isDrawing ? "Stop Drawing" : "Draw Mission"}
    </Button>
  );
}
