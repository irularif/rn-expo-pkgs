import { PortalContext } from "../../../system/context/portal";
import PortalStore, {
  INITIAL_PORTAL_STATE,
} from "../../../system/store/portal";
import React, { memo, useReducer } from "react";
import PortalHost from "./PortalHost";

const PortalProviderComponent = ({ children }: any) => {
  const portalState = useReducer(PortalStore, INITIAL_PORTAL_STATE);
  return (
    <PortalContext.Provider value={portalState}>
      {children}
      <PortalHost name="root" />
      <PortalHost name="libs" />
    </PortalContext.Provider>
  );
};

const PortalProvider = memo(PortalProviderComponent);
PortalProvider.displayName = "PortalProvider";

export default PortalProvider;
