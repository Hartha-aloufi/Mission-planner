import type { Mission } from "@/types/mission";
import type { Polygon } from "geojson";
import { area } from "@turf/area";

// localStorage keys
const STORAGE_KEYS = {
  MISSIONS: "hartha-missions",
} as const;

// Initial mock data with polygon geometries
const INITIAL_MOCK_MISSIONS: Mission[] = [
  {
    id: "1",
    name: "North Field Survey",
    status: "valid",
    area: 15000,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.92, 31.98],
          [35.98, 31.98],
          [35.98, 31.96],
          [35.92, 31.96],
          [35.92, 31.98],
        ],
      ],
    },
  },
  {
    id: "2",
    name: "East Boundary Check",
    status: "partially_outside_site",
    area: 8500,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.99, 31.97],
          [36.02, 31.97],
          [36.02, 31.95],
          [35.99, 31.95],
          [35.99, 31.97],
        ],
      ],
    },
  },
  {
    id: "3",
    name: "Central Area Scan",
    status: "valid",
    area: 22000,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.93, 31.96],
          [35.97, 31.96],
          [35.97, 31.94],
          [35.93, 31.94],
          [35.93, 31.96],
        ],
      ],
    },
  },
  {
    id: "4",
    name: "Restricted Zone Test",
    status: "intersects_restricted_hole",
    area: 5000,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.90, 31.95],
          [35.92, 31.95],
          [35.92, 31.93],
          [35.90, 31.93],
          [35.90, 31.95],
        ],
      ],
    },
  },
  {
    id: "5",
    name: "Airport Vicinity",
    status: "intersects_no_fly_zone",
    area: 12000,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.94, 31.93],
          [35.97, 31.93],
          [35.97, 31.91],
          [35.94, 31.91],
          [35.94, 31.93],
        ],
      ],
    },
  },
  {
    id: "6",
    name: "Invalid Path",
    status: "invalid_geometry",
    area: 0,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.88, 31.92],
          [35.89, 31.92],
          [35.89, 31.91],
          [35.88, 31.91],
          [35.88, 31.92],
        ],
      ],
    },
  },
  {
    id: "7",
    name: "South Field Mapping",
    status: "valid",
    area: 18500,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.92, 31.91],
          [35.96, 31.91],
          [35.96, 31.89],
          [35.92, 31.89],
          [35.92, 31.91],
        ],
      ],
    },
  },
  {
    id: "8",
    name: "West Edge Analysis",
    status: "partially_outside_site",
    area: 9200,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.88, 31.97],
          [35.91, 31.97],
          [35.91, 31.95],
          [35.88, 31.95],
          [35.88, 31.97],
        ],
      ],
    },
  },
];

// Helper functions
function getMissionsFromStorage(): Mission[] {
  const stored = localStorage.getItem(STORAGE_KEYS.MISSIONS);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveMissionsToStorage(missions: Mission[]): void {
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
}

export function initializeMissions(): void {
  const existing = getMissionsFromStorage();
  if (existing.length === 0) {
    saveMissionsToStorage(INITIAL_MOCK_MISSIONS);
  }
}

// Mock API functions
export async function fetchMissions(): Promise<Mission[]> {
  // Initialize if needed
  initializeMissions();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return getMissionsFromStorage().slice().reverse();
}

export async function createMission(polygon: Polygon): Promise<Mission> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const missions = getMissionsFromStorage();

  // Calculate area using turf.js
  const polygonArea = area({
    type: "Feature",
    geometry: polygon,
    properties: {},
  });

  // Generate new mission
  const newMission: Mission = {
    id: crypto.randomUUID(),
    name: `Mission ${missions.length + 1}`,
    status: "valid",
    area: Math.round(polygonArea),
    geometry: polygon,
  };

  // Save to localStorage
  const updatedMissions = [...missions, newMission];
  saveMissionsToStorage(updatedMissions);

  return newMission;
}

export async function renameMission(
  id: string,
  newName: string
): Promise<Mission> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const missions = getMissionsFromStorage();

  // Find mission and update name
  const missionIndex = missions.findIndex((m) => m.id === id);
  if (missionIndex === -1) {
    throw new Error("Mission not found");
  }

  const updatedMission = {
    ...missions[missionIndex],
    name: newName.trim(),
  };

  missions[missionIndex] = updatedMission;
  saveMissionsToStorage(missions);

  return updatedMission;
}
