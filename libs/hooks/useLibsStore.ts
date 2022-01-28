import LibsState, { LibsContext } from "pkgs/system/store";
import { useContext } from "react";

export const useLibsSelector = (selector: any = undefined) => {
  const context = useContext(LibsContext);

  if (!!selector && typeof selector === "function") {
    return selector(context);
  }

  return context;
};

export const useLibsDispatch = () => {
  return LibsState.dispatch;
};
