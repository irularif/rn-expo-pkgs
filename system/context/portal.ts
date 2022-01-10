import { ActionTypes } from "../store/portal";
import { PortalType } from "../../types/global";
import { createContext } from "react";

export const PortalContext = createContext<
  [Record<string, PortalType[]>, React.Dispatch<ActionTypes>] | null
>(null);
