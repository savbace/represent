export interface Activity {
  id: number;
  name: string;
  distance: number;
  movingTime: number;
  startDate: string;
  totalElevationGain: number;
  mapPolyline: string;
  photoCount: number;
}

export interface ActivityPhoto {
  id: string;
  url: string;
}

export interface User {
  name: string;
}

// @ts-expect-error "pass args 'as is'"
export const fetcher = (...args) => fetch(...args).then((res) => res.json());
