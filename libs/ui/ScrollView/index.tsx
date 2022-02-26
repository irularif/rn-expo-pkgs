import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView as RNScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  Animated,
} from "react-native";
import { IComponent } from "../../../types/global";
import getScrollViewProps, {
  getKeyboardAvoidingViewProps,
} from "./generateProps";

export interface IKeyboardAvoidingView
  extends IComponent,
    KeyboardAvoidingViewProps {
  children?: ReactNode;
}

export interface IScrollView extends IComponent, ScrollViewProps {
  keyboardAvoidingViewProps?: Partial<IKeyboardAvoidingView>;
  rootStyle?: StyleProp<ViewStyle>;
  rootClassName?: string;
  type?: "default" | "animated";
  children?: ReactNode;
}

const ScrollView = (props: IScrollView) => {
  const scrollViewProps = getScrollViewProps(props);
  const keyboarAvoidingViewProps = getKeyboardAvoidingViewProps(props);
  let Component: any = RNScrollView;
  if (props.type === "animated") {
    Component = Animated.ScrollView;
  }

  return (
    <KeyboardAvoidingView {...keyboarAvoidingViewProps}>
      <Component {...scrollViewProps} />
    </KeyboardAvoidingView>
  );
};

export default ScrollView;
