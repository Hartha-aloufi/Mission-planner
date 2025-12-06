import type { FillLayer, LineLayer } from "react-map-gl/mapbox";
import { statusColorMap, scenarioColorMap } from "./mapColors";

export const createFillLayer = (
  selectedMissionId: string | null
): FillLayer => ({
  id: "missions-fill",
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", "status"],
      "valid",
      statusColorMap.valid,
      "partially_outside_site",
      statusColorMap.partially_outside_site,
      "intersects_restricted_hole",
      statusColorMap.intersects_restricted_hole,
      "intersects_no_fly_zone",
      statusColorMap.intersects_no_fly_zone,
      "invalid_geometry",
      statusColorMap.invalid_geometry,
      statusColorMap.valid, // default
    ],
    "fill-opacity": [
      "case",
      ["==", ["get", "id"], selectedMissionId || ""],
      0.5,
      0.3,
    ],
  },
});

export const createOutlineLayer = (
  selectedMissionId: string | null
): LineLayer => ({
  id: "missions-outline",
  type: "line",
  paint: {
    "line-color": [
      "match",
      ["get", "status"],
      "valid",
      statusColorMap.valid,
      "partially_outside_site",
      statusColorMap.partially_outside_site,
      "intersects_restricted_hole",
      statusColorMap.intersects_restricted_hole,
      "intersects_no_fly_zone",
      statusColorMap.intersects_no_fly_zone,
      "invalid_geometry",
      statusColorMap.invalid_geometry,
      statusColorMap.valid, // default
    ],
    "line-width": [
      "case",
      ["==", ["get", "id"], selectedMissionId || ""],
      3,
      2,
    ],
  },
});

export const createSiteFillLayer = (): FillLayer => ({
  id: "site-fill",
  type: "fill",
  paint: {
    "fill-color": scenarioColorMap.site,
    "fill-opacity": 0.15, // Very transparent to not overwhelm missions
  },
});

export const createSiteOutlineLayer = (): LineLayer => ({
  id: "site-outline",
  type: "line",
  paint: {
    "line-color": scenarioColorMap.site,
    "line-width": 2,
    "line-dasharray": [4, 2], // Dashed line for site boundary
  },
});

export const createRestrictedFillLayer = (): FillLayer => ({
  id: "restricted-fill",
  type: "fill",
  paint: {
    "fill-color": scenarioColorMap.restrictedArea,
    "fill-opacity": 0.25, // More visible than site
  },
});

export const createRestrictedOutlineLayer = (): LineLayer => ({
  id: "restricted-outline",
  type: "line",
  paint: {
    "line-color": scenarioColorMap.restrictedArea,
    "line-width": 2,
  },
});
