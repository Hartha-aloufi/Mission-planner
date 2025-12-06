import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import Map, { useControl, Source, Layer } from "react-map-gl/mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Polygon } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { LeftSidebar } from "@/components/LeftSidebar";
import { useIsDrawingMode, useStopDrawing } from "@/stores/useMapStore";
import { useCreateMission, useMissions } from "@/api/missions";
import { missionsToGeoJSON } from "@/lib/mapUtils";
import { createFillLayer, createOutlineLayer } from "@/config/map/mapLayers";

// Zod schema for mission status
const missionStatusSchema = z.enum([
  "valid",
  "partially_outside_site",
  "intersects_restricted_hole",
  "intersects_no_fly_zone",
  "invalid_geometry",
]);

// Search params schema
const searchSchema = z.object({
  filters: z.array(missionStatusSchema).optional().default([]),
  selectedMission: z.string().optional(),
  q: z.string().optional().default(""),
});

// Draw control component
function DrawControl() {
  const isDrawingMode = useIsDrawingMode();
  const stopDrawing = useStopDrawing();
  const createMission = useCreateMission();

  const draw = useControl(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
      }),
    ({ map }) => {
      map.on("draw.create", (e) => {
        const polygon = e.features[0].geometry as Polygon;
        createMission.mutate(polygon);
        stopDrawing();
      });
    }
  );

  useEffect(() => {
    if (isDrawingMode) {
      draw.changeMode("draw_polygon");
    } else {
      draw.changeMode("simple_select");
      // Clear any active drawing
      draw.deleteAll();
    }
  }, [isDrawingMode, draw]);

  return null;
}

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  component: HomePage,
});

function HomePage() {
  const { data: missions } = useMissions();
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const missionsGeoJSON = missions ? missionsToGeoJSON(missions) : null;
  const selectedMissionId = search.selectedMission || null;

  const fillLayer = createFillLayer(selectedMissionId);
  const outlineLayer = createOutlineLayer(selectedMissionId);

  const handleMapClick = (event: any) => {
    const features = event.features;
    if (features && features.length > 0) {
      const clickedMission = features[0];
      const missionId = clickedMission.properties?.id;
      if (missionId) {
        navigate({
          search: (prev) => ({
            ...prev,
            selectedMission: missionId,
          }),
        });
      }
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <LeftSidebar />
      <div className="flex-1">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{
            longitude: 35.95,
            latitude: 31.95,
            zoom: 8.4,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={handleMapClick}
          interactiveLayerIds={["missions-fill"]}
        >
          {missionsGeoJSON && (
            <Source id="missions" type="geojson" data={missionsGeoJSON}>
              <Layer {...fillLayer} />
              <Layer {...outlineLayer} />
            </Source>
          )}
          <DrawControl />
        </Map>
      </div>
    </div>
  );
}
