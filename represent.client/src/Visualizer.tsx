import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { draw } from "./RouteDrawing";
import ActivityPhotoPicker from "./components/ActivityPhotoPicker";
import ActivityTable from "./components/ActivityTable";
import CopyImageButton from "./components/CopyImageButton";
import Settings, { SettingsOptions } from "./components/Settings";
import ActivityInfo from "./engine/ActivityInfo";
import { Activity, fetcher } from "./services/api";
import { copyToClipboard } from "./utils/canvasUtils";

const canvasWidth = 650;
const canvasHeight = 650;

const defaultSettings: SettingsOptions = {
  textColor: "white",
  routeColor: "red",
};

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activityId, setActivityId] = useState<number | undefined>();
  const [photoId, setPhotoId] = useState<string>();
  const [settings, setSettings] = useState<SettingsOptions>(defaultSettings);
  const { data: activity } = useSWR<Activity>(activityId ? `/api/activities/${activityId}` : null, fetcher);

  useEffect(() => {
    if (activity) {
      canvasRef.current!.width = canvasWidth;
      canvasRef.current!.height = canvasHeight;

      let photoUrl = undefined;
      if (activity.photoCount > 0) {
        const photoApiUrl = `/api/activities/${activity.id}/photo-proxy`;
        photoUrl = photoId ? `${photoApiUrl}?photoId=${encodeURIComponent(photoId)}` : photoApiUrl;
      }

      const activityInfo: ActivityInfo = {
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.movingTime,
        startDate: activity.startDate,
        polylineMap: activity.mapPolyline,
        elevationGain: activity.totalElevationGain,
        photoUrl: photoUrl,
      };
      draw(activityInfo, canvasRef.current!, settings);
    }
  }, [activity, photoId, settings]);

  const onActivitySelected = (id: number) => {
    setActivityId(id);
    setPhotoId(undefined);
  };

  const copyImage = async () => {
    if (canvasRef.current) {
      await copyToClipboard(canvasRef.current);
    }
  };

  const hasMultiplePhotos = activity && activity.photoCount > 1;

  return (
    <div className="flex flex-row">
      <div>
        <h4 className="mb-4 text-lg">Activity</h4>
        <ActivityTable onSelected={onActivitySelected} />
        <h4 className="my-4 text-lg">Settings</h4>
        <Settings options={settings} onChange={setSettings} />
      </div>
      <div className="mx-4">
        <div className="min-h-[650px] min-w-[650px] border-2 border-dashed border-primary text-center align-middle">
          {!canvasRef.current && <span className="text-xl text-neutral-500">Select activity to visualize.</span>}
          <canvas ref={canvasRef}></canvas>
        </div>

        {canvasRef.current && <CopyImageButton onPress={copyImage} />}
      </div>
      <div>{hasMultiplePhotos && <ActivityPhotoPicker activityId={activity.id} onSelected={setPhotoId} />}</div>
    </div>
  );
}
