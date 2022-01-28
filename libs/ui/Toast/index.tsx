import View from "../View";
import Text from "../Text";
import Portal from "../Portal";
import Button from "../Button";
import { init } from "./generateProps";

export interface IToast {}

const Toast = () => {
  init();

  return (
    <Portal hostName="libs">
      <RenderToast />
    </Portal>
  );
};

const RenderToast = () => {
  const toastProps = {};

  return null;

  return (
    <Button {...toastProps}>
      <Text>Toast</Text>
    </Button>
  );
};

export default Toast;
