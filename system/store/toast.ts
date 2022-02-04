import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IToast } from "pkgs/libs/ui/Toast";

export interface IToastStore {
  message: string;
  duration: number;
  props?: Partial<IToast>;
}

export interface IBaseToast extends IToastStore {
  init: boolean;
}

const initialToastState: IBaseToast = {
  message: "",
  duration: 0,
  init: false,
  props: {},
};

const ToastState = createSlice({
  name: "toast",
  initialState: initialToastState,
  reducers: {
    init(state, action) {
      return initialToastState;
    },
    update(state, action) {
      let nstate = cloneDeep(state);
      Object.assign(nstate, action.payload);
      return nstate;
    },
  },
});

export const ToastStateAction = ToastState.actions;

export default ToastState;
