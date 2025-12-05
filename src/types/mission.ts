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

// Mock data for development
export const mockMissions: Mission[] = [
  {
    id: "1",
    name: "North Field Survey",
    status: "valid",
    area: 15000,
  },
  {
    id: "2",
    name: "East Boundary Check",
    status: "partially_outside_site",
    area: 8500,
  },
  {
    id: "3",
    name: "Central Area Scan",
    status: "valid",
    area: 22000,
  },
  {
    id: "4",
    name: "Restricted Zone Test",
    status: "intersects_restricted_hole",
    area: 5000,
  },
  {
    id: "5",
    name: "Airport Vicinity",
    status: "intersects_no_fly_zone",
    area: 12000,
  },
  {
    id: "6",
    name: "Invalid Path",
    status: "invalid_geometry",
    area: 0,
  },
  {
    id: "7",
    name: "South Field Mapping",
    status: "valid",
    area: 18500,
  },
  {
    id: "8",
    name: "West Edge Analysis",
    status: "partially_outside_site",
    area: 9200,
  },
];
