import { useLibsSelector } from "pkgs/libs/hooks/useLibsStore";
import Button from "../Button";
import Portal from "../Portal";
import Text, { IText } from "../Text";
import View, { IView } from "../View";
import { generateTextProps, generateWrapperProps, init } from "./generateProps";

export interface IToast extends IView {
  position?: "top" | "bottom";
  messageProps?: IText;
}

const Toast = () => {
  const { animate, visible } = init();

  return (
    <Portal hostName="libs">
      <RenderToast animate={animate} visible={visible} />
    </Portal>
  );
};

const RenderToast = (props: any) => {
  const { actions } = useLibsSelector((state) => state.toast);
  const wrapperProps = generateWrapperProps(props.animate);
  const textProps = generateTextProps();

  if (!props.visible) return null;

  return (
    <View {...wrapperProps}>
      {!!wrapperProps.children ? (
        typeof wrapperProps.children === "function" ? (
          wrapperProps.children()
        ) : (
          wrapperProps.children
        )
      ) : (
        <Text {...textProps} />
      )}
      {actions?.map((action) => (
        <Button {...action} />
      ))}
    </View>
  );
};

export default Toast;
