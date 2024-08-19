import { DateTime, Duration } from "luxon";

export function formatDuration(seconds: number) {
  const duration = Duration.fromObject({ seconds });
  const oneHour = Duration.fromObject({ hour: 1 });
  const timeFormatted =
    duration.valueOf() < oneHour.valueOf() ? duration.toFormat("mm'm' ss's'") : duration.toFormat("hh'h' mm'm' ss's'");

  return timeFormatted;
}

export function formatDistance(meters: number) {
  const km = meters / 1000;
  const distance = `${km.toFixed(2)} km`;

  return distance;
}

export function formatDate(value: string) {
  return DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED);
}
