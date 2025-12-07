import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection } from "geojson";
import scenarioGeoJSON from "@/api/jordan_scenario.json";

export const scenarioKeys = {
  all: () => ["scenario"] as const,
};

interface ScenarioData {
  site: FeatureCollection;
  restrictedAreas: FeatureCollection;
}

async function fetchScenario(): Promise<ScenarioData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = scenarioGeoJSON as FeatureCollection;

  // Filter features by type, keep as GeoJSON
  const siteFeatures = data.features.filter(
    (f) => f.properties?.type === "site"
  );
  const restrictedFeatures = data.features.filter(
    (f) => f.properties?.type === "restricted_area"
  );

  return {
    site: {
      type: "FeatureCollection",
      features: siteFeatures,
    },
    restrictedAreas: {
      type: "FeatureCollection",
      features: restrictedFeatures,
    },
  };
}

export function useScenario() {
  return useQuery({
    queryKey: scenarioKeys.all(),
    queryFn: fetchScenario,
    staleTime: Infinity,
  });
}
