import { PortalType } from "../../types/global";
import { ReactNode } from "react";

export interface IAddUpdatePortalAction {
  type: PORTAL_ACTIONS;
  hostName: string;
  portalId: string;
  node: ReactNode;
}

export interface IRemovePortalAction {
  type: PORTAL_ACTIONS;
  hostName: string;
  portalId: string;
}

export interface IRegisterHostAction {
  type: PORTAL_ACTIONS;
  hostName: string;
}

export interface IUnregisterHostAction {
  type: PORTAL_ACTIONS;
  hostName: string;
}

export type ActionTypes =
  | IAddUpdatePortalAction
  | IRemovePortalAction
  | IRegisterHostAction
  | IUnregisterHostAction;

export enum PORTAL_ACTIONS {
  REGISTER_HOST,
  DEREGISTER_HOST,
  ADD_UPDATE_PORTAL,
  REMOVE_PORTAL,
}

export const INITIAL_PORTAL_STATE = {};

const registerHost = (
  state: Record<string, Array<PortalType>>,
  hostName: string
) => {
  if (!(hostName in state)) {
    state[hostName] = [];
  }
  return state;
};

const deregisterHost = (
  state: Record<string, Array<PortalType>>,
  hostName: string
) => {
  delete state[hostName];
  return state;
};

const addUpdatePortal = (
  state: Record<string, Array<PortalType>>,
  hostName: string,
  portalId: string,
  node: any
) => {
  if (!(hostName in state)) {
    state = registerHost(state, hostName);
  }

  /**
   * updated portal, if it was already added.
   */
  const index = state[hostName].findIndex((item) => item.portalId === portalId);
  if (index !== -1) {
    state[hostName][index].node = node;
  } else {
    state[hostName].push({
      portalId,
      node,
    });
  }
  return state;
};

const removePortal = (
  state: Record<string, Array<PortalType>>,
  hostName: string,
  portalId: string
) => {
  if (!(hostName in state)) {
    console.warn({
      component: PortalStore.name,
      method: removePortal.name,
      params: `Failed to remove portal '${portalId}', '${hostName}' was not registered!`,
    });

    return state;
  }

  const index = state[hostName].findIndex((item) => item.portalId === portalId);
  if (index !== -1) state[hostName].splice(index, 1);
  return state;
};

const PortalStore = (
  state: Record<string, Array<PortalType>>,
  action: ActionTypes
) => {
  const { type } = action;
  let clonedState = { ...state };
  switch (type) {
    case PORTAL_ACTIONS.REGISTER_HOST:
      return registerHost(clonedState, action.hostName);
    case PORTAL_ACTIONS.DEREGISTER_HOST:
      return deregisterHost(clonedState, action.hostName);
    case PORTAL_ACTIONS.ADD_UPDATE_PORTAL:
      return addUpdatePortal(
        clonedState,
        action.hostName,
        (action as IAddUpdatePortalAction).portalId,
        (action as IAddUpdatePortalAction).node
      );
    case PORTAL_ACTIONS.REMOVE_PORTAL:
      return removePortal(
        clonedState,
        action.hostName,
        (action as IRemovePortalAction).portalId
      );
    default:
      return state;
  }
};

export default PortalStore;
