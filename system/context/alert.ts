import { ActionTypes } from "../store/alert";
import { IAlertStore } from "../../types/global";
import { createContext } from "react";

const AlertContext = createContext<
  [IAlertStore, React.Dispatch<ActionTypes>] | null
>(null);

export default AlertContext;
