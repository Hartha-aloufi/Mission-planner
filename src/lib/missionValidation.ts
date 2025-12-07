import type { Polygon, FeatureCollection } from "geojson";
import type { MissionStatus } from "@/types/mission";
import { area } from "@turf/area";
import kinks from "@turf/kinks";
import booleanIntersects from "@turf/boolean-intersects";
import booleanContains from "@turf/boolean-contains";
import intersect from "@turf/intersect";

// ScenarioData type (site + restrictedAreas)
interface ScenarioData {
  site: FeatureCollection;
  restrictedAreas: FeatureCollection;
}

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

// Calculate what percentage of the mission is inside the site
// Returns a number between 0 (completely outside) and 1 (completely inside)
function calculateSiteOverlapPercentage(
  missionPolygon: Polygon,
  siteCollection: FeatureCollection
): number {
  try {
    const siteFeature = siteCollection.features[0]; // Only one site polygon for now
    const missionFeature = {  
      type: "Feature" as const,
      geometry: missionPolygon,
      properties: {},
    };

    // Check if fully inside first (optimization)
    try {
      if (booleanContains(siteFeature.geometry, missionFeature)) {
        return 1;
      }
    } catch {
      // If booleanContains fails, continue to intersection calculation
    }

    // Calculate intersection area
    const intersection = intersect(siteFeature, missionFeature);

    if (!intersection) {
      return 0; // No overlap at all
    }

    const missionArea = area(missionFeature);
    const intersectionArea = area(intersection);

    // Ensure we don't return values > 1 due to floating point errors
    return Math.min(intersectionArea / missionArea, 1);
  } catch (error) {
    // If any error occurs during calculation, assume no overlap
    console.error("Error calculating site overlap:", error);
    return 0;
  }
}

function intersectsRestrictedAreas(
  missionPolygon: Polygon,
  restrictedCollection: FeatureCollection
): boolean {
  const missionFeature = {
    type: "Feature" as const,
    geometry: missionPolygon,
    properties: {},
  };

  for (const restrictedFeature of restrictedCollection.features) {
    if (booleanIntersects(restrictedFeature, missionFeature)) {
      return true;
    }
  }

  return false;
}

// Main validation function
export function validateMission(
  polygon: Polygon,
  scenario: ScenarioData
): MissionStatus {
  // Priority 1: Check for invalid geometry (existing checks)
  if (hasSelfIntersection(polygon)) {
    return "invalid_geometry";
  }

  if (!hasValidArea(polygon)) {
    return "invalid_geometry";
  }

  // Priority 2: Check if intersects restricted areas
  if (intersectsRestrictedAreas(polygon, scenario.restrictedAreas)) {
    return "intersects_restricted_hole";
  }

  // Priority 3: Check site overlap
  const overlapPercentage = calculateSiteOverlapPercentage(
    polygon,
    scenario.site
  );

  // If completely inside site, continue to valid
  if (overlapPercentage === 1) {
    return "valid";
  }

  // If at least 50% is inside (meaning less than 50% is outside)
  if (overlapPercentage >= 0.5) {
    return "partially_outside_site";
  }

  // If less than 50% is inside (meaning 50% or more is outside)
  // This includes cases where mission is completely outside (0% inside)
  return "intersects_no_fly_zone";
}
