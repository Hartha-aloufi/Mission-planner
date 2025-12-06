import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import Map, { useControl } from "react-map-gl/mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Polygon } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { LeftSidebar } from "@/components/LeftSidebar";
import { useIsDrawingMode, useStopDrawing } from "@/stores/useMapStore";
import { useCreateMission } from "@/api/missions";

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
        >
          <DrawControl />
        </Map>
      </div>
    </div>
  );
}
