import type { Mission } from "@/types/mission";
import type { Polygon, FeatureCollection } from "geojson";
import { area } from "@turf/area";
import { validateMission } from "@/lib/missionValidation";
import scenarioGeoJSON from "@/api/jordan_scenario.json";

// localStorage keys
const STORAGE_KEYS = {
  MISSIONS: "hartha-missions",
} as const;

// Initial mock data with polygon geometries
const INITIAL_MOCK_MISSIONS: Mission[] = [

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

// Helper to get scenario data synchronously
function getScenarioData() {
  const data = scenarioGeoJSON as FeatureCollection;

  return {
    site: {
      type: "FeatureCollection" as const,
      features: data.features.filter((f) => f.properties?.type === "site"),
    },
    restrictedAreas: {
      type: "FeatureCollection" as const,
      features: data.features.filter(
        (f) => f.properties?.type === "restricted_area"
      ),
    },
  };
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
  const scenario = getScenarioData();

  // Validate mission geometry with scenario
  const missionStatus = validateMission(polygon, scenario);

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
    status: missionStatus,
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
