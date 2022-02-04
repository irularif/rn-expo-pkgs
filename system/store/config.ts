import { createSlice } from "@reduxjs/toolkit";
import { Camera } from "expo-camera";
import { cloneDeep } from "lodash";
import Storage from "pkgs/libs/utils/storage";
import { IConfigStore } from "../../types/global";

const initialConfigState: IConfigStore = {
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

const ConfigState = createSlice({
  name: "config",
  initialState: initialConfigState,
  reducers: {
    init(state, action) {
      return initialConfigState;
    },
    update(state, action) {
      let nstate = cloneDeep(state);
      Object.assign(nstate, action.payload);
      Storage.set("config", nstate);
      return nstate;
    },
    updateCamera(state, action) {
      let nstate = cloneDeep(state);
      Object.assign(nstate.camera, action.payload);
      Storage.set("config", nstate);
      return nstate;
    },
  },
});

export const ConfigStateAction = {
  ...ConfigState.actions,
  checkStorage: () => async (dispatch: any) => {
    let config = await Storage.get("config");
    if (!!config) {
      dispatch(ConfigStateAction.update(config));
    }
  },
};

export default ConfigState;
