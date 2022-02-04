import LibsState from "pkgs/system/store";
import { IToastStore, ToastStateAction } from "pkgs/system/store/toast";

const toast = (params: IToastStore) => {
  LibsState.dispatch(ToastStateAction.update({ ...params, init: true }));
};

export default toast;
