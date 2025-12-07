# Drone Mission Area Validator

A React-based application for validating drone mission areas against site boundaries, restricted zones, and no-fly areas using real-time geometric validation.


<img width="1914" height="919" alt="image" src="https://github.com/user-attachments/assets/e377ee95-7723-4821-b0ed-e53473ab24da" />

## 🚀 Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Mapbox GL JS** + **react-map-gl** - Interactive mapping
- **@mapbox/mapbox-gl-draw** - Polygon drawing tools
- **Turf.js** - Geospatial analysis and validation
- **React Query** - Server state management: Missions and Scenario
- **Zustand** - Client state management
- **Tailwind CSS** + **shadcn/ui** - Styling
- **React Router** - Routing with URL search params sync

## ✨ Features

### Core Functionality
- ✅ Interactive polygon drawing on Mapbox
- ✅ Real-time mission validation with priority-based status
- ✅ Mission management (create, rename, delete, search, filter)
- ✅ Visual feedback with color-coded zones and missions
- ✅ Click to highlight missions on map

### Validation System
Missions are validated against multiple constraints with priority handling:
1. **Invalid Geometry** - Self-intersecting polygons or zero/very small area
2. **Intersects Restricted Hole** - Overlaps with restricted areas inside site
3. **Intersects No-Fly Zone** - Overlaps with external no-fly zones
4. **Partially Outside Site** - Not fully contained within site boundary
5. **Valid** - Passes all checks

### UX Enhancements
- 🎯 Auto-focus and auto-scroll to newly created missions
- ⚡ Optimistic updates for instant UI feedback
- 🔗 Search filters synced with URL params for shareable states
- 📍 Mission highlighting with visual emphasis
- 🏷️ Polygon labels showing mission names

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd drone-mission-validator

# Install dependencies
bun install

# Add your Mapbox access token
# Create .env file:
echo "VITE_MAPBOX_TOKEN=your_mapbox_token_here" > .env

# Run development server
bun run dev
```

## 🏗️ Architecture Decisions

### State Management Strategy

**React Query** manages server state (missions, scenario data):
- Handles caching, invalidation, and optimistic updates
- Mock API layer simulates backend operations

**Zustand** manages client state (UI interactions):
- Drawing mode state


## 🎯 Key Assumptions

**Production-Ready Approach:**
- Built with real-world dependencies (routing, caching, etc.)
- State management architecture assumes future API integration
- Mock API layer mirrors backend behavior patterns

**Static Scenario Data:**
- Scenario zones (site, restricted areas) are static
- Missions validated once at creation (not re-validated on every render)
- Efficient for the given use case


## 🛠️ Development Notes

### React Compiler
This project uses the React Compiler, eliminating the need for manual `useMemo`/`useCallback` in most cases. The compiler automatically optimizes component re-renders.

### URL Sync
Search and filter states are synchronized with URL search params, enabling:
- Shareable filtered views
- Browser back/forward navigation
- Bookmark-able states

## Known issues
- partially_outside_site validation is not working.
