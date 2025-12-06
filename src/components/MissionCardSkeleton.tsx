import { Skeleton } from "@/components/ui/skeleton";

export function MissionCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-card border-2 border-border/50">
      <div className="flex flex-col gap-3">
        {/* Mission Name Skeleton */}
        <Skeleton className="h-5 w-3/4" />

        {/* Status and Area Skeleton */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
