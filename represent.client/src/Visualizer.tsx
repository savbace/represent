import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { demoDraw } from "./RouteDrawing";
import ActivityInfo from "./engine/ActivityInfo";
import { Activity, fetcher } from "./services/api";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: activity } = useSWR<Activity>("/api/activities", fetcher);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (activity && !initialized) {
      canvasRef.current!.width = 700;
      canvasRef.current!.height = 700;

      const activityInfo: ActivityInfo = {
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.movingTime,
        startDate: activity.startDate,
        polylineMap: activity.map.summaryPolyline,
        elevationGain: activity.totalElevationGain,
        photos: activity.photos.primary?.urls?.medium ? [activity.photos.primary?.urls?.medium] : [],
      };
      demoDraw(activityInfo, canvasRef.current!);
      setInitialized(true);
    }
  }, [activity, initialized]);

  return <canvas ref={canvasRef}></canvas>;
}
