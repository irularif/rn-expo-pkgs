import { get, set } from "lodash";
import { useState } from "react";
import { useAlertState } from "../../hooks/alert";
import { IButton } from "../Button";
import { IModal } from "../Modal";

const init = () => {
  const metaState: any = useState({
    visible: false,
    title: "",
    message: "",
    onOK: () => {},
    onCancel: () => {},
    customize: undefined,
  });

  return metaState;
};

export const getModalProps = () => {
  const { state, close } = useAlertState();
  const cprops = get(state, "customize.modalProps", {});
  const className = `p-4 pb-2 m-6 ${get(
    state,
    "customize.modalProps.wrapperProps.className",
    ""
  )}`;
  set(cprops, "wrapperProps.className", className);
  const onClose = () => {
    close();
  };

  return {
    ...cprops,
    position: "center",
    visible: state.visible,
    onClose,
  } as IModal;
};

export const getTitleProps = () => {
  const { state: alert } = useAlertState();
  const cprops = get(alert, "customize.titleProps", {});
  const children = get(alert, "title", "");
  const className = `text-2xl text-center font-bold pb-4 ${get(
    alert,
    "customize.titleProps.className",
    ""
  )}`;

  return {
    ...cprops,
    children,
    className,
  };
};

export const getContentProps = () => {
  const { state: alert } = useAlertState();
  const cprops = get(alert, "customize.messageProps", {});
  const children = get(alert, "message", "");
  const className = `text-lg text-center text-base ${get(
    alert,
    "customize.messageProps.className",
    ""
  )}`;

  return {
    ...cprops,
    children,
    className,
  };
};

export const getButtonOkProps = () => {
  const { state: alert, close } = useAlertState();
  const cprops = get(alert, "customize.actionOkProps", {});
  const className = `text-lg text-center px-8 ${get(
    alert,
    "customize.actionOkProps.className",
    ""
  )}`;

  const label = get(
    alert,
    "customize.labelOk",
    get(alert, "customize.actionOkProps.label", "Ok")
  );
  const onPress = () => {
    let onPress = get(alert, "onOK", null);
    setTimeout(() => {
      if (onPress) {
        onPress();
      }
    }, 300);
    close();
  };

  return {
    ...cprops,
    onPress,
    label,
    className,
  } as IButton;
};

export const getButtonCancelProps = () => {
  const { state: alert, close } = useAlertState();
  const cprops = get(alert, "customize.actionCancelProps", {});
  const className = `text-lg text-center px-8 text-base text-black mr-2 ${get(
    alert,
    "customize.actionCancelProps.className",
    ""
  )}`;

  const label = get(
    alert,
    "customize.labelCancel",
    get(alert, "customize.actionCancelProps.label", "Cancel")
  );
  const onPress = () => {
    let onPress = get(alert, "onCancel", null);
    setTimeout(() => {
      if (onPress) {
        onPress();
      }
    }, 300);
    close();
  };

  return {
    variant: "secondary",
    ...cprops,
    onPress,
    label,
    className,
  } as IButton;
};

export const getWrapperActionProps = () => {
  const { state: alert } = useAlertState();
  const cprops = get(alert, "customize.wrapperActionProps", {});

  const className = `flex-row justify-end mt-4 ${get(
    alert,
    "customize.wrapperActionProps.className",
    ""
  )}`;

  return {
    ...cprops,
    className,
  };
};
export default init;
