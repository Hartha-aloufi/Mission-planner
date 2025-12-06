export interface ScenarioArea {
  id: string;
  label: string;
  coordinates: number[][][]; // Polygon coordinates from GeoJSON
}

export interface ScenarioData {
  site: ScenarioArea;
  restricted_areas: ScenarioArea[];
}
