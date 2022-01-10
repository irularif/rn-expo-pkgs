import { useAlertState } from "../../hooks/alert";
import { get } from "lodash";
import { useState } from "react";
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
  const { state } = useAlertState();
  const onClose = () => {};

  return {
    position: "center",
    visible: state.visible,
    wrapperProps: {
      rootClassName: "m-6",
      className: "p-4 pb-2",
      rootStyle: {
        minWidth: 300,
      },
    },
    onClose,
  } as IModal;
};

export const getTitleProps = () => {
  const { state: alert } = useAlertState();
  const cprops = get(alert, "customize.titleProps", {});
  const children = get(alert, "title", "");
  const className = `text-2xl text-center flex-grow font-bold pb-4 ${get(
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
  const cprops = get(alert, "messageProps", {});
  const children = get(alert, "message", "");
  const className = `text-lg text-center flex-grow text-base ${get(
    alert,
    "messageProps.className",
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
  const cprops = get(alert, "actionOkProps", {});
  const className = `text-lg text-center px-8 text-base bg-blue-500 ${get(
    alert,
    "actionOkProps.className",
    ""
  )}`;

  const label = get(alert, "labelOk", "Ok");
  const onPress = () => {
    let onPress = get(alert, "onOK", null);
    if (onPress) {
      onPress();
    }
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
  const cprops = get(alert, "actionOkProps", {});
  const className = `text-lg text-center px-8 text-base text-black ${get(
    alert,
    "actionOkProps.className",
    ""
  )}`;

  const label = get(alert, "labelCancel", "Cancel");
  const onPress = () => {
    let onPress = get(alert, "onCancel", null);
    if (onPress) {
      onPress();
    }
    close();
  };

  return {
    ...cprops,
    onPress,
    label,
    className,
    variant: "link",
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
