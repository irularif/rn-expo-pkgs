import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

export interface IToastStore {
  message: string;
  duration: number;
}

const initialToastState = {
  message: "",
  duration: 0,
  init: false,
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
