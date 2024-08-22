import { Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useCallback } from "react";
import useSWR from "swr";
import { Activity, fetcher } from "../services/api";
import { formatDate, formatDistance, formatDuration } from "../utils/formatting";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "startDate",
    label: "DATE",
  },
  {
    key: "distance",
    label: "DISTANCE",
  },
  {
    key: "movingTime",
    label: "DURATION",
  },
  {
    key: "photos",
    label: "PHOTOS",
  },
];

interface ActivityTableProps {
  onSelected(id: number): void;
}

export default function ActivityTable({ onSelected }: ActivityTableProps) {
  const { data, isLoading } = useSWR<Activity[]>("/api/activities/summary", fetcher);

  const renderCell = useCallback((activity: Activity, columnKey: React.Key) => {
    const cellValue = activity[columnKey as keyof Activity];

    switch (columnKey) {
      case "startDate": {
        return formatDate(activity.startDate);
      }
      case "distance": {
        return formatDistance(activity.distance);
      }
      case "movingTime": {
        return formatDuration(activity.movingTime);
      }
      case "photos": {
        const multiple = activity.photoCount > 1;
        return activity.photoCount
          ? renderLabel("YES", multiple ? "secondary" : "success")
          : renderLabel("NO", "warning");
      }
      default:
        return cellValue as string;
    }
  }, []);

  return (
    <Table
      aria-label="Activities table"
      selectionMode="single"
      color="primary"
      allowDuplicateSelectionEvents={false}
      onSelectionChange={(keys) => {
        const id = Array.from(keys)[0];

        if (id) {
          onSelected(Number(id));
        }
      }}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={data || []} isLoading={isLoading} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function renderLabel(value: string, color: "success" | "warning" | "secondary") {
  return (
    <Chip color={color} variant="dot" size="sm">
      {value}
    </Chip>
  );
}
