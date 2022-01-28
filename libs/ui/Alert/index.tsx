import AlertContext from "../../../system/context/alert";
import { useAlertState } from "../../hooks/alert";
import { IComponent } from "../../../types/global";
import React, { ReactNode } from "react";
import Button, { IButton } from "../Button";
import Modal, { IModal } from "../Modal";
import Text, { IText } from "../Text";
import View, { IView } from "../View";
import init, {
  getButtonCancelProps,
  getButtonOkProps,
  getContentProps,
  getModalProps,
  getTitleProps,
  getWrapperActionProps,
} from "./generateProps";

export interface IAlertComponent {
  title: string;
  titleProps?: IText;
  message?: string;
  messageProps?: IText;
  labelOk?: string;
  labelCancel?: string;
  actionOkProps?: IButton;
  actionCancelProps?: IButton;
  modalProps?: Partial<IModal>;
  wrapperActionProps?: IView;
  image?: ReactNode;
}
const Alert = ({ children }: IComponent) => {
  const alert = init();

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <RenderAlert />
    </AlertContext.Provider>
  );
};

const RenderAlert = () => {
  const { state } = useAlertState();
  const modalProps = getModalProps();
  const titleProps = getTitleProps();
  const contentProps = getContentProps();
  const buttonOkProps = getButtonOkProps();
  const buttonCancelProps = getButtonCancelProps();
  const wrapperActionProps = getWrapperActionProps();

  return (
    <Modal {...modalProps}>
      {!!state.customize?.image && typeof state.customize?.image === "function"
        ? state.customize?.image()
        : state.customize?.image}
      <Text {...titleProps} />
      {!!contentProps.children && <Text {...contentProps} />}
      <View {...wrapperActionProps}>
        {state.mode === "prompt" && <Button {...buttonCancelProps} />}
        <Button {...buttonOkProps} />
      </View>
    </Modal>
  );
};

export default Alert;
