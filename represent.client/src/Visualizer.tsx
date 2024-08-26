import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { draw } from "./RouteDrawing";
import ActivityPhotoPicker from "./components/ActivityPhotoPicker";
import ActivityTable from "./components/ActivityTable";
import Settings, { SettingsOptions } from "./components/Settings";
import ActivityInfo from "./engine/ActivityInfo";
import { Activity, fetcher } from "./services/api";

const canvasWidth = 650;
const canvasHeight = 650;

const defaultSettings: SettingsOptions = {
  textColor: "white",
  routeColor: "red",
};

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activityId, setActivityId] = useState<number | undefined>();
  const [copied, setCopied] = useState(false);
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

  const copyImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.toBlob(async function (blob) {
        const item = new ClipboardItem({ [blob!.type]: blob! });
        await navigator.clipboard.write([item]);

        setCopied(true);
        // TODO: useRef and clearTimeout + custom component?
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
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

        {canvasRef.current && (
          <Tooltip content="Copied!" color="success" isOpen={copied} placement="right">
            <Button color="primary" onClick={copyImage} className="mt-2">
              Copy to clipboard
            </Button>
          </Tooltip>
        )}
      </div>
      <div>{hasMultiplePhotos && <ActivityPhotoPicker activityId={activity.id} onSelected={setPhotoId} />}</div>
    </div>
  );
}
