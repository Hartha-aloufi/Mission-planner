import type { Polygon } from "geojson";
import type { MissionStatus } from "@/types/mission";
import { area } from "@turf/area";
import kinks from "@turf/kinks";

// Constants
const MIN_MISSION_AREA = 10; // minimum area in square meters

// Individual validation functions
function hasValidArea(polygon: Polygon): boolean {
  const polygonArea = area({
    type: "Feature",
    geometry: polygon,
    properties: {},
  });
  return polygonArea >= MIN_MISSION_AREA;
}

function hasSelfIntersection(polygon: Polygon): boolean {
  const kinkPoints = kinks({
    type: "Feature",
    geometry: polygon,
    properties: {},
  });
  return kinkPoints.features.length > 0;
}

// Main validation function
export function validateMission(polygon: Polygon): MissionStatus {
  // Check for self-intersection
  if (hasSelfIntersection(polygon)) {
    return "invalid_geometry";
  }

  // Check for valid area
  if (!hasValidArea(polygon)) {
    return "invalid_geometry";
  }

  // All validations passed
  return "valid";
}
