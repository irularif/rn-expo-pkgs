import { Camera } from "expo-camera";
import { IConfigStore } from "../../types/global";
import { cloneDeep } from "lodash";

export enum CONFIG_ACTIONS {
  UPDATE_CAMERA,
  UPDATE_STATUSBAR,
  UPDATE_ALL,
  UPDATE_THEME,
}

export interface IUpdateConfig {
  type: CONFIG_ACTIONS;
  data: any;
}

export type ActionTypes = IUpdateConfig;

export const INITIAL_CONFIG_STATE: IConfigStore = {
  camera: {
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.auto,
    ratio: "4:3", // 4:3, 16:9, 1:1
  },
  statusBar: {
    translucent: true,
    statusBarBgColor: "transparent",
    statusBarStyle: "dark-content",
  },
  theme: "light",
};

const ConfigStore = (state: IConfigStore, action: ActionTypes) => {
  const { type, data } = action;
  let clonedState: IConfigStore = cloneDeep(state);

  switch (type) {
    case CONFIG_ACTIONS.UPDATE_CAMERA:
      clonedState.camera = data;
      return clonedState;
    case CONFIG_ACTIONS.UPDATE_STATUSBAR:
      clonedState.statusBar = data;
      return clonedState;
    case CONFIG_ACTIONS.UPDATE_ALL:
      Object.assign(clonedState.camera, data);
      return clonedState;
    case CONFIG_ACTIONS.UPDATE_THEME:
      clonedState.theme = data;
      return clonedState;
    default:
      return state;
  }
};

export default ConfigStore;
