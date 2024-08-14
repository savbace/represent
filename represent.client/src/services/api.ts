export interface Activity {
  id: number;
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
        medium: string;
      };
    };
  };
}

export interface User {
  name: string;
}

// @ts-expect-error "pass args 'as is'"
export const fetcher = (...args) => fetch(...args).then(res => res.json());

