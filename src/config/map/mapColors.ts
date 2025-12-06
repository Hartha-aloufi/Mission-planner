import colors from "tailwindcss/colors";
import { formatHex, parse } from "culori";

// Helper to convert Tailwind colors to hex format for Mapbox
const toMapColor = (color: string): string => {
  const parsed = parse(color);
  return parsed ? formatHex(parsed) : color;
};

// Status to color mapping using Tailwind colors converted to hex
export const statusColorMap: Record<string, string> = {
  valid: toMapColor(colors.green[500]),
  partially_outside_site: toMapColor(colors.yellow[500]),
  intersects_restricted_hole: toMapColor(colors.orange[500]),
  intersects_no_fly_zone: toMapColor(colors.red[500]),
  invalid_geometry: toMapColor(colors.red[500]),
};
