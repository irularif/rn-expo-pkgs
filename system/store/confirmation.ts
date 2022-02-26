import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IButton } from "pkgs/libs/ui/Button";
import { IConfirmationComponent } from "pkgs/libs/ui/Confirmation";

export interface IConfirmationStore {
  title?: string;
  message?: string;
  actions?: IButton[];
  props?: Partial<IConfirmationComponent>;
}

export interface IBaseConfirmation extends IConfirmationStore {
  init: boolean;
}

const initialConfirmationState: IBaseConfirmation = {
  init: false,
  title: "Confirm",
  message: "",
  actions: [],
  props: {},
};

const ConfirmationState = createSlice({
  name: "confirmation",
  initialState: initialConfirmationState,
  reducers: {
    init(state, action) {
      return initialConfirmationState;
    },
    update(state, action) {
      let nstate = cloneDeep(state);
      Object.assign(nstate, action.payload);
      return nstate;
    },
  },
});

export const ConfirmationStateAction = ConfirmationState.actions;

export default ConfirmationState;
