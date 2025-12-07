import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Polygon } from "geojson";
import { toast } from "sonner";
import { fetchMissions, createMission, renameMission } from "./api-mock";
import type { Mission } from "@/types/mission";
import { validateMission } from "@/lib/missionValidation";
import { useScenario } from "@/api/scenario";

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
  const { data: scenario } = useScenario();

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
        // If scenario is loaded, validate the mission; otherwise use "valid" as placeholder
        const missionStatus = scenario
          ? validateMission(polygon, scenario)
          : "valid";

        const optimisticMission: Mission = {
          id: "temp-" + Date.now(),
          name: `Mission ${previousMissions.length + 1}`,
          status: missionStatus, // will be validated on server, frontend calculation for better user experience
          area: 0, // Will be calculated on server
          geometry: polygon,
        };

        queryClient.setQueryData<Mission[]>(missionKeys.lists(), [
          optimisticMission,
          ...previousMissions,
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

// Mutation hook for renaming a mission
export function useRenameMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      renameMission(id, newName),

    // Optimistic update
    onMutate: async ({ id, newName }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: missionKeys.lists() });

      // Snapshot the previous value
      const previousMissions = queryClient.getQueryData<Mission[]>(
        missionKeys.lists()
      );

      // Optimistically update the mission name
      if (previousMissions) {
        const updatedMissions = previousMissions.map((mission) =>
          mission.id === id ? { ...mission, name: newName } : mission
        );
        queryClient.setQueryData<Mission[]>(missionKeys.lists(), updatedMissions);
      }

      // Return context with snapshot
      return { previousMissions };
    },

    // Show success toast
    onSuccess: (updatedMission) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      toast.success("Mission renamed successfully!", {
        description: updatedMission.name,
      });
    },

    // Rollback on error
    onError: (_, __, context) => {
      if (context?.previousMissions) {
        queryClient.setQueryData<Mission[]>(
          missionKeys.lists(),
          context.previousMissions
        );
      }
    },
  });
}
