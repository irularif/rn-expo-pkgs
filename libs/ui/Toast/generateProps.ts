import { useLibsSelector } from "pkgs/libs/hooks/useLibsStore";
import LibsState from "pkgs/system/store";
import { useEffect } from "react";

export const init = () => {
  const toast = useLibsSelector((state: any) => state.toast);

  useEffect(() => {
    console.log(toast);
  }, [toast]);

  return {};
};
