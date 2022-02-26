import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IButton } from "pkgs/libs/ui/Button";
import { IToast } from "pkgs/libs/ui/Toast";

export interface IToastStore {
  message: string;
  duration: number;
  actions?: IButton[];
  props?: Partial<IToast>;
}

export interface IBaseToast extends IToastStore {
  init: boolean;
}

const initialToastState: IBaseToast = {
  duration: 0,
  message: "",
  init: false,
  actions: [],
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
