import { useContext, useCallback, ReactNode } from "react";
import { PORTAL_ACTIONS } from "../../system/store/portal";
import { PortalContext } from "../../system/context/portal";

const usePortal = (hostName: string = "root") => {
  const portal = useContext(PortalContext);

  if (portal === null) {
    throw new Error(
      "'PortalDispatchContext' cannot be null, please add 'PortalProvider' to the root component."
    );
  }

  const [state, dispatch] = portal;

  //#region methods
  const registerHost = useCallback(() => {
    dispatch({
      type: PORTAL_ACTIONS.REGISTER_HOST,
      hostName: hostName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deregisterHost = useCallback(() => {
    dispatch({
      type: PORTAL_ACTIONS.DEREGISTER_HOST,
      hostName: hostName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUpdatePortal = useCallback((name: string, node: ReactNode) => {
    dispatch({
      type: PORTAL_ACTIONS.ADD_UPDATE_PORTAL,
      hostName,
      portalId: name,
      node,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePortal = useCallback((name: string) => {
    dispatch({
      type: PORTAL_ACTIONS.REMOVE_PORTAL,
      hostName,
      portalId: name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  return {
    portal: state[hostName],
    registerHost,
    deregisterHost,
    addUpdatePortal,
    removePortal,
  };
};

export default usePortal;
