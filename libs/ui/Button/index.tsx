import { IComponent } from "../../../types/global";
import React, { useState } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon, { IIcon } from "../Icon";
import Spinner, { ISpinner } from "../Spinner";
import Text, { IText } from "../Text";
import getButtonProps, {
  getLeftIconProps,
  getRightIconProps,
  getSpinnerProps,
  getTextProps,
} from "./generateProps";

export interface IButton extends IComponent, TouchableOpacityProps {
  label?: string;
  size?: "small" | "medium" | "large" | "custom";
  variant?: "primary" | "secondary" | "link";
  direction?: "horizontal" | "vertical";
  type?: "button" | "submit" | "reset";
  prefix?: IIcon | JSX.Element;
  suffix?: IIcon | JSX.Element;
  fill?: boolean;
  round?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  labelProps?: IText;
  spinnerProps?: ISpinner;
  children?: any;
}

const Button = (props: IButton) => {
  const pressState = useState(false);
  const buttonProps = getButtonProps(props, pressState);

  return (
    <TouchableOpacity {...buttonProps}>
      <RenderPrefix {...props} />
      <RenderChildren buttonProps={props} pressState={pressState} />
      <RenderSuffix {...props} />
    </TouchableOpacity>
  );
};

const RenderChildren = (props: any) => {
  const { buttonProps } = props;
  if (!!buttonProps.children) {
    return buttonProps.children;
  } else if (!!buttonProps.label) {
    const textProps = getTextProps(buttonProps, props.pressState);
    return <Text {...textProps}>{buttonProps.label}</Text>;
  }

  return null;
};

const RenderPrefix = (props: IButton) => {
  if (props.isLoading) {
    const spinnerProps = getSpinnerProps(props);
    return <Spinner {...spinnerProps} />;
  } else if (!!props.prefix) {
    if (typeof props.prefix === "function") {
      return props.prefix;
    }
    const leftIcon = getLeftIconProps(props);
    return <Icon {...leftIcon} />;
  }

  return null;
};

const RenderSuffix = (props: IButton) => {
  if (props.suffix) {
    if (typeof props.suffix === "function") {
      return props.suffix;
    }
    const rightIcon = getRightIconProps(props);
    return <Icon {...rightIcon} />;
  }

  return null;
};

export default Button;
