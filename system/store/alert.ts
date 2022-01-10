import { IAlertStore } from "../../types/global";
import { cloneDeep } from "lodash";

export enum ALERT_ACTIONS {
  UPDATE,
  INIT,
}

export interface IUpdateAlert {
  type: ALERT_ACTIONS;
  data: any;
}

export type ActionTypes = IUpdateAlert;

export const INITIAL_ALERT_STATE: IAlertStore = {
  init: false,
  title: "Alert",
  onOK: () => {},
  onCancel: () => {},
  visible: false,
  mode: "alert",
  customize: {},
};

const AlertStore = (state: IAlertStore, action: ActionTypes) => {
  const { type, data } = action;
  let clonedState: IAlertStore = cloneDeep(state);

  switch (type) {
    case ALERT_ACTIONS.UPDATE:
      Object.assign(clonedState, data);
      clonedState.init = true;
      return clonedState;
    case ALERT_ACTIONS.INIT:
      return INITIAL_ALERT_STATE;
    default:
      return state;
  }
};

export default AlertStore;
