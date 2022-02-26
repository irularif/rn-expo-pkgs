import React from "react";
import Button from "../Button";
import Modal, { IModal } from "../Modal";
import Text, { IText } from "../Text";
import View, { IView } from "../View";
import init, {
  getButtonOkProps,
  getContentProps,
  getModalProps,
  getTitleProps,
  getWrapperActionProps,
} from "./generateProps";

export interface IConfirmationComponent {
  title: string;
  titleProps?: IText;
  message?: string;
  messageProps?: IText;
  modalProps?: Partial<IModal>;
  wrapperActionProps?: IView;
  Content?: any;
  onDismiss?: Function;
}

const Confirmation = () => {
  const { actions, visibleState, Content, close } = init();

  const modalProps = getModalProps(visibleState, close);
  const titleProps = getTitleProps();
  const contentProps = getContentProps();
  const buttonOkProps = getButtonOkProps(close);
  const wrapperActionProps = getWrapperActionProps();

  return (
    <Modal {...modalProps}>
      {!!Content ? (
        Content
      ) : (
        <>
          <Text {...titleProps} />
          {!!contentProps.children && <Text {...contentProps} />}
        </>
      )}
      <View {...wrapperActionProps}>
        {!!actions?.length ? (
          actions.map((action, key) => {
            const onPress = (e: any) => {
              close();
              setTimeout(() => {
                if (!!action.onPress) {
                  action.onPress(e);
                }
              }, 300);
            };
            return <Button key={key} {...action} onPress={onPress} />;
          })
        ) : (
          <Button {...buttonOkProps} />
        )}
      </View>
    </Modal>
  );
};

export default Confirmation;
