import { decode as decodePolyline } from "@mapbox/polyline";
import { Point } from "./Geometry";

export function polylineToCanvasPoints(polyline: string) {
  const coordinates = decodePolyline(polyline);

  // Y-axis is inverted because canvas' Y goes down
  return coordinates.map((c) => new Point(c[1], -c[0]));
}
