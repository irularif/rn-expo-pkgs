import { IComponent } from "../../../types/global";
import React from "react";
import { StyleProp, Text as RNText, TextProps, TextStyle } from "react-native";
import getTextProps from "./generateProps";

export interface IText extends IComponent, TextProps {
  style?: StyleProp<TextStyle>;
}

const Text = (props: IText) => {
  const textProps = getTextProps(props);

  return <RNText {...textProps} />;
};

export default Text;
