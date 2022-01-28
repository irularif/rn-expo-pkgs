import AlertContext from "../../system/context/alert";
import { INITIAL_ALERT_STATE } from "../../system/store/alert";
import { IAlert } from "../../types/global";
import { cloneDeep } from "lodash";
import { useCallback, useContext } from "react";

const useAlert = () => {
  const alertProvider = useContext(AlertContext);

  if (alertProvider === null) {
    throw new Error(
      "'AlertContext' cannot be null, please add 'AlertContext' to the root component."
    );
  }

  const [state, dispatch] = alertProvider;

  //#region methods
  const alert = useCallback((data: IAlert) => {
    const nstate = cloneDeep(state);
    dispatch({
      ...nstate,
      ...data,
      visible: true,
      mode: "alert",
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prompt = useCallback((data: IAlert) => {
    const nstate = cloneDeep(state);
    dispatch({
      ...nstate,
      ...data,
      visible: true,
      mode: "prompt",
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  return {
    alert,
    prompt,
  };
};

export const useAlertState = () => {
  const alertProvider = useContext(AlertContext);

  if (alertProvider === null) {
    throw new Error(
      "'AlertContext' cannot be null, please add 'AlertContext' to the root component."
    );
  }

  const [state, dispatch] = alertProvider;

  //#region methods
  const init = useCallback(() => {
    dispatch(INITIAL_ALERT_STATE as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = useCallback(() => {
    const nstate = cloneDeep(state);
    dispatch({
      ...nstate,
      visible: true,
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const close = useCallback(() => {
    const nstate = cloneDeep(state);
    dispatch({
      ...nstate,
      visible: false,
    } as any);
    setTimeout(() => {
      init();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  //#endregion

  return {
    state,
    open,
    close,
    init,
  };
};

export default useAlert;
