import { createContext } from "react";

export interface User {
  name: string;
}

export const UserContext = createContext<User | null | undefined>(null);
