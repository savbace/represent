import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { demoDraw } from "./RouteDrawing";
import ActivityTable from "./components/ActivityTable";
import ActivityInfo from "./engine/ActivityInfo";
import { Activity, fetcher } from "./services/api";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activityId, setActivityId] = useState<number | undefined>();
  const [copied, setCopied] = useState(false);
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
        polylineMap: activity.mapPolyline,
        elevationGain: activity.totalElevationGain,
        photoUrl: activity.photoCount > 0 ? `/api/activities/${activity.id}/photo` : undefined,
      };
      demoDraw(activityInfo, canvasRef.current!);
    }
  }, [activity]);

  const copyImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.toBlob(async function (blob) {
        const item = new ClipboardItem({ [blob!.type]: blob! });
        await navigator.clipboard.write([item]);

        setCopied(true);
        // TODO: useRef and clearTimeout + custom coponent?
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <ActivityTable onSelected={setActivityId} />
      </div>
      <div className="mb-4">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div>
        {canvasRef.current && (
          <Tooltip content="Copied!" color="success" isOpen={copied} placement="right">
            <Button color="primary" onClick={copyImage}>
              Copy to clipboard
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
