import type { FeatureCollection, Feature, Polygon } from "geojson";
import type { Mission } from "@/types/mission";

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
