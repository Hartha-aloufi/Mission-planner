import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection, Polygon } from "geojson";
import scenarioGeoJSON from "@/api/jordan_scenario.json";
import type { ScenarioData, ScenarioArea } from "@/types/scenario";

// Query keys for caching
export const scenarioKeys = {
  all: () => ["scenario"] as const,
};

// Parse scenario data from GeoJSON
function parseScenarioData(geojson: FeatureCollection): ScenarioData {
  let site: ScenarioArea | null = null;
  const restricted_areas: ScenarioArea[] = [];

  for (const feature of geojson.features) {
    const { id, label, type } = feature.properties || {};
    const geometry = feature.geometry as Polygon;

    if (!id || !label || !type || !geometry.coordinates) {
      continue; // Skip invalid features
    }

    const area: ScenarioArea = {
      id,
      label,
      coordinates: geometry.coordinates,
    };

    if (type === "site") {
      site = area;
    } else if (type === "restricted_area") {
      restricted_areas.push(area);
    }
  }

  // Ensure we have a site (throw error if not found)
  if (!site) {
    throw new Error("Site area not found in scenario data");
  }

  return {
    site,
    restricted_areas,
  };
}

// Fetch scenario data (static for now, could be dynamic in the future)
async function fetchScenario(): Promise<ScenarioData> {
  // Simulate network delay for consistency with other API calls
  await new Promise((resolve) => setTimeout(resolve, 300));

  return parseScenarioData(scenarioGeoJSON as FeatureCollection);
}

// React Query hook to fetch scenario data
export function useScenario() {
  return useQuery({
    queryKey: scenarioKeys.all(),
    queryFn: fetchScenario,
    staleTime: Infinity, // Static data, never stale
  });
}
