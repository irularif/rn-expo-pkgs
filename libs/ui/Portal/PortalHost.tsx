import React, { useEffect, memo } from "react";
import { usePortal } from "../../hooks";
import View from "../View";
import { SafeAreaView } from "react-native";

export interface IPortalHost {
  /**
   * Host's key or name to be used as an identifer.
   * @type string
   */
  name: string;
}

const PortalHostComponent = ({ name }: IPortalHost) => {
  //#region hooks
  const { portal: state, registerHost, deregisterHost } = usePortal(name);
  //#endregion

  //#region effects
  useEffect(() => {
    registerHost();
    return () => {
      deregisterHost();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region render
  return <>{state?.map((item) => item.node)}</>;
  //#endregion
};

const PortalHost = memo(PortalHostComponent);
PortalHost.displayName = "PortalHost";

export default PortalHost;
