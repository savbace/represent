import useSWR from "swr";
import { fetcher, User } from "./api";

export function useUser() {
  const { data } = useSWR<User>("/api/user", fetcher);

  return { user: data };
}
