import { get, merge, set } from "lodash";
import { useLibsDispatch, useLibsSelector } from "pkgs/libs/hooks/useLibsStore";
import { ConfirmationStateAction } from "pkgs/system/store/confirmation";
import { useEffect, useState } from "react";
import { IButton } from "../Button";
import { IModal } from "../Modal";

const init = () => {
  const dispatch = useLibsDispatch();
  const state = useLibsSelector((state) => state.confirmation);
  const visibleState = useState(false);
  const [_, setvisible] = visibleState;

  const Content = get(state, "props.Content", null);

  const open = () => {
    setvisible(true);
  };

  const close = () => {
    setvisible(false);
    setTimeout(() => {
      dispatch(ConfirmationStateAction.init({}));
    }, 300);
  };

  useEffect(() => {
    if (state.init) {
      open();
    } else {
      close();
    }
  }, [state]);

  return {
    visibleState,
    close,
    actions: state.actions,
    Content,
  };
};

export const getModalProps = (visibleState: any, close: any) => {
  const [visible] = visibleState;
  const state = useLibsSelector((state) => state.confirmation);
  const cprops = get(state, "props.modalProps", {});
  const className = `p-4 m-6 z-40 ${get(
    state,
    "props.modalProps.className",
    ""
  )}`;
  const backdropProps = get(state, "props.modalProps.backdropProps", {});
  const panelProps = get(state, "props.modalProps.panelProps", {});
  merge(backdropProps, {
    className: `z-40 ${backdropProps.className || ""}`,
  });
  merge(panelProps, {
    className: `z-40 ${panelProps.className || ""}`,
  });
  const onClose = (e: any) => {
    close();
    setTimeout(() => {
      if (!!state.props?.onDismiss) {
        state.props?.onDismiss(e);
      }
    }, 300);
  };

  return {
    ...cprops,
    backdropProps,
    panelProps,
    className,
    position: "center",
    visible,
    onClose,
  } as IModal;
};

export const getTitleProps = () => {
  const state = useLibsSelector((state) => state.confirmation);
  const cprops = get(state, "props.titleProps", {});
  const children = get(state, "title", "");
  const className = `text-xl text-center font-bold mb-4 ${get(
    state,
    "props.titleProps.className",
    ""
  )}`;

  return {
    ...cprops,
    children,
    className,
  };
};

export const getContentProps = () => {
  const state = useLibsSelector((state) => state.confirmation);
  const cprops = get(state, "props.messageProps", {});
  const children = get(state, "message", "");
  const className = `text-center ${get(
    state,
    "props.messageProps.className",
    ""
  )}`;

  return {
    ...cprops,
    children,
    className,
  };
};

export const getButtonOkProps = (close: any) => {
  const cprops = {
    variant: "link",
    className: "text-center px-8 py-2 m-0",
    label: "Ok",
  };
  const onPress = () => {
    close();
  };

  return {
    ...cprops,
    onPress,
  } as IButton;
};

export const getWrapperActionProps = () => {
  const state = useLibsSelector((state) => state.confirmation);
  const cprops = get(state, "props.wrapperActionProps", {});

  const className = `flex-row justify-end self-end mt-8 ${get(
    state,
    "props.wrapperActionProps.className",
    ""
  )}`;

  return {
    ...cprops,
    className,
  };
};
export default init;
