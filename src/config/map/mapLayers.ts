import type { FillLayer, LineLayer } from "react-map-gl/mapbox";
import { statusColorMap } from "./mapColors";

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
