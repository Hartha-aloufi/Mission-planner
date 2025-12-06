import type { Polygon } from "geojson";

export type MissionStatus =
  | "valid"
  | "partially_outside_site"
  | "intersects_restricted_hole"
  | "intersects_no_fly_zone"
  | "invalid_geometry";

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  area: number; // in square meters
  geometry: Polygon;
}

export interface MissionStatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}

export const missionStatusConfig: Record<MissionStatus, MissionStatusConfig> = {
  valid: {
    label: "Valid",
    variant: "default",
    color: "bg-green-500",
  },
  partially_outside_site: {
    label: "Partially Outside",
    variant: "secondary",
    color: "bg-yellow-500",
  },
  intersects_restricted_hole: {
    label: "Restricted Hole",
    variant: "secondary",
    color: "bg-orange-500",
  },
  intersects_no_fly_zone: {
    label: "No Fly Zone",
    variant: "destructive",
    color: "bg-red-500",
  },
  invalid_geometry: {
    label: "Invalid Geometry",
    variant: "destructive",
    color: "bg-red-500",
  },
};
