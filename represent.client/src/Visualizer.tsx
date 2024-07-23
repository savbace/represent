import { useContext, useEffect, useRef, useState } from "react";
import { demoDraw } from "./RouteDrawing";
import ActivityInfo from "./engine/ActivityInfo";
import { UserContext } from "./Context";

interface Activity {
  name: string;
  distance: number;
  movingTime: number;
  startDate: string;
  totalElevationGain: number;
  map: {
    summaryPolyline: string;
  };
  photos: {
    primary: {
      urls: {
        small: string;
      };
    };
  };
}

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const user = useContext(UserContext);
  const [activity, setActivity] = useState<Activity>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (user && !activity) {
      fetchActivities();
    }

    async function fetchActivities() {
      const response = await fetch("/api/activities");
      const data = await response.json();
      setActivity(data);
    }
  }, [activity, user]);

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
        photos: activity.photos.primary?.urls?.small ? [activity.photos.primary?.urls?.small] : [],
      };
      demoDraw(activityInfo, canvasRef.current!);
      setInitialized(true);
    }
  }, [activity, initialized]);

  return <canvas ref={canvasRef}></canvas>;
}
