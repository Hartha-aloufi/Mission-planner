import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { LeftSidebar } from "@/components/LeftSidebar";

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
});

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
        />
      </div>
    </div>
  );
}
