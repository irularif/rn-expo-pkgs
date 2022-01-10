import { IComponent } from "../../../types/global";
import React, { ReactNode } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView as RNScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import View from "../View";
import getScrollViewProps, {
  getKeyboardAvoidingViewProps,
  getViewProps,
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
  const viewProps = getViewProps(props);
  const scrollViewProps = getScrollViewProps(props);
  const keyboarAvoidingViewProps = getKeyboardAvoidingViewProps(props);
  let Component: any = RNScrollView;
  // if (props.scrollEnabled === false) {
  //   Component = View;
  // } else if (props.type === "animated") {
  //   Component = Animated.ScrollView;
  // }

  return (
    <KeyboardAvoidingView {...keyboarAvoidingViewProps}>
      <Component {...scrollViewProps} />
    </KeyboardAvoidingView>
  );
};

export default ScrollView;
