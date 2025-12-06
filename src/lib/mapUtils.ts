import type { FeatureCollection, Feature, Polygon } from "geojson";
import type { Mission } from "@/types/mission";
import type { ScenarioArea } from "@/types/scenario";

export function missionsToGeoJSON(missions: Mission[]): FeatureCollection {
  const features: Feature<Polygon>[] = missions.map((mission) => ({
    type: "Feature",
    geometry: mission.geometry,
    properties: {
      id: mission.id,
      status: mission.status,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export function siteToGeoJSON(site: ScenarioArea): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: site.coordinates,
        },
        properties: {
          id: site.id,
          label: site.label,
        },
      },
    ],
  };
}

export function restrictedAreasToGeoJSON(
  areas: ScenarioArea[]
): FeatureCollection {
  const features = areas.map((area) => ({
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: area.coordinates,
    },
    properties: {
      id: area.id,
      label: area.label,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}
