import { DateTime, Duration } from "luxon";
import StravaLogo from "./assets/strava-logo.svg";
import ActivityInfo from "./engine/ActivityInfo";
import CanvasDrawer from "./engine/CanvasDrawer";
import { scaleIntoRect } from "./engine/Geometry";
import { polylineToCanvasPoints } from "./engine/Route";

export function drawCoordinates(drawer: CanvasDrawer, polyline: string) {
  const scale = 0.9;

  const coordinatePoints = polylineToCanvasPoints(polyline);
  const points = scaleIntoRect(coordinatePoints, drawer.getWidth(), drawer.getHeight(), scale);

  drawer.drawPoints(points, "red");
}

function downloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", (e) => resolve(e.target as HTMLImageElement), false);
    img.src = url;
  });
}

function getSquareFillOptions(img: HTMLImageElement, width: number, height: number) {
  const shortSideLength = Math.min(img.naturalWidth, img.naturalHeight);

  return {
    sx: (img.naturalWidth - shortSideLength) / 2,
    sy: (img.naturalHeight - shortSideLength) / 2,
    sw: shortSideLength,
    sh: shortSideLength,
    dx: 0,
    dy: 0,
    dw: width,
    dh: height,
  };
}

export async function demoDraw(activity: ActivityInfo, canvas: HTMLCanvasElement) {
  const drawer = new CanvasDrawer(canvas);
  if (activity.photos?.length) {
    const backImg = await downloadImage(activity.photos[0]);
    drawer.drawImage(backImg, getSquareFillOptions(backImg, drawer.getWidth(), drawer.getHeight()));
  }

  drawCoordinates(drawer, activity.polylineMap);

  const logoImg = await downloadImage(StravaLogo);
  const logoOpts = {
    sx: 0,
    sy: 45,
    sw: 200,
    sh: 40,
    dx: 20,
    dy: 20,
    dw: 150,
    dh: 30,
  };
  drawer.drawImage(logoImg, logoOpts);

  const textBaselineX = 20;
  const textBaselineY = 630;

  const fontSize = 40;
  const fontColor = "white";

  drawer.drawText(activity.name, textBaselineX, textBaselineY - 50, fontSize * 0.7, fontColor);
  drawer.drawText(
    DateTime.fromISO(activity.startDate).toLocaleString(DateTime.DATE_MED),
    drawer.getWidth() - textBaselineX,
    50,
    fontSize,
    fontColor,
    "right"
  );

  drawer.drawText("Run", textBaselineX, textBaselineY, fontSize * 0.5, fontColor);
  const distanceKm = activity.distance / 1000;
  const distance = `${distanceKm.toFixed(2)} km`;
  drawer.drawText(distance, textBaselineX, textBaselineY + 40, fontSize, fontColor);

  // elevation
  drawer.drawText("Elev Gain", drawer.getWidth() / 2, textBaselineY, fontSize * 0.5, fontColor);
  drawer.drawText(`${activity.elevationGain} m`, drawer.getWidth() / 2, textBaselineY + 40, fontSize, fontColor);

  // pace
  // const pace = Duration.fromObject({ seconds: activity.movingTime / distanceKm });
  // drawer.drawText("Pace", (drawer.getWidth() - 100) / 2, textBaselineY, fontSize * 0.5, fontColor);
  // drawer.drawText(pace.toFormat("mm:ss '/km'"), (drawer.getWidth() - 100) / 2, textBaselineY + 40, fontSize, fontColor);

  drawer.drawText("Time", drawer.getWidth() - textBaselineX, textBaselineY, fontSize * 0.5, fontColor, "right");
  drawer.drawText(
    Duration.fromObject({ seconds: activity.movingTime }).toFormat("mm'm' ss's'"),
    drawer.getWidth() - textBaselineX,
    textBaselineY + 40,
    fontSize,
    fontColor,
    "right"
  );
}
