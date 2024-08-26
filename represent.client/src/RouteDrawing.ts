import StravaLogo from "./assets/strava-logo-ext.svg";
import { SettingsOptions } from "./components/Settings";
import ActivityInfo from "./engine/ActivityInfo";
import CanvasDrawer from "./engine/CanvasDrawer";
import { scaleIntoRect } from "./engine/Geometry";
import { polylineToCanvasPoints } from "./engine/Route";
import { formatDate, formatDistance, formatDuration } from "./utils/formatting";

const colorMap = {
  white: "#ffffff",
  black: "#000000",
  red: "#e71834",
  blue: "#106cef",
  green: "#41da68",
};

export function drawCoordinates(drawer: CanvasDrawer, polyline: string, color: string) {
  const scale = 0.9;

  const coordinatePoints = polylineToCanvasPoints(polyline);
  const points = scaleIntoRect(coordinatePoints, drawer.getWidth(), drawer.getHeight(), scale);

  drawer.drawPoints(points, color);
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

export async function draw(activity: ActivityInfo, canvas: HTMLCanvasElement, settings: SettingsOptions) {
  const drawer = new CanvasDrawer(canvas);
  if (activity.photoUrl) {
    const backImg = await downloadImage(activity.photoUrl);
    drawer.drawImage(backImg, getSquareFillOptions(backImg, drawer.getWidth(), drawer.getHeight()));
  } else {
    drawer.fillBackground("#202020");
  }

  drawCoordinates(drawer, activity.polylineMap, colorMap[settings.routeColor]);

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

  if (settings.textColor == "black") {
    logoOpts.sy = 135;
  }

  drawer.drawImage(logoImg, logoOpts);

  const textBaselineX = 20;
  const textBaselineY = drawer.getHeight() - 70;

  const fontSize = 40;
  const fontColor = colorMap[settings.textColor];

  drawer.drawText(activity.name, textBaselineX, textBaselineY - 50, fontSize * 0.7, fontColor);
  drawer.drawText(formatDate(activity.startDate), drawer.getWidth() - textBaselineX, 50, fontSize, fontColor, "right");

  drawer.drawText("Run", textBaselineX, textBaselineY, fontSize * 0.5, fontColor);
  const distance = formatDistance(activity.distance);
  drawer.drawText(distance, textBaselineX, textBaselineY + 40, fontSize, fontColor);

  // elevation
  drawer.drawText("Elev Gain", drawer.getWidth() / 2 - 100, textBaselineY, fontSize * 0.5, fontColor);
  drawer.drawText(`${activity.elevationGain} m`, drawer.getWidth() / 2 - 100, textBaselineY + 40, fontSize, fontColor);

  // pace
  // const pace = Duration.fromObject({ seconds: activity.movingTime / distanceKm });
  // drawer.drawText("Pace", (drawer.getWidth() - 100) / 2, textBaselineY, fontSize * 0.5, fontColor);
  // drawer.drawText(pace.toFormat("mm:ss '/km'"), (drawer.getWidth() - 100) / 2, textBaselineY + 40, fontSize, fontColor);
  const timeFormatted = formatDuration(activity.movingTime);
  drawer.drawText("Time", drawer.getWidth() - textBaselineX, textBaselineY, fontSize * 0.5, fontColor, "right");
  drawer.drawText(timeFormatted, drawer.getWidth() - textBaselineX, textBaselineY + 40, fontSize, fontColor, "right");
}
