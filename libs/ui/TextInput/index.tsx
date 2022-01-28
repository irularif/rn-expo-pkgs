import { IComponent } from "../../../types/global";
import React, { useRef, useState } from "react";
import {
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps,
  TextStyle,
} from "react-native";
import Button, { IButton } from "../Button";
import View, { IView } from "../View";
import getTextInputProps, {
  getClearButtonProps,
  getPrefixButtonProps,
  getSecureProps,
  getSufixButtonProps,
  getWrapperProps,
  init,
} from "./generateProps";
import { SvgProps } from "react-native-svg";

export type TInputType =
  | "text"
  | "number"
  | "password"
  | "decimal"
  | "multiline"
  | "currency"
  | "email"
  | "float"
  | "url"
  | "mask";

export interface IPrefixSuffix extends IButton {}

export interface ITextInput extends IComponent, Omit<TextInputProps, "value"> {
  value?: string | number;
  type?: TInputType;
  // mask?: string;
  style?: StyleProp<TextStyle>;
  secureButtonProps?: IButton;
  wrapperProps?: IView;
  clearButton?: boolean;
  children?: any;
  clearButtonProps?: IButton;
  prefix?: IButton | JSX.Element;
  suffix?: IButton | JSX.Element;
  isError?: boolean;
  iconSecure?: string | React.FC<SvgProps>;
  iconSecureOff?: string | React.FC<SvgProps>;
}

const TextInput = (props: ITextInput) => {
  const { focusState } = init(props);
  const [secure, setsecure] = useState(props.type === "password");
  const textInputProps = getTextInputProps(props, focusState, secure);
  const wrapperProps = getWrapperProps(props, focusState);

  return (
    <View {...wrapperProps}>
      <RenderPrefix {...props} />
      <RNTextInput {...textInputProps} />
      <RenderClearButton inputProps={props} textInputProps={textInputProps} />
      <RenderScureButton
        inputProps={props}
        setsecure={setsecure}
        secure={secure}
      />
      <RenderSuffix {...props} />
    </View>
  );
};

const RenderScureButton = (props: any) => {
  if (props.inputProps.type === "password") {
    const buttonProps = getSecureProps(
      props.inputProps,
      props.secure,
      props.setsecure
    );

    return <Button {...buttonProps} />;
  }

  return null;
};

const RenderClearButton = (props: any) => {
  if (props.inputProps.clearButton) {
    const buttonProps = getClearButtonProps(
      props.inputProps,
      props.textInputProps
    );

    return <Button {...buttonProps} />;
  }

  return null;
};

const RenderPrefix = (props: ITextInput) => {
  if (!!props.prefix) {
    if (typeof props.prefix === "function") {
      return props.prefix;
    }
    const prefixProps = getPrefixButtonProps(props);
    return <Button {...prefixProps} />;
  }

  return null;
};

const RenderSuffix = (props: ITextInput) => {
  if (!!props.suffix) {
    if (typeof props.suffix === "function") {
      return props.suffix;
    }
    const sufixProps = getSufixButtonProps(props);
    return <Button {...sufixProps} />;
  }

  return null;
};

export default TextInput;
