import { ActionTypes } from "libs/store/config";
import { IConfigStore } from "../../types/global";
import { createContext } from "react";

const ConfigContext = createContext<
  [IConfigStore, React.Dispatch<ActionTypes>] | null
>(null);

export default ConfigContext;
