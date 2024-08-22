import { Card, CardBody, Image, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";
import { ActivityPhoto, fetcher } from "../services/api";

interface ActivityPhotoPickerProps {
  activityId: number;
  onSelected(id: string): void;
}

export default function ActivityPhotoPicker({ activityId, onSelected }: ActivityPhotoPickerProps) {
  // todo: useSWRImmutable for some APIs?
  const { data: photos, isLoading } = useSWR<ActivityPhoto[]>(`/api/activities/${activityId}/photos`, fetcher);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div>
      <Skeleton isLoaded={!isLoading} className="rounded-lg">
        <div className="min-h-[100px] min-w-[100px]">
          {photos?.map((p, index) => (
            <Card
              shadow="md"
              key={index}
              isPressable
              onPress={() => {
                setSelectedIndex(index);
                onSelected(p.id);
              }}
              fullWidth
              className={selectedIndex == index ? `mb-1 border-2 border-solid border-warning` : "mb-1"}
              radius="sm"
            >
              <CardBody className="p-0">
                <Image
                  shadow="sm"
                  radius="none"
                  width={100}
                  height={100}
                  alt="Activity photo"
                  className="h-[140px] w-full object-cover"
                  src={p.url}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}
