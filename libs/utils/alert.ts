import { cloneDeep } from "lodash";
import LibsState, { TLibsState } from "pkgs/system/store";
import {
  ConfirmationStateAction,
  IConfirmationStore,
} from "pkgs/system/store/confirmation";
import { IToastStore, ToastStateAction } from "pkgs/system/store/toast";

const toast = (params: IToastStore) => {
  let state: TLibsState = LibsState.getState();
  if (state.toast.init) {
    LibsState.dispatch(ToastStateAction.init({}));
  }

  setTimeout(
    () => {
      LibsState.dispatch(ToastStateAction.update({ ...params, init: true }));
    },
    state.toast.init ? 200 : 0
  );
};

const confirmation = (params: IConfirmationStore) => {
  let state: TLibsState = LibsState.getState();
  if (state.confirmation.init) {
    LibsState.dispatch(ConfirmationStateAction.init({}));
  }

  setTimeout(
    () => {
      LibsState.dispatch(
        ConfirmationStateAction.update({ ...params, init: true })
      );
    },
    state.confirmation.init ? 200 : 0
  );
};

const Alert = {
  toast,
  confirmation,
};

export default Alert;
