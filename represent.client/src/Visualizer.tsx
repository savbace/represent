import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { demoDraw } from "./RouteDrawing";
import ActivityTable from "./components/ActivityTable";
import ActivityInfo from "./engine/ActivityInfo";
import { Activity, fetcher } from "./services/api";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activityId, setActivityId] = useState<number | undefined>();
  const { data: activity } = useSWR<Activity>(activityId ? `/api/activities/${activityId}` : null, fetcher);

  useEffect(() => {
    if (activity) {
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
    }
  }, [activity]);

  return (
    <div>
      <div className="mb-4">
        <ActivityTable onSelected={setActivityId} />
      </div>
      <div className="mb-4">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
