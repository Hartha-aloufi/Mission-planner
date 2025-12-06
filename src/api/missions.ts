import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Polygon } from "geojson";
import { toast } from "sonner";
import { fetchMissions, createMission } from "./api-mock";
import type { Mission } from "@/types/mission";

export const missionKeys = {
  all: () => ["missions"] as const,
  lists: (filters?: unknown) => {
    if (filters) {
      return ["missions", "list", filters] as const;
    }
    return ["missions", "list"] as const;
  },
};

// Query hook for fetching missions
export function useMissions() {
  return useQuery({
    queryKey: missionKeys.lists(),
    queryFn: fetchMissions,
  });
}

// Mutation hook for creating a mission
export function useCreateMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (polygon: Polygon) => createMission(polygon),

    // Optimistic update
    onMutate: async (polygon: Polygon) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: missionKeys.lists() });

      // Snapshot the previous value
      const previousMissions = queryClient.getQueryData<Mission[]>(
        missionKeys.lists()
      );

      // Optimistically update to the new value
      if (previousMissions) {
        const optimisticMission: Mission = {
          id: "temp-" + Date.now(),
          name: `Mission ${previousMissions.length + 1}`,
          status: "valid",
          area: 0, // Will be calculated on server
          geometry: polygon,
        };

        queryClient.setQueryData<Mission[]>(missionKeys.lists(), [
          ...previousMissions,
          optimisticMission,
        ]);
      }

      // Return context with snapshot
      return { previousMissions };
    },

    // Refetch and show success toast
    onSuccess: (newMission) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      toast.success("Mission created successfully!", {
        description: `${newMission.name} (${newMission.area.toLocaleString()} m²)`,
      });
    },
    
    onError: (_, _polygon, context) => {
      // Rollback on error
      if (context?.previousMissions) {
        queryClient.setQueryData<Mission[]>(missionKeys.lists(), context.previousMissions);
      }
    },
  });
}
