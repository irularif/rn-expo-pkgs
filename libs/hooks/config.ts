import ConfigContext from "../../system/context/config";
import { CONFIG_ACTIONS } from "../../system/store/config";
import { useCallback, useContext } from "react";

const useConfig = () => {
  const portal = useContext(ConfigContext);

  if (portal === null) {
    throw new Error(
      "'ConfigContext' cannot be null, please add 'ConfigContext' to the root component."
    );
  }

  const [config, dispatch] = portal;

  //#region methods
  const updateAll = useCallback((data) => {
    dispatch({
      type: CONFIG_ACTIONS.UPDATE_ALL,
      data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateCamera = useCallback((data) => {
    dispatch({
      type: CONFIG_ACTIONS.UPDATE_CAMERA,
      data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateStatusBar = useCallback((data) => {
    dispatch({
      type: CONFIG_ACTIONS.UPDATE_STATUSBAR,
      data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateTheme = useCallback((data) => {
    dispatch({
      type: CONFIG_ACTIONS.UPDATE_THEME,
      data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  return {
    config,
    updateAll,
    updateCamera,
    updateStatusBar,
    updateTheme,
  };
};

export default useConfig;
