import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { DateTime, Duration } from "luxon";
import useSWR from "swr";
import { Activity, fetcher } from "../services/api";
import { useCallback } from "react";

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
    key: "movingTime",
    label: "DURATION",
  },
];

interface ActivityTableProps {
  onSelected(id: number): void;
}


export default function ActivityTable({onSelected}: ActivityTableProps) {
  const { data, isLoading } = useSWR<Activity[]>("/api/activities/summary", fetcher);

  const renderCell = useCallback((activity: Activity, columnKey: React.Key) => {
    const cellValue = activity[columnKey as keyof Activity];

    switch (columnKey) {
      case "name":
        return cellValue as string;
      case "startDate": {
        return DateTime.fromISO(activity.startDate).toLocaleString(DateTime.DATE_MED);
      }
      case "movingTime": {
        const duration = Duration.fromObject({ seconds: activity.movingTime });
        return duration.toFormat("mm'm' ss's'");
      }
      default:
        return cellValue as string;
    }
  }, []);

  return (
    <Table
      aria-label="Activities table"
      selectionMode="single"
      onRowAction={(key)=>onSelected(key as number)}
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
