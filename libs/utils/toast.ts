import LibsState from "pkgs/system/store";
import { IToastStore, ToastStateAction } from "pkgs/system/store/toast";
import { IToast } from "../ui/Toast";

const toast = (params: IToastStore) => {
  LibsState.dispatch(ToastStateAction.update(params));
};

export default toast;
