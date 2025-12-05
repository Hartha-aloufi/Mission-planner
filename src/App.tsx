import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { LeftSidebar } from "@/components/LeftSidebar";

function App() {
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

export default App;
